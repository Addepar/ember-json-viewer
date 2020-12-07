import Component from "@ember/component";
import { computed } from "@ember/object";
import layout from "../templates/components/value-viewer";

function isPrimitive(v) {
  return ["number", "boolean", "string"].includes(typeof v);
}

export default Component.extend({
  tagName: "",
  layout,

  // passed-in
  value: null,

  isPrimitive: computed("value", function () {
    return isPrimitive(this.get("value"));
  }),

  prefix: computed("isArray", function () {
    return this.get("isArray") ? "[" : "{";
  }),
  suffix: computed("isArray", function () {
    return this.get("isArray") ? "]" : "}";
  }),

  isObj: computed("value", function () {
    return !this.get("isArray") && typeof this.get("value") === "object";
  }),
  isArray: computed("value", function () {
    return Array.isArray(this.get("value"));
  }),

  entryDelimiter: ",",

  valueSummary: computed("value", function () {
    let v = this.get("value");
    let count;
    if (this.get("isArray")) {
      count = v.length;
    } else {
      count = Object.keys(v).length;
    }

    return count;
  }),
});
