import Component from "@ember/component";
import { computed } from "@ember/object";
import layout from "../templates/components/simple-value";

export default Component.extend({
  tagName: "",
  layout,
  // passed-in
  value: null,

  syntaxClass: computed("type", function () {
    return `syntax-${this.type}`;
  }),

  type: computed("value", function () {
    let v = this.value;
    return [true, false].includes(v)
      ? "boolean"
      : Number.isFinite(v)
      ? "number"
      : typeof v === "string"
      ? "string"
      : v === null
      ? "null"
      : "unknown";
  }),

  formattedValue: computed("value", "type", function () {
    let v = this.value;
    if (this.type === "string") {
      return `"${v}"`;
    } else if (this.type === "null") {
      return `null`;
    } else {
      return v;
    }
  }),
});
