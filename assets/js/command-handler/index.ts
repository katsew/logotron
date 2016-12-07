import { Pen } from '../pen/index';
import { Turtle } from '../turtle/index';
import { ExecQueue } from '../exec-queue/index';
import * as LogoCommandParser from 'logo-command-parser';
import * as Debug from 'debug';

interface LogoCommand {
  command: string,
  args: Array<any>
}
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
      const func = function(idx) {
        this.turtle.moveForward.call(this.turtle, idx);
        this.pen.moveForward.call(this.pen, idx);
      }.bind(this, i);
      this.callStack.enqueue(func);
    }
  }
  public BK(length : string) {
    for (let i = 0; i < Number(length); ++i) {
      const func = function(idx) {
        this.turtle.moveBackward.call(this.turtle, idx);
        this.pen.moveBackward.call(this.pen, idx);
      }.bind(this, i);
      this.callStack.enqueue(func);
    }
  }
  public RT(degree : string) {
    const numberDegree = Number(degree);
    const func = function(deg) {
      this.turtle.rotateRight.call(this.turtle, deg);
      this.pen.rotateRight.call(this.pen, deg);
    }.bind(this, numberDegree);
    this.callStack.enqueue(func);
  }
  public LT(degree : string) {
    const numberDegree = Number(degree);
    const func = function(deg) {
      this.turtle.rotateLeft.call(this.turtle, deg);
      this.pen.rotateLeft.call(this.pen, deg);
    }.bind(this, numberDegree);
    this.callStack.enqueue(func);
  }
  public static parseCommands(commands : string) : Array<LogoCommand> {
    if (commands === '' || commands.length < 1) return [];
    const parsed = LogoCommandParser.parse(commands);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  }
}


