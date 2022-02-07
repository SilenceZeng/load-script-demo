import { NumberLike } from "./types";

/**
 * 延时一段时间(返回一个promise)
 * - `ms` < 0 时，则当作`0`处理
 */
export function delay<T extends NumberLike>(
  ms: T,
  reject?: false
): Promise<T extends number ? T : number>;
export function delay<V = unknown>(
  ms: NumberLike,
  reject: false,
  val: V
): Promise<V>;
export function delay(
  ms: NumberLike,
  reject: true,
  val?: unknown
): Promise<never>;
export function delay(
  ms: NumberLike = 1000,
  reject = false,
  val?: unknown
): Promise<unknown> {
  const ms2 = Number(ms);
  return new Promise((re, rj) => {
    const cbFn = () => {
      (reject ? rj : re)(val !== undefined ? val : ms2);
    };
    setTimeout(cbFn, ms2 <= 0 ? 0 : ms2);
  });
}
