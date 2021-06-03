import Component from "@ember/component";
import { computed } from "@ember/object";
import layout from "../templates/components/entry-viewer";
import { readOnly } from "@ember/object/computed";
import { isPrimitive } from "../utils/value-types";

export default Component.extend({
  tagName: "",
  layout,
  isExpanded: computed("depth", "collapseDepth",  {
    get() {
      let depth = this.get("depth");
      let collapseDepth = this.get("collapseDepth");
      if (Number.isInteger(collapseDepth)) {
        this._isExpanded = depth < collapseDepth;
        return this._isExpanded;
      } else {
        this._isExpanded = true;
        return this._isExpanded;
      }
    },
    set(key, value) {
      return this._isExpanded = value;
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
      this.set("isExpanded", !this.get("isExpanded"));
    },
  },
});
