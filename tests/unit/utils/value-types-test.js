import {
  isPrimitive,
  isObject,
  isArray,
} from "ember-json-viewer/utils/value-types";
import { module, test } from "qunit";

module("Unit | Utility | value-types", function () {
  test("isArray", function (assert) {
    assert.ok(isArray([]), "isArray[]");
    assert.ok(isArray([1]), "isArray[1]");
  });

  test("isObject", function (assert) {
    assert.ok(isObject({}));
    assert.ok(isObject({ foo: "bar" }));

    assert.ok(!isObject([]));
    assert.ok(!isObject([1]));
  });

  test("isPrimitive", function (assert) {
    assert.ok(isPrimitive(1));
    assert.ok(isPrimitive("string"));
    assert.ok(isPrimitive(true));
  });
});
