import * as Debug from 'debug';
const debug = Debug('Logotron:Utils');

export class Point2d {

  public x;
  public y;
  public constructor(x : number, y : number) {
    this.x = x;
    this.y = y;
  }

}

/**
 * 度数を弧度法に従ってラジアンに変換する
 * 
 * 半径を1としたときの直径は2でその円周の長さは1 * 2 * Math.PI
 * したがって、弧度法で測った場合の角度degreeはradianに変換すると
 * radian = degree / 360 * 1 * 2 * Math.PI 
 */
export function deg2rad(degree : number) : number {

  return degree / 180 * Math.PI;

}


export function deg2rot(degree : number) : number {
  const radian = deg2rad(( 360 - reduceDegree(degree) + 180 ));
  debug('DEGREE: ', degree);
  debug('RADIAN: ', radian);
  const rotate = radian >= Math.PI ? radian - Math.PI : radian;
  debug('ROTATE: ', rotate);
  return rotate;
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