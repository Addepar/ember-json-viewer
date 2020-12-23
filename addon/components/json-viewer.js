import Component from "@ember/component";
import layout from "../templates/components/json-viewer";
import { assert } from "@ember/debug";

const ALLOWED_OPTIONS = [
  "expandedIcon",
  "collapsedIcon",
  "collapseDepth",
  "showIcons",
  "quoteKeys",
];

export default Component.extend({
  tagName: "",
  layout,

  init() {
    this._super(...arguments);

    let options = this.get("options") || {};
    assert(
      `Only allowed options are: ${ALLOWED_OPTIONS}`,
      Object.keys(options).every((key) => ALLOWED_OPTIONS.includes(key))
    );

    this.set("displayOptions", options);
  },
});
