import { module, test } from 'qunit';
import { jsonStringify, MARKER } from 'ember-json-viewer';

const JSONS = {
  simple: { foo: true },
  no_nesting_prims: { foo: true, bar: false, one: 1.01, str: 'string' },
  no_nesting_array: {
    foo: [1, 2, 3],
    bar: [4, 5, 6],
  },
  // TODO: jsonStringfy adds a newline for the empty object,
  // doesn't match native JSON stringify
  // no_nesting_obj: {
  //   foo: {},
  //   bar: {},
  // },
  nested: {
    foo: { bar: { baz: 'qux' } },
  },
  // Allows testing the comma paths $.foo.one@, and $.foo>,
  nested_two: {
    foo: { one: 1, two: 2 },
    bar: { three: 3 },
  },
  complex: {
    foo: {
      bar: [1, 2, { baz: 'quz' }, 'three', { inner: 'string' }],
      true: true,
      false: {
        1: [2, 3],
      },
    },
  },
  has_null: {
    x: null,
    y: [null, null],
  },
};

function nativeJsonStringify(json) {
  return JSON.stringify(json, null, '  ');
}

// Takes an expected string and replaces the depth-indicators ("->") with
// 2-spaces each, and cuts the string between the position indicators « and »
// (The "expected" string is sort of a DSL for legibility in the tests)
function format(expected) {
  expected = expected.replaceAll(/^\s+/gm, '').replaceAll('->', '  ');
  return expected.slice(expected.indexOf('«') + 1, expected.indexOf('»'));
}

module('Unit | Utility | json-stringify', function () {
  test('it returns full JSON by default, mostly-matches native JSON.stringify', function (assert) {
    for (let [name, json] of Object.entries(JSONS)) {
      assert.strictEqual(
        jsonStringify(json),
        nativeJsonStringify(json),
        `correct for ${name}`,
      );
    }
  });

  test('JSONS.simple: it cuts JSON string at range start/end', function (assert) {
    let expected = `{
    ->«"foo": true»
    }`;
    let range = {
      start: { path: '$.foo', index: 0 },
      end: { path: '$.foo@', index: 4 },
    };

    assert.strictEqual(
      jsonStringify(JSONS.simple, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"«foo": true»
    }`;
    range.start.index = 1;
    assert.strictEqual(
      jsonStringify(JSONS.simple, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo«": true»
    }`;
    range.start.index = 4;
    assert.strictEqual(
      jsonStringify(JSONS.simple, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo"«: true»
    }`;
    range.start.index = 5;
    assert.strictEqual(
      jsonStringify(JSONS.simple, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo":« true»
    }`;
    range.start.index = 6;
    assert.strictEqual(
      jsonStringify(JSONS.simple, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «true»
    }`;
    range.start = { path: '$.foo@', index: 0 };
    assert.strictEqual(
      jsonStringify(JSONS.simple, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": t«rue»
    }`;
    range.start = { path: '$.foo@', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.simple, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"f«o»o": true
    }`;
    range = {
      start: { path: '$.foo', index: 2 },
      end: { path: '$.foo', index: 3 },
    };
    assert.strictEqual(
      jsonStringify(JSONS.simple, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo"«:» true
    }`;
    range = {
      start: { path: '$.foo', index: 5 },
      end: { path: '$.foo', index: 6 },
    };
    assert.strictEqual(
      jsonStringify(JSONS.simple, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );
  });

  test('JSONS.no_nesting_prims cuts JSON at start/end', function (assert) {
    let expected = `{
    ->«"foo": true»,
    ->"bar": false,
    ->"one": 1.01,
    ->"str": "string"
    }`;

    let range = {
      start: { path: '$.foo', index: 0 },
      end: { path: '$.foo@,', index: 0 },
    };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_prims, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"foo": true,»
    ->"bar": false,
    ->"one": 1.01,
    ->"str": "string"
    }`;
    range.end.index = 1;
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_prims, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"foo": true,
    ->"»bar": false,
    ->"one": 1.01,
    ->"str": "string"
    }`;
    range.end = { path: '$.bar', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_prims, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"foo": true,
    ->"bar»": false,
    ->"one": 1.01,
    ->"str": "string"
    }`;
    range.end = { path: '$.bar', index: 4 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_prims, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"foo": true,
    ->"bar"»: false,
    ->"one": 1.01,
    ->"str": "string"
    }`;
    range.end = { path: '$.bar', index: 5 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_prims, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"foo": true,
    ->"bar": »false,
    ->"one": 1.01,
    ->"str": "string"
    }`;
    range.end = { path: '$.bar@', index: 0 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_prims, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"foo": true,
    ->"bar": false»,
    ->"one": 1.01,
    ->"str": "string"
    }`;
    range.end = { path: '$.bar@,', index: 0 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_prims, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"foo": true,
    ->"bar": false,»
    ->"one": 1.01,
    ->"str": "string"
    }`;
    range.end = { path: '$.bar@,', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_prims, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"foo": true,
    ->"bar": false,
    ->"one": 1».01,
    ->"str": "string"
    }`;
    range.end = { path: '$.one@', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_prims, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"foo": true,
    ->"bar": false,
    ->"one": 1.01,
    ->"str": "»string"
    }`;
    range.end = { path: '$.str@', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_prims, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"foo": true,
    ->"bar": false,
    ->"one": 1.01,
    ->"str": "string»"
    }`;
    range.end = { path: '$.str@', index: 7 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_prims, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"foo": true,
    ->"bar": false,
    ->"one": 1.01,
    ->"str": "string"»
    }`;
    range.end = { path: '$.str@', index: 8 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_prims, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"foo": true,
    ->"bar": false,
    ->"one": 1.01,
    ->"str": "string"
    »}`;
    range.end = { path: '$>', index: 0 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_prims, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"foo": true,
    ->"bar": false,
    ->"one": 1.01,
    ->"str": "string"
    }»`;
    range.end = { path: '$>', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_prims, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );
  });

  test('JSONS.no_nesting_array cuts JSON at start/end', function (assert) {
    let expected = `{
    ->"foo": «[
    ->->»1, 2, 3
    ->],
    ->"bar": [
    ->->4, 5, 6
    ->]
    }`;

    let range = {
      start: { path: '$.foo<', index: 0 },
      end: { path: '$.foo[0]@', index: 0 },
    };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_array, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «[
    ->->1», 2, 3
    ->],
    ->"bar": [
    ->->4, 5, 6
    ->]
    }`;
    range.end = { path: '$.foo[0]@', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_array, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «[
    ->->1,» 2, 3
    ->],
    ->"bar": [
    ->->4, 5, 6
    ->]
    }`;
    range.end = { path: '$.foo[0]@,', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_array, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «[
    ->->1,
    ->->»2,
    ->->3
    ->],
    ->"bar": [
    ->->4,
    ->->5,
    ->->6
    ->]
    }`;
    range.end = { path: '$.foo[1]@', index: 0 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_array, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «[
    ->->1,
    ->->2»,
    ->->3
    ->],
    ->"bar": [
    ->->4,
    ->->5,
    ->->6
    ->]
    }`;
    range.end = { path: '$.foo[1]@', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_array, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «[
    ->->1,
    ->->2,»
    ->->3
    ->],
    ->"bar": [
    ->->4,
    ->->5,
    ->->6
    ->]
    }`;
    range.end = { path: '$.foo[1]@,', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_array, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «[
    ->->1,
    ->->2,
    ->->3»
    ->],
    ->"bar": [
    ->->4,
    ->->5,
    ->->6
    ->]
    }`;
    range.end = { path: '$.foo[2]@', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_array, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «[
    ->->1,
    ->->2,
    ->->3
    ->»],
    ->"bar": [
    ->->4,
    ->->5,
    ->->6
    ->]
    }`;
    range.end = { path: '$.foo>', index: 0 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_array, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «[
    ->->1,
    ->->2,
    ->->3
    ->]»,
    ->"bar": [
    ->->4,
    ->->5,
    ->->6
    ->]
    }`;
    range.end = { path: '$.foo>', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_array, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «[
    ->->1,
    ->->2,
    ->->3
    ->],»
    ->"bar": [
    ->->4,
    ->->5,
    ->->6
    ->]
    }`;
    range.end = { path: '$.foo@,', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.no_nesting_array, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );
  });

  test('JSONS.nested cuts JSON at start/end', function (assert) {
    let expected = `«{
    ->"foo": {
    ->->"bar": {
    ->->->"baz": "qux"
    ->->}
    ->}
    }»`;

    let range = {
      start: { path: '$<', index: 0 },
      end: { path: '$>', index: 1 },
    };
    assert.strictEqual(
      jsonStringify(JSONS.nested, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «{»
    ->->"bar": {
    ->->->"baz": "qux"
    ->->}
    ->}
    }`;

    range = {
      start: { path: '$.foo<', index: 0 },
      end: { path: '$.foo<', index: 1 },
    };
    assert.strictEqual(
      jsonStringify(JSONS.nested, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «{
    ->->"bar": »{
    ->->->"baz": "qux"
    ->->}
    ->}
    }`;

    range.end = { path: '$.foo.bar<', index: 0 };
    assert.strictEqual(
      jsonStringify(JSONS.nested, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «{
    ->->"bar": {»
    ->->->"baz": "qux"
    ->->}
    ->}
    }`;

    range.end = { path: '$.foo.bar<', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.nested, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «{
    ->->"bar": {
    ->->->»"baz": "qux"
    ->->}
    ->}
    }`;

    range.end = { path: '$.foo.bar.baz', index: 0 };
    assert.strictEqual(
      jsonStringify(JSONS.nested, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «{
    ->->"bar": {
    ->->->"baz": "qux"
    ->->»}
    ->}
    }`;

    range.end = { path: '$.foo.bar>', index: 0 };
    assert.strictEqual(
      jsonStringify(JSONS.nested, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": «{
    ->->"bar": {
    ->->->"baz": "qux"
    ->->}»
    ->}
    }`;

    range.end = { path: '$.foo.bar>', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.nested, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );
  });

  test('JSONS.nested_two cuts JSON at start/end', function (assert) {
    let expected = `«{
    ->"foo": {
    ->->"one": 1,
    ->->"two": 2
    ->},
    ->"bar": {
    ->->"three": 3
    ->}
    }»`;

    let range = {
      start: { path: '$<', index: 0 },
      end: { path: '$>', index: 1 },
    };
    assert.strictEqual(
      jsonStringify(JSONS.nested_two, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": {
    ->->"on«e": 1»,
    ->->"two": 2
    ->},
    ->"bar": {
    ->->"three": 3
    ->}
    }`;

    range = {
      start: { path: '$.foo.one', index: 3 },
      end: { path: '$.foo.one@,', index: 0 },
    };
    assert.strictEqual(
      jsonStringify(JSONS.nested_two, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": {
    ->->"on«e": 1,»
    ->->"two": 2
    ->},
    ->"bar": {
    ->->"three": 3
    ->}
    }`;

    range = {
      start: { path: '$.foo.one', index: 3 },
      end: { path: '$.foo.one@,', index: 1 },
    };
    assert.strictEqual(
      jsonStringify(JSONS.nested_two, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": {
    ->->"on«e": 1,
    ->->"two": 2
    ->}»,
    ->"bar": {
    ->->"three": 3
    ->}
    }`;

    range.end = { path: '$.foo>', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.nested_two, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->"foo": {
    ->->"on«e": 1,
    ->->"two": 2
    ->},»
    ->"bar": {
    ->->"three": 3
    ->}
    }`;

    range.end = { path: '$.foo@,', index: 1 };
    assert.strictEqual(
      jsonStringify(JSONS.nested_two, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );
  });

  test('use of special MARKER constant still works', function (assert) {
    assert.true(!!MARKER, 'marker is defined');
    let json = { foo: `abc${MARKER}`, bar: 2 };
    let expected = `{
    ->"foo": "abc${MARKER}",
    ->«"bar": 2»
    }`;
    let range = {
      start: { path: '$.bar', index: 0 },
      end: { path: '$.bar@', index: 1 },
    };
    assert.strictEqual(
      jsonStringify(json, range),
      format(expected),
      `when JSON includes MARKER constant`,
    );
  });

  test('serializes `null` correctly', function (assert) {
    let expected = `{
    ->«"x": n»ull,
    ->"y": [
    ->->null,
    ->->null,
    ->]
    }`;
    let range = {
      start: { path: '$.x', index: 0 },
      end: { path: '$.x@', index: 1 },
    };

    assert.strictEqual(
      jsonStringify(JSONS.has_null, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"x": nu»ll,
    ->"y": [
    ->->null,
    ->->null,
    ->]
    }`;
    range = {
      start: { path: '$.x', index: 0 },
      end: { path: '$.x@', index: 2 },
    };

    assert.strictEqual(
      jsonStringify(JSONS.has_null, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"x": null»,
    ->"y": [
    ->->null,
    ->->null,
    ->]
    }`;
    range = {
      start: { path: '$.x', index: 0 },
      end: { path: '$.x@', index: 4 },
    };

    assert.strictEqual(
      jsonStringify(JSONS.has_null, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );

    expected = `{
    ->«"x": null,»
    ->"y": [
    ->->null,
    ->->null,
    ->]
    }`;
    range = {
      start: { path: '$.x', index: 0 },
      end: { path: '$.x@,', index: 1 },
    };

    assert.strictEqual(
      jsonStringify(JSONS.has_null, range),
      format(expected),
      `with range ${JSON.stringify(range)}`,
    );
  });
});
