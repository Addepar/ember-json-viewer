import Component from "@ember/component";
import { action, computed } from "@ember/object";
import { htmlSafe } from "@ember/template";
import layout from "../templates/components/entry-viewer";
import { readOnly } from "@ember/object/computed";
import { isPrimitive } from "../utils/value-types";

export default Component.extend({
  tagName: "",
  layout,
  _isExpanded: null,
  isExpanded: computed("depth", "collapseDepth", "_isExpanded", function () {
    if (this.get("_isExpanded") !== null) {
      return this.get("_isExpanded");
    }
    let depth = this.get("depth");
    let collapseDepth = this.get("collapseDepth");
    if (Number.isInteger(collapseDepth)) {
      return depth < collapseDepth;
    } else {
      return true;
    }
  }),

  // passed-in
  value: null,
  depth: 0,

  collapseDepth: readOnly("displayOptions.collapseDepth"),

  expandedIcon: computed("displayOptions.expandedIcon", function () {
    return htmlSafe(this.displayOptions.expandedIcon);
  }),

  collapsedIcon: computed("displayOptions.collapsedIcon", function () {
    return htmlSafe(this.displayOptions.collapsedIcon);
  }),

  // It is important that this be a single text node so that the
  // selection offset is correct for copy/paste
  quotedKey: computed("key", function () {
    return `"${this.get("key")}": `;
  }),

  isToggleable: computed("value", function () {
    return !isPrimitive(this.get("value"));
  }),

  toggleExpanded: action(function () {
    if (!this.get("isToggleable")) {
      return;
    }
    this.set("_isExpanded", !this.get("isExpanded"));
  }),
});
