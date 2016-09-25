import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/index';

const TURTLE_IMG_WIDTH = 30;
const TURTLE_IMG_HEIGHT = 30;
const TURTLE_IMG_PATH = 'assets/image/kame.png';

export class Turtle {
  private ctx : CanvasRenderingContext2D;
  public constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    const img = new Image();
    img.src = TURTLE_IMG_PATH;

    let self = this;
    console.log(self);
    img.onload = function(e) {
      let posX = (CANVAS_WIDTH / 2) - (TURTLE_IMG_WIDTH / 2);
      let posY = (CANVAS_HEIGHT / 2) - (TURTLE_IMG_HEIGHT / 2);
      self.ctx.drawImage(img, posX, posY);
    };
  }
}
