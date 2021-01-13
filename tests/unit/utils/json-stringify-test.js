import jsonStringify from "dummy/utils/json-stringify";
import { module, test } from "qunit";

module("Unit | Utility | json-stringify", function () {
  test("it works", function (assert) {
    debugger;
    let result = jsonStringify({ foo: true });
    assert.ok(result);
  });
});
