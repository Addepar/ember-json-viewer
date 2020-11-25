import Component from "@ember/component";
import { computed } from "@ember/object";
import layout from "../templates/components/simple-value";

export default Component.extend({
  tagName: "",
  layout,
  // passed-in
  value: null,

  syntaxClass: computed("type", function () {
    return `syntax-${this.get("type")}`;
  }),

  type: computed("value", function () {
    let v = this.get("value");
    return [true, false].includes(v)
      ? "literal"
      : Number.isFinite(v)
      ? "number"
      : typeof v === "string"
      ? "string"
      : "unknown";
  }),

  formattedValue: computed("value", function () {
    let v = this.get("value");
    if (this.get("type") === "string") {
      return `"${v}"`;
    } else {
      return v;
    }
  }),
});
