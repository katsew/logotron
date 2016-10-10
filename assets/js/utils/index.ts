export class Point2d {

  public x;
  public y;
  public constructor(x : number, y : number) {
    this.x = x;
    this.y = y;
  }

}

/**
 * 度数をラジアンに変換する
 * 
 * 半径を1としたときの直径は2でその円周の長さは1 * 2 * Math.PI
 * したがって、弧度法で測った場合の角度degreeはradianに変換すると
 * radian = degree / 360 * 1 * 2 * Math.PI 
 */
export function deg2rad(degree : number) : number {

  return degree / 180 * Math.PI;

}


/**
 * canvasのrotateは時計回りなので、度数degreeから逆方向のradianを出す。
 */
export function deg2rot(degree : number) : number {
  return deg2rad( 360 - reduceDegree(degree) );
}

/**
 * 入力された度数(degree)を適正な範囲に縮小する。
 * 0 ~ 359まで。360度は0度とみなす。
 */
export function reduceDegree(degree : number) : number {
  if (degree < 360) { return degree; }

  const rounded = degree - 360;
  return reduceDegree(rounded);
}