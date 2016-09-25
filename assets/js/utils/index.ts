export class Point2d {

  public x;
  public y;
  public constructor(x : number, y : number) {
    this.x = x;
    this.y = y;
  }

}

export function deg2rad(degree : number) : number {

  // 半径を1としたときの直径は2でその円周の長さは2 * 1 * Math.PI
  // したがって、弧度法で測った場合の角度degreeは degree / 360 * 2 * 1 * Math.PI
  let radian = degree / 180 * Math.PI;
  console.log(radian);
  return radian;

}