import { ExecQueue } from '../exec-queue/index';

export class CodeRunner {
  private callStack : ExecQueue;

  private isExecuting : boolean = false;
  private animationId : number;
  private boundMainFunc : FrameRequestCallback;

  public constructor(queue : ExecQueue) {
    this.callStack = queue;
    this.boundMainFunc = this.main.bind(this);
    console.log('init code runnder: ', queue.getStackSize());
  }

  public run() {
    this.isExecuting = true;
    this.main();
  }

  private main() {

    this.animationId = requestAnimationFrame(this.boundMainFunc);
    if (this.callStack.getStackSize() > 0) {
      let func = this.callStack.dequeue();
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