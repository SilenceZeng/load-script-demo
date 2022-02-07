/**
 * object 的所有合法key类型
 * 根据 tsconfig.json 的 keyofStringsOnly 配置而变化
 */
export type ObjectKeys = keyof any;

/**
 * 判断指定的 key 是否在 object 中
 */
export function hasKey<O extends object, K extends ObjectKeys>(
  obj: O,
  key: K
): obj is O & Record<K, unknown> {
  return key in obj;
}
