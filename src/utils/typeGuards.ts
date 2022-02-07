/**
 * object 的所有合法key类型，
 * - 根据`tsconfig.json`的 `keyofStringsOnly`配置而变化
 */
export type ObjectKeys = keyof any;

/**
 * 判断指定的key是否在object中。保护`object`的类型；
 * - 使用`key` **in** `obj` 来判断。
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function hasKey<O extends object, K extends ObjectKeys>(
  obj: O,
  key: K
): obj is O & Record<K, unknown> {
  return key in obj;
}
