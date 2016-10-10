import { ExecQueue } from '../exec-queue/index';
import * as Debug from 'debug';

const debug = Debug('Logotron:CodeRunner');
export class CodeRunner {
  private callStack : ExecQueue;

  private stopped : boolean = true;
  private animationId : number;
  private boundMainFunc : FrameRequestCallback;

  private fps : number;
  private lastTimeMilli : number;

  public constructor(queue : ExecQueue, fps : number = 30.0) {
    this.fps = fps;
    this.callStack = queue;
    this.boundMainFunc = this.main.bind(this);
    this.lastTimeMilli = 0;
    debug('=== Initialized');
    debug(`fps: ${this.fps}`);
    debug(`callStack: ${this.callStack.getStackSize()}`);
    debug(`lastTimeMilli: ${this.lastTimeMilli}`);
  }

  public run() {
    this.stopped = false;
    this.animationId = requestAnimationFrame(this.boundMainFunc);
  }

  private main(now) {
    if (
      this.callStack.getStackSize() > 0 &&
      ( (now - this.lastTimeMilli) >= (1000.0 / this.fps) )
    ) {

      debug('=== Enter frame');
      debug(`delta: ${(now - this.lastTimeMilli)}`);
      this.lastTimeMilli = now;
      const func = this.callStack.dequeue();
      func();
      this.animationId = requestAnimationFrame(this.boundMainFunc);

    } else if (!(this.callStack.getStackSize() > 0)) {

      debug('=== End process', this.callStack.getStackSize());
      cancelAnimationFrame(this.animationId);
      this.stopped = true;

    } else {
      debug('=== Not inside a frame');
      debug(`delta: ${now, this.lastTimeMilli}`);
      this.animationId = requestAnimationFrame(this.boundMainFunc);
    }

  }

  public isRunning() {
    return !this.stopped;
  }

}