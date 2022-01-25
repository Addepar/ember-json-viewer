import Component from "@ember/component";
import { computed } from "@ember/object";
import { readOnly } from "@ember/object/computed";
import { isPrimitive } from "../utils/value-types";

export default Component.extend({
  tagName: "",
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
  expandedIcon: readOnly("displayOptions.expandedIcon"),
  collapsedIcon: readOnly("displayOptions.collapsedIcon"),

  // It is important that this be a single text node so that the
  // selection offset is correct for copy/paste
  quotedKey: computed("key", function () {
    return `"${this.get("key")}": `;
  }),

  isToggleable: computed("value", function () {
    return !isPrimitive(this.get("value"));
  }),

  actions: {
    toggleExpanded() {
      if (!this.get("isToggleable")) {
        return;
      }
      this.set("_isExpanded", !this.get("isExpanded"));
    },
  },
});
