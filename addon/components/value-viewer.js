import Component from "@ember/component";
import { computed } from "@ember/object";
import {
  isArray,
  isPrimitive,
  isObject,
} from "ember-json-viewer/utils/value-types";
import { assert } from "@ember/debug";

export default Component.extend({
  tagName: "",

  // passed-in
  value: null,
  showSummary: false,

  isPrimitive: computed("value", function () {
    return isPrimitive(this.get("value"));
  }),

  prefix: computed("value", function () {
    return isArray(this.get("value")) ? "[" : "{";
  }),

  suffix: computed("value", function () {
    return isArray(this.get("value")) ? "]" : "}";
  }),

  isObj: computed("value", function () {
    return isObject(this.get("value"));
  }),

  valueSummary: computed("value", function () {
    let v = this.get("value");
    assert(
      `valueSummary only possible for non-primitive, got ${v}`,
      !isPrimitive(v)
    );
    return isArray(v) ? v.length : Object.keys(v).length;
  }),
});
