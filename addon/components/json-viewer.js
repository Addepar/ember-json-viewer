import Component from "@ember/component";
import layout from "../templates/components/json-viewer";

export default Component.extend({
  tagName: "",
  layout,

  // Can be overridden
  expandedIcon: "+",
  collapsedIcon: "-",
  collapseDepth: null, // indicates all nodes are expanded
});
