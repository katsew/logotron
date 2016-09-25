import { ExecQueue } from '../exec-queue/index';

export class CodeRunner {
  private callStack : ExecQueue;

  private isExecuting : boolean = false;
  private animationId : number;

  public constructor(queue : ExecQueue) {
    this.callStack = queue;
    console.log('init code runnder: ', queue.getStackSize());
  }

  public run() {
    this.isExecuting = true;
    this.animationId = requestAnimationFrame(this.main.bind(this));
    this.main();
  }

  private main() {
    console.log('--- looop ----');

    if (this.callStack.getStackSize() > 0) {
      let func = this.callStack.dequeue();
      console.log(this.callStack.getStackSize());
      func();
    } else {
      cancelAnimationFrame(this.animationId);
      this.isExecuting = false;
    }

  }

  public isRunning() {
    return this.isExecuting;
  }
}