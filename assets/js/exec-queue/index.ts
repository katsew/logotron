import * as Debug from 'debug';

export class ExecQueue {
  private queue: Array<Function> = [];
  public constructor () {
  }

  public enqueue(func : Function) : ExecQueue {
    this.queue.push(func);
    return this;
  }

  public dequeue() : Function {
    return this.queue.shift();
  }

  public getStackSize() {
    return this.queue.length;
  }
}