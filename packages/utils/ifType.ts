// 变量类型判断

export function isTypeOf(val: any, type: string) {
  const oToString = Object.prototype.toString.call(val) as any;
  const curentType = oToString.match(/\s+(\w+)/)[1];

  return curentType.toLowerCase() === type.toLowerCase();
}

export function isNull(s: any) {
  return isTypeOf(s, 'null');
}

export function isUndefined(s: any) {
  return isTypeOf(s, 'undefined');
}

export function isString(s: any) {
  return isTypeOf(s, 'string');
}

export function isBoolean(s: any) {
  return isTypeOf(s, 'boolean');
}

export function isNumber(s: any) {
  return isTypeOf(s, 'number');
}

export function isArray(s: any) {
  return isTypeOf(s, 'array');
}

export function isObject(s: any) {
  return isTypeOf(s, 'object');
}

export function isFunction(s: any) {
  return isTypeOf(s, 'function');
}

/** 是否为 Async 注册函数 */
export function isAsyncFunction(s: any) {
  return isTypeOf(s, 'AsyncFunction');
}

/** 是否为空字符串 */
export function emptyString(s: any) {
  return isTypeOf(s, 'string') && s.length === 0;
}

export function notEmptyObject(s: any) {
  return isTypeOf(s, 'object') && Object.keys(s).length !== 0;
}
