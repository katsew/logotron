import { Pen } from '../pen/index';
import { Turtle } from '../turtle/index';
import { ExecQueue } from '../exec-queue/index';

const INPUT_COMMAND_REGEXP = /^(PU|PD|FD|BK|RT|LT)\((.*)\).*$/;
export class CommandHandler {

  private pen : Pen;
  private turtle : Turtle; 
  private callStack : ExecQueue;

  public constructor(p : Pen, t: Turtle, q: ExecQueue) {
    this.pen = p;
    this.turtle = t;
    this.callStack = q;
  }
  public register(command : string, args : Array<string>) {
    this[command].apply(this, args);
  }
  public PU() {
    console.log('--- input command: pen up ---');
    this.callStack.enqueue(this.pen.setDrawableTo.bind(this.pen, false));
  }
  public PD() {
    console.log('--- input command: pen down ---');
    this.callStack.enqueue(this.pen.setDrawableTo.bind(this.pen, true));
  }
  public FD(length : string) {
    console.log('--- input command: forward ---');
    for (let i = 0; i < Number(length); ++i) {
      this.callStack.enqueue(this.pen.moveForward.bind(this.pen, i));
    }
  }
  public BK(length : string) {
    console.log('--- input command: backward ---');
    for (let i = 0; i < Number(length); ++i) {
      this.callStack.enqueue(this.pen.moveBackward.bind(this.pen, i));
    }
  }
  public RT(degree : string) {
    console.log('--- input command: rotate right ---');
    this.callStack.enqueue(this.pen.rotateRight.bind(this.pen, parseInt(degree, 10)));
  }
  public LT(degree : string) {
    console.log('--- input command: rotate left ---');
    this.callStack.enqueue(this.pen.rotateLeft.bind(this.pen, parseInt(degree, 10)));
  }
  public static getCommandName(str) {
    return str.replace(INPUT_COMMAND_REGEXP, "$1");
  }
  public static getCommandArgs(str) {
    return str.replace(INPUT_COMMAND_REGEXP, "$2").split(',');
  }
  public static parseCommands(commands : string) : Array<string> {
    if (commands === '' || commands.length < 1) return [];
    const parsed = commands.split(/\r\n|\r|\n/);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  }
}


