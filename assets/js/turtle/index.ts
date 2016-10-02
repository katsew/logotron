import { Point2d, deg2rad } from '../utils/index';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/index';
import * as Debug from 'debug';
const debug = Debug('Logotron:Turtle');

const TURTLE_IMG_WIDTH = 30;
const TURTLE_IMG_HEIGHT = 30;
const TURTLE_IMG_PATH = 'assets/image/kame.png';

export class Turtle {

  private ctx : CanvasRenderingContext2D;
  private cacheImg : HTMLImageElement;
  private origin : Point2d = {
    x: 0,
    y: 0
  };
  private posX : number = 0;
  private posY : number = 0;
  private degree : number = 90;

  private imgOriginX : number = 0;
  private imgOriginY : number = 0;

  public constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.posX = this.origin.x = (CANVAS_WIDTH / 2) - (TURTLE_IMG_WIDTH / 2);
    this.posY = this.origin.y = (CANVAS_HEIGHT / 2) - (TURTLE_IMG_HEIGHT / 2);
    this.imgOriginX = (TURTLE_IMG_WIDTH / 2);
    this.imgOriginY = (TURTLE_IMG_HEIGHT / 2);
    this.degree = 90;

    const img = new Image();
    img.src = TURTLE_IMG_PATH;
    img.onload = (e) => {
      this.cacheImg = img;
      this.ctx.drawImage(img, this.posX, this.posY);
    };
  }

  public initialize() {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.posX = this.origin.x;
    this.posY = this.origin.y;
    this.degree = 90;
    this.ctx.drawImage(this.cacheImg, this.posX, this.posY);
  }


  private transformX(x : number) : number {
    return this.posX + x;
  }

  private transformY(y : number) : number {
    return this.posY - y;
  }

  public moveForward(length : number) {

    let radian = deg2rad(this.degree);
    let unitX = Math.cos(radian);
    let unitY = Math.sin(radian);
    this.posX = this.transformX(unitX * length);
    this.posY = this.transformY(unitY * length);
    let translateX = this.posX + TURTLE_IMG_WIDTH;
    let translateY = this.posY;
    this.ctx.save();

    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.ctx.translate(translateX, translateY);
    this.ctx.rotate(radian);
    this.ctx.translate(-translateX, -translateY);
    this.ctx.drawImage(this.cacheImg, this.posX, this.posY);

    this.ctx.restore();

  }

  public moveBackward(length : number) {
    this.moveForward(-length);
  }

  public rotateRight(degree : number) {

    debug('------ ROTATE RIGHT ------');
    this.degree = this.degree === 0 ? 360 - degree : this.degree - degree;
    let radian = deg2rad(degree);

    debug('CURRENT POSX: ', this.posX);
    debug('CURRENT POSY: ', this.posY);
    let translateX = this.posX + TURTLE_IMG_WIDTH;
    let translateY = this.posY;
    debug('TRANSLATE X: ', translateX);
    debug('TRANSLATE Y: ', translateY);
    this.ctx.save();

    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.ctx.translate(translateX, translateY);
    this.ctx.rotate(radian);
    this.ctx.translate(-translateX, -translateY);
    this.ctx.drawImage(this.cacheImg, translateX, translateY);

    this.ctx.restore();

  }

  public rotateLeft(degree : number) {
    this.degree = this.degree + degree;
    let radian = deg2rad(this.degree);
    this.ctx.save();
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.ctx.rotate(-radian);
    this.ctx.drawImage(this.cacheImg, this.posX, this.posY);
    this.ctx.restore();
  }

}
