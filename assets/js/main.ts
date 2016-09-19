;(function() {

  'use strict';

  const canvas = <HTMLCanvasElement>document.getElementById('c');
  const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

  class Turtle {

    private ctx: CanvasRenderingContext2D = null;
    private posX: number = 0;
    private posY: number = 0;
    private queue: Array<Function> = [];

    public constructor(posX : number, posY : number, ctx: CanvasRenderingContext2D) {
      this.posX = posX;
      this.posY = posY;
      this.ctx = ctx;
    }

    public run() {
      this.ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    private transformAxis(x, y) {
      return [x, y];
    }

  }

  const Commands = {
    isDrawable: true,
    PU: function PenUp() {
      this.isDrawable = false;
      console.log('--- pen up ---');
      console.log('isDrawable: ', this.isDrawable);
    },
    PD: function PenDown() {
      this.isDrawable = true;
      console.log('--- pen down ---');
      console.log('isDrawable: ', this.isDrawable);
    },
    FD: function Forward(length : number) {
      console.log('--- forward ---');
    },
    BK: function Backward(length : number) {
      console.log('--- backward ---');
    },
    RT: function RightTurn(degree : number) {
      console.log('--- rotate right ---');
      let radian = deg2rad(degree);
      console.log(radian);
    },
    LT: function LeftTurn(degree : number) {
      console.log('--- rotate left ---');
      let radian = deg2rad(degree);
      console.log(radian);
    },
    getCommandName: function getCommandName(str) {
      return str.replace(/^(PU|PD|FD|BK|RT|LT)\((.*)\).*$/, "$1");
    },
    getCommandArgs: function getCommandArgs(str) {
      return str.replace(/^(PU|PD|FD|BK|RT|LT)\((.*)\).*$/, "$2").split(',');
    }
  };

  function deg2rad(degree : number) : number {

    // 半径を1としたときの直径は2でその円周の長さは2 * Math.PI
    // したがって、弧度法で測った場合の角度degreeは degree / 360 * 2 * 1 * Math.PI
    let radian = degree / 180 * Math.PI;
    console.log(radian);
    return radian;

  }

  const textarea = <HTMLTextAreaElement>document.getElementById('editCommand');
  const button = <HTMLButtonElement>document.getElementById('buttonRun');
  button.addEventListener('click', function(e) {
    const inputs = textarea.value;
    const commands = parseCommands(inputs);
    console.log(commands);
    let width = canvas.width;
    let height = canvas.height;
    ctx.moveTo(width / 2, height / 2);
    commands.filter(function(command) {
      return command !== '' && command != null;
    }).forEach(function (command) {
      let commandName = Commands.getCommandName(command);
      console.log(commandName);
      let commandArgs = Commands.getCommandArgs(command);
      console.log(commandArgs);
      try {
        Commands[commandName].apply(Commands, commandArgs);
      } catch (e) {
        console.warn(e.message);
      }
    });

    console.log('--- finish calling commands ---');
    ctx.stroke();

  }, false);

  function parseCommands(commands : string) : Array<string> {
    if (commands === '' || commands.length < 1) return [];
    const parsed = commands.split(/\r\n|\r|\n/);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  }

  let cancelId : number;
  function main () {
    cancelId = window.requestAnimationFrame(main);

  }
  main();
  console.log(cancelId);
})();