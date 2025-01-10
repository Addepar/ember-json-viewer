import { assert } from '@ember/debug';
import { isArray, isObject } from '../utils/value-types';

/**
 * Checks whether the given second argument (a key name or index)
 * is the last key/index in the given object-or-array
 *
 * @param {object|array} objOrArray
 * @param {string|number} keyOrIndex Must be a string if first arg is an object,
 * and number if first arg is an array
 * @returns {Boolean}
 */
export function isLast(objOrArray, keyOrIndex) {
  if (isObject(objOrArray)) {
    let keys = Object.keys(objOrArray);
    return keys.indexOf(keyOrIndex) === keys.length - 1;
  } else if (isArray(objOrArray)) {
    return keyOrIndex === objOrArray.length - 1;
  } else {
    assert(`Unexpected args to is-last ${objOrArray}, ${keyOrIndex}`, false);
  }
}
