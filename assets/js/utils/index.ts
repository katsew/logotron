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


export function deg2rot(degree : number, isReverse : boolean = false) : number {
  const fixedAngle = 90;
  let actual = ( (360 - fixedAngle) - degree ) / 180 * Math.PI;
  debug('DEGREE: ', degree);
  debug('ACTUAL: ', actual);
  let rotate = actual >= Math.PI ? actual - Math.PI : actual;
  return isReverse ? -rotate : rotate;
}

/**
 * 入力された度数(degree)を適正な範囲に丸める
 * 0 ~ 359まで。360度は0度とみなす。
 */
export function roundDegree(degree : number) : number {
  if (degree < 360) { return degree; }

  let rounded = degree - 360;
  return roundDegree(rounded);
}