;(function() {

  'use strict';

  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 800;
  const canvas = <HTMLCanvasElement>document.getElementById('c');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

  class Point2d {

    public x;
    public y;
    public constructor(x : number, y : number) {
      this.x = x;
      this.y = y;
    }

  }

  const TURTLE_IMG_WIDTH = 30;
  const TURTLE_IMG_HEIGHT = 30;
  const TURTLE_IMG_PATH = 'assets/image/kame.png';
  class Turtle {

    private ctx : CanvasRenderingContext2D;
    public constructor(ctx: CanvasRenderingContext2D) {
      this.ctx = ctx;
      const img = new Image();
      img.src = TURTLE_IMG_PATH;

      let self = this;
      console.log(self);
      img.onload = function(e) {
        let posX = (CANVAS_WIDTH / 2) - (TURTLE_IMG_WIDTH / 2);
        let posY = (CANVAS_HEIGHT / 2) - (TURTLE_IMG_HEIGHT / 2);
        self.ctx.drawImage(img, posX, posY);
      };
    }

  }

  class CanvasHandler {

    private ctx: CanvasRenderingContext2D = null;
    private origin: Point2d = {
      x: 0,
      y: 0
    };
    private posX: number = 0;
    private posY: number = 0;
    private degree: number = 90;
    private queue: Array<Function> = [];
    private isDrawable: boolean = true;

    public constructor(ctx : CanvasRenderingContext2D) {
      this.ctx = ctx;
      this.origin.x = CANVAS_WIDTH / 2;
      this.origin.y = CANVAS_HEIGHT / 2;
      this.posX = this.origin.x;
      this.posY = this.origin.y;
    }

    public run() {

      this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      this.posX = this.origin.x;
      this.posY = this.origin.y;
      this.ctx.beginPath();
      this.ctx.moveTo(this.posX, this.posY);

      const stackSize = this.queue.length;
      console.log('command stack size: ', stackSize);
      for (let i = 0; i < stackSize; ++i) {
        this.dequeue()();
      }

      console.log('--- finish exec command, stroke it ---');
      this.cleanUp();
    }

    private cleanUp() {
      this.posX = this.origin.x;
      this.posY = this.origin.y;
      this.degree = 90;
    }

    private transformX(x : number) : number {
      return this.posX + x;
    }

    private transformY(y : number) : number {
      return this.posY - y;
    }

    public enqueue(func) {
      this.queue.push(func);
    }

    public dequeue() : Function {
      return this.queue.shift();
    }

    public setDrawableTo(isDrawable : boolean) : void {
      this.isDrawable = isDrawable;
      console.log('set isDrawable to : ', this.isDrawable);
    }

    public moveForward(length : number) {

      let radian = deg2rad(this.degree);
      let unitX = Math.cos(radian);
      let unitY = Math.sin(radian);

      let nextPosX = this.transformX(unitX * length);
      let nextPosY = this.transformY(unitY * length);
      console.log('current position: ', this.posX, this.posY);
      console.log('next position: ', nextPosX, nextPosY);
      console.log('distance: ', nextPosX - this.posX, nextPosY - this.posY);
      for (let i = 1; i <= length; ++i) {

        setTimeout(() => {
          let x;
          let y;
          if (this.posX === nextPosX) {
            x = nextPosX;
          } else if (nextPosX - this.posX < 0) {
            x = this.posX - i;
          } else {
            x = this.posX + i;
          }
          if (this.posY === nextPosY) {
            y = nextPosY;
          } else if (nextPosY - this.posY < 0) {
            y = this.posY - i;
          } else {
            y = this.posY + i;
          }

          if (this.isDrawable) {
            this.ctx.lineTo(x, y);
          } else {
            this.ctx.moveTo(x, y);
          }

          console.log('move to :', x, y);
          this.ctx.stroke();
        }, 100);

      }
      this.posX = this.transformX(unitX * length);
      this.posY = this.transformY(unitY * length);

    }

    public moveBackward(length : number) {
      this.moveForward(-length);
    }

    public rotateRight(degree : number) {
      this.degree = this.degree === 0 ? 360 - degree : this.degree - degree;
      console.log('rotate right: ', this.degree);
    }

    public rotateLeft(degree : number) {
      this.degree = this.degree + degree;
      console.log('rotate left: ', this.degree);
    }

  }

  const INPUT_COMMAND_REGEXP = /^(PU|PD|FD|BK|RT|LT)\((.*)\).*$/;
  class InputHandler {

    private handler: CanvasHandler;

    public constructor(c : CanvasHandler) {
      this.handler = c;
    }
    public PU() {
      console.log('--- input command: pen up ---');
      this.handler.enqueue(this.handler.setDrawableTo.bind(this.handler, false));
    }
    public PD() {
      console.log('--- input command: pen down ---');
      this.handler.enqueue(this.handler.setDrawableTo.bind(this.handler, true));
    }
    public FD(length : string) {
      console.log('--- input command: forward ---');
      this.handler.enqueue(this.handler.moveForward.bind(this.handler, parseInt(length, 10)));
    }
    public BK(length : string) {
      console.log('--- input command: backward ---');
      this.handler.enqueue(this.handler.moveBackward.bind(this.handler, parseInt(length, 10)));
    }
    public RT(degree : string) {
      console.log('--- input command: rotate right ---');
      this.handler.enqueue(this.handler.rotateRight.bind(this.handler, parseInt(degree, 10)));
    }
    public LT(degree : string) {
      console.log('--- input command: rotate left ---');
      this.handler.enqueue(this.handler.rotateLeft.bind(this.handler, parseInt(degree, 10)));
    }
    public static getCommandName(str) {
      return str.replace(INPUT_COMMAND_REGEXP, "$1");
    }
    public static getCommandArgs(str) {
      return str.replace(INPUT_COMMAND_REGEXP, "$2").split(',');
    }
  }

  const textarea = <HTMLTextAreaElement>document.getElementById('editCommand');
  const button = <HTMLButtonElement>document.getElementById('buttonRun');
  const turtle = new Turtle(ctx);
  const canvasHandler = new CanvasHandler(ctx);
  button.addEventListener('click', function(e) {

    const inputHandler = new InputHandler(canvasHandler);
    const inputs = textarea.value;
    const commands = parseCommands(inputs);
    console.log(commands);
    commands.filter(function(command) {
      return command !== '' && command != null;
    }).forEach(function (command) {
      let commandName = InputHandler.getCommandName(command);
      let commandArgs = InputHandler.getCommandArgs(command);
      try {
        inputHandler[commandName].apply(inputHandler, commandArgs);
        console.log(commandName);
        console.log(commandArgs);
      } catch (e) {
        console.warn(e.name);
        console.warn(e.message);
      }
    });

    console.log('--- finish enqueue commands ---');
    canvasHandler.run();

  }, false);

  function parseCommands(commands : string) : Array<string> {

    if (commands === '' || commands.length < 1) return [];
    const parsed = commands.split(/\r\n|\r|\n/);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];

  }

  function deg2rad(degree : number) : number {

    // 半径を1としたときの直径は2でその円周の長さは2 * 1 * Math.PI
    // したがって、弧度法で測った場合の角度degreeは degree / 360 * 2 * 1 * Math.PI
    let radian = degree / 180 * Math.PI;
    console.log(radian);
    return radian;

  }

  function main() {

    requestAnimationFrame(main);

  }
  main();

})();