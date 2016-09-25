import { Pen } from './pen/index';
import { Turtle } from './turtle/index';
import { ExecQueue } from './exec-queue/index';
import { CommandHandler } from './command-handler/index';
import { CodeRunner } from './code-runner/index';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants/index';


const canvas = <HTMLCanvasElement>document.getElementById('c');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
const textarea = <HTMLTextAreaElement>document.getElementById('editCommand');
const button = <HTMLButtonElement>document.getElementById('buttonRun');
const turtle = new Turtle(ctx);
const pen = new Pen(ctx);
const callStack = new ExecQueue();
const commandHandler = new CommandHandler(pen, turtle, callStack);
button.addEventListener('click', function(e) {

  pen.initialize();
  
  const inputs = textarea.value;
  const commands = CommandHandler.parseCommands(inputs);
  console.log(commands);
  commands.filter(function(command) {
    return command !== '' && command != null;
  }).forEach(function (command) {
    let commandName = CommandHandler.getCommandName(command);
    let commandArgs = CommandHandler.getCommandArgs(command);
    try {
      commandHandler.register(commandName, commandArgs);
      console.log(commandName);
      console.log(commandArgs);
    } catch (e) {
      console.warn(e.name);
      console.warn(e.message);
    }
  });

  console.log('--- finish enqueue commands ---');
  const codeRunner = new CodeRunner(callStack);
  codeRunner.run();

}, false);