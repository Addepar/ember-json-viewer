import Component from "@ember/component";
import { computed } from "@ember/object";

export default Component.extend({
  tagName: "",
  // passed-in
  value: null,

  syntaxClass: computed("type", function () {
    return `syntax-${this.get("type")}`;
  }),

  type: computed("value", function () {
    let v = this.get("value");
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
    let v = this.get("value");
    if (this.get("type") === "string") {
      return `"${v}"`;
    } else if (this.get("type") === "null") {
      return `null`;
    } else {
      return v;
    }
  }),
});
