import { Point2d, deg2rad } from '../utils/index';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/index';

export class Pen {

  private ctx: CanvasRenderingContext2D = null;
  private origin: Point2d = {
    x: 0,
    y: 0
  };
  private posX: number = 0;
  private posY: number = 0;
  private degree: number = 90;
  private isDrawable: boolean = true;

  public constructor(ctx : CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.origin.x = CANVAS_WIDTH / 2;
    this.origin.y = CANVAS_HEIGHT / 2;
    this.posX = this.origin.x;
    this.posY = this.origin.y;
  }

  public initialize() {

    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.posX = this.origin.x;
    this.posY = this.origin.y;
    this.degree = 90;
    this.ctx.beginPath();
    this.ctx.moveTo(this.posX, this.posY);

  }

  private transformX(x : number) : number {
    return this.posX + x;
  }

  private transformY(y : number) : number {
    return this.posY - y;
  }

  public setDrawableTo(isDrawable : boolean) : void {
    this.isDrawable = isDrawable;
  }

  public moveForward(length : number) {

    let radian = deg2rad(this.degree);
    let unitX = Math.cos(radian);
    let unitY = Math.sin(radian);

    this.posX = this.transformX(unitX * length);
    this.posY = this.transformY(unitY * length);
    if (this.isDrawable) {
      this.ctx.lineTo(this.posX, this.posY);
      this.ctx.stroke();
    } else {
      this.ctx.moveTo(this.posX, this.posY);
    }

  }

  public moveBackward(length : number) {
    this.moveForward(-length);
  }

  public rotateRight(degree : number) {
    this.degree = this.degree === 0 ? 360 - degree : this.degree - degree;
  }

  public rotateLeft(degree : number) {
    this.degree = this.degree + degree;
  }

}
