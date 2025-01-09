import {
  isPrimitive,
  isObject,
  isArray,
} from 'ember-json-viewer/utils/value-types';
import { module, test } from 'qunit';

module('Unit | Utility | value-types', function () {
  test('isArray', function (assert) {
    assert.true(isArray([]), 'isArray[]');
    assert.true(isArray([1]), 'isArray[1]');
  });

  test('isObject', function (assert) {
    assert.true(isObject({}));
    assert.true(isObject({ foo: 'bar' }));

    assert.false(isObject([]));
    assert.false(isObject([1]));
  });

  test('isPrimitive', function (assert) {
    assert.true(isPrimitive(1));
    assert.true(isPrimitive('string'));
    assert.true(isPrimitive(true));
  });
});
