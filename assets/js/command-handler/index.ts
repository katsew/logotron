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
    this.callStack.enqueue(this.pen.setDrawableTo.bind(this.pen, false));
  }
  public PD() {
    this.callStack.enqueue(this.pen.setDrawableTo.bind(this.pen, true));
  }
  public FD(length : string) {
    for (let i = 0; i < Number(length); ++i) {
      let callFunc = function() {
        this.turtle.moveForward.call(this.turtle, i);
        this.pen.moveForward.call(this.pen, i);
      }.bind(this);
      this.callStack.enqueue(callFunc);
    }
  }
  public BK(length : string) {
    for (let i = 0; i < Number(length); ++i) {
      this.callStack.enqueue(this.turtle.moveBackward.bind(this.turtle, i));
      this.callStack.enqueue(this.pen.moveBackward.bind(this.pen, i));
    }
  }
  public RT(degree : string) {
    const numberDegree = Number(degree);
    this.callStack.enqueue(this.pen.rotateRight.bind(this.pen, numberDegree));
    this.callStack.enqueue(this.turtle.rotateRight.bind(this.turtle, numberDegree));
  }
  public LT(degree : string) {
    const numberDegree = Number(degree);
    this.callStack.enqueue(this.pen.rotateLeft.bind(this.pen, numberDegree));
    this.callStack.enqueue(this.turtle.rotateLeft.bind(this.turtle, numberDegree));
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


