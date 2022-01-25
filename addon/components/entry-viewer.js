import Component from "@ember/component";
import { action, computed } from "@ember/object";
import { readOnly } from "@ember/object/computed";
import { isPrimitive } from "../utils/value-types";

export default class EntryViewer extends Component {
  tagName="";
  _isExpanded= null;
  @computed('depth', 'collapseDepth', '_isExpanded')
  get isExpanded() {
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
  }

  // passed-in
  value = null;
  depth = 0;

   @readOnly("displayOptions.collapseDepth") collapseDepth;
  @readOnly("displayOptions.expandedIcon") expandedIcon;
   @readOnly("displayOptions.collapsedIcon") collapsedIcon;

  // It is important that this be a single text node so that the
  // selection offset is correct for copy/paste
  @computed('key')
  get quotedKey() {
    return `"${this.get("key")}": `;
  }

  @computed('value')
  get isToggleable() {
    return !isPrimitive(this.get("value"));
  }

  @action
  toggleExpanded() {
    if (!this.get("isToggleable")) {
      return;
    }
    this.set("_isExpanded", !this.get("isExpanded"));
  }
}
