export function isArray(v) {
  return Array.isArray(v);
}

export function isPrimitive(v) {
  return v === null || ['number', 'boolean', 'string'].includes(typeof v);
}

export function isObject(v) {
  return !isArray(v) && typeof v === 'object';
}
