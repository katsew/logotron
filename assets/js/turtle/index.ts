import { Point2d, deg2rad, deg2rot, roundDegree } from '../utils/index';
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

    debug('------ MOVE FORWARD ------');
    let radian = deg2rad(this.degree);
    let unitX = Math.cos(radian);
    let unitY = Math.sin(radian);
    this.posX = this.transformX(unitX * length);
    this.posY = this.transformY(unitY * length);
    let translateX = this.posX + this.imgOriginX;
    let translateY = this.posY + this.imgOriginY;
    this.ctx.save();

    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.ctx.translate(translateX, translateY);
    debug('RADIAN: ', this.degree);
    debug('ANGLE: ', deg2rot(this.degree));
    let isReverse = this.degree > 0;
    this.ctx.rotate(deg2rot(this.degree, isReverse));
    this.ctx.translate(-translateX, -translateY);
    this.ctx.drawImage(this.cacheImg, this.posX, this.posY);

    this.ctx.restore();

  }

  public moveBackward(length : number) {
    this.moveForward(-length);
  }

  public rotateRight(degree : number) {

    debug('------ ROTATE RIGHT ------');
    let rounded = roundDegree(degree);
    this.degree = this.degree - rounded;  
    let translateX = this.posX + this.imgOriginX;
    let translateY = this.posY + this.imgOriginY;
    this.ctx.save();

    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.ctx.translate(translateX, translateY);
    this.ctx.rotate(deg2rot(this.degree));
    this.ctx.translate(-translateX, -translateY);
    this.ctx.drawImage(this.cacheImg, this.posX, this.posY);

    this.ctx.restore();

  }

  public rotateLeft(degree : number) {

    debug('------ ROTATE LEFT ------');
    let rounded = roundDegree(degree);
    this.degree = this.degree + rounded;
    let translateX = this.posX + this.imgOriginX;
    let translateY = this.posY + this.imgOriginY;
    this.ctx.save();

    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.ctx.translate(translateX, translateY);
    this.ctx.rotate(deg2rot(this.degree, true));
    this.ctx.translate(-translateX, -translateY);
    this.ctx.drawImage(this.cacheImg, this.posX, this.posY);

    this.ctx.restore();
  }

}
