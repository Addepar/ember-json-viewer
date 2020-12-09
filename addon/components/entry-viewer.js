import Component from "@ember/component";
import { computed } from "@ember/object";
import layout from "../templates/components/entry-viewer";

function isArray(v) {
  return Array.isArray(v);
}

function isPrimitive(v) {
  return ["number", "boolean", "string"].includes(typeof v);
}

const MAX_WIDTH_CHARS = 60;
const DEPTH_WIDTH = 5;

export default Component.extend({
  tagName: "",
  layout,
  isExpanded: computed("depth", "collapseDepth", "showInline", function () {
    if (this.get("showInline")) {
      return true;
    }
    let depth = this.get("depth");
    let collapseDepth = this.get("collapseDepth");
    if (collapseDepth === null) {
      return true;
    } else {
      return depth < collapseDepth;
    }
  }),

  // passed-in
  collapseDepth: null, // when not specified, all entries are expanded
  value: null,
  depth: 0,
  expandedIcon: null,
  collapsedIcon: null,

  isToggleable: computed("showInline", "value", function () {
    if (this.get("showInline")) {
      return false;
    }
    let v = this.get("value");
    return typeof v === "object";
  }),

  showInline: computed("value", function () {
    let v = this.get("value");
    if (!isArray(v)) {
      return false;
    }
    let allPrims = v.every((_v) => isPrimitive(_v));
    if (!allPrims) {
      return false;
    }
    let width = JSON.stringify(v).length;
    width += this.get("depth") * DEPTH_WIDTH;
    return width < MAX_WIDTH_CHARS;
  }),

  actions: {
    toggleExpanded() {
      if (!this.get("isToggleable")) {
        return;
      }
      this.set("isExpanded", !this.get("isExpanded"));
    },
  },
});
