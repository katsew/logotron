import { Pen } from './pen/index';
import { Turtle } from './turtle/index';
import { ExecQueue } from './exec-queue/index';
import { CommandHandler } from './command-handler/index';
import { CodeRunner } from './code-runner/index';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants/index';

import * as Debug from 'debug';
const debug = Debug('Logotron:Main');

const penCanvas = <HTMLCanvasElement>document.getElementById('p');
const turtleCanvas = <HTMLCanvasElement>document.getElementById('t');
penCanvas.width = turtleCanvas.width = CANVAS_WIDTH;
penCanvas.height = turtleCanvas.height = CANVAS_HEIGHT;
const penCanvasCtx = <CanvasRenderingContext2D>penCanvas.getContext('2d');
const turtleCanvasCtx = <CanvasRenderingContext2D>turtleCanvas.getContext('2d');
const textarea = <HTMLTextAreaElement>document.getElementById('editCommand');
const buttonRun = <HTMLButtonElement>document.getElementById('buttonRun');
const buttonReset = <HTMLButtonElement>document.getElementById('buttonReset');
const turtle = new Turtle(turtleCanvasCtx);
const pen = new Pen(penCanvasCtx);
const callStack = new ExecQueue();
const commandHandler = new CommandHandler(pen, turtle, callStack);

let instance = null;
buttonRun.addEventListener('click', function(e) {
  
  if (instance != null && instance.isRunning()) {
    debug('Logo still running commands, isRunning', instance.isRunning);
    return false;
  }

  pen.initialize();
  turtle.initialize();

  const inputs = textarea.value;
  // const commands = CommandHandler.parseCommands(inputs);
  // debug('Commands: ', commands);
  // commands.filter(function(command) {
  //   return command !== '' && command != null;
  // }).forEach(function (command) {
  //   let commandName = CommandHandler.getCommandName(command);
  //   let commandArgs = CommandHandler.getCommandArgs(command);
  //   try {
  //     commandHandler.register(commandName, commandArgs);
  //     debug('Command Name: ', commandName);
  //     debug('Command Args', commandArgs);
  //   } catch (e) {
  //     console.warn(e.name);
  //     console.warn(e.message);
  //   }
  // });
  // const codeRunner = new CodeRunner(callStack, 30);
  // instance = codeRunner;
  // codeRunner.run();

  /**
   * Stop parse commands manually and create new function from string
   * and evaluate it.
   * To catch Exception like SyntaxError, use Promise#catch.
   * 
   * @todo Implement LOGO command parser 
   */
  const promise = new Promise((resolve, reject) => {

    const execute = new Function(inputs);
    try {
      execute();
    } catch (e) {
      reject(e);
    }
    resolve();

  });
  debug(inputs);
  promise.then(() => {
    debug('=== RESOLVE PROMISE ===');
  }).catch((e) => {
    console.warn(e);
  });

}, false);

buttonReset.addEventListener('click', function() {
  (<any>window).RESET();
});

/**
 * Add REPL command line interface
 * (cmd + i) to open dev tool and run commands below.
 * 
 * @todo Classify
 */
(<any>window).INSTANCE = new CodeRunner(callStack, 30);
(<any>window).RESET = function() {
  debug('=== RESET PEN AND TURTLE ===');
  pen.initialize();
  turtle.initialize();
};
(<any>window).FD = function(length: string) {
  commandHandler.FD(length);
  (<any>window).INSTANCE.run();
};
(<any>window).BK = function(length: string) {
  commandHandler.BK(length);
  (<any>window).INSTANCE.run();
};
(<any>window).RT = function(degree: string) {
  commandHandler.RT(degree);
  (<any>window).INSTANCE.run();
};
(<any>window).LT = function(degree: string) {
  commandHandler.LT(degree);
  (<any>window).INSTANCE.run();
};
(<any>window).PU = function() {
  commandHandler.PU();
  (<any>window).INSTANCE.run();
};
(<any>window).PD = function() {
  commandHandler.PD();
  (<any>window).INSTANCE.run();
};