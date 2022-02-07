export type NullOr<T> = null | T;
export type UndefinedOr<T> = undefined | T;
export type Nullable<T> = null | undefined | T;

export type PromiseOr<T> = T | Promise<T>;

/** 处理指定 key将它们设置为 Required
 * - 当第三个参数传入 'strict' 时则将剩余的 key 强制设置为 Partial
 */
export type RequiredByKeys<
  T,
  K extends keyof T,
  M extends "strict" | "loose" = "loose"
> = Required<Pick<T, K>> &
  (M extends "strict" ? Partial<Omit<T, K>> : Omit<T, K>);

export type NumberLike<T extends number = number> =
  | T
  | { valueOf(...arg: unknown[]): T };

export type StripNumberLike<T extends NumberLike> = T extends number
  ? T
  : T extends { valueOf(...arg: unknown[]): infer R }
  ? R
  : never;
