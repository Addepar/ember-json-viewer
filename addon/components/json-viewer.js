import Component from "@ember/component";
import layout from "../templates/components/json-viewer";
import { assert } from "@ember/debug";

const ALLOWED_OPTIONS = [
  "expandedIcon",
  "collapsedIcon",
  "collapseDepth",
  "quoteKeys",
];

export default Component.extend({
  layout,
  classNames: ["json-viewer"],

  init() {
    this._super(...arguments);

    let options = this.get("options") || {};
    assert(
      `Only allowed options are: ${ALLOWED_OPTIONS}`,
      Object.keys(options).every((key) => ALLOWED_OPTIONS.includes(key))
    );

    this.set("displayOptions", options);
  },

  didInsertElement() {
    this._super(...arguments);
    this.element.setAttribute("tabindex", "-1");
    this.element.addEventListener("copy", (evt) => {
      console.log(evt);
      try {
        let json = document.getSelection().toString().replaceAll(">", "");
        let formatted = JSON.stringify(JSON.parse(json), null, 2);
        evt.clipboardData.setData("text/plain", formatted);
        evt.preventDefault();
      } catch (e) {
        console.error(e);
      }
    });
  },
});
