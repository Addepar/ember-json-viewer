import Component from "@glimmer/component";
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { action, computed } from '@ember/object';
import layout from "../templates/components/entry-viewer";
import { isPrimitive } from "../utils/value-types";
import { tracked } from '@glimmer/tracking';

export default class extends Component {
  tagName = "";
  layout = layout;
  _isExpanded = null;

  @tracked("depth", "collapseDepth", "_isExpanded")
  get isExpanded () {
    if (this._isExpanded !== null) {
      return this._isExpanded;
    }
    let depth = this.depth;
    let collapseDepth = this.collapseDepth;
    if (Number.isInteger(collapseDepth)) {
      return depth < collapseDepth;
    } else {
      return true;
    }
  }

  // passed-in
  value = null;
  depth = 0;

  get collapseDepth () {
    return this.displayOptions.collapseDepth;
  }
  get expandedIcon () {
    return this.displayOptions.expandedIcon;
  }
  get collapsedIcon () {
    return this.displayOptions.collapsedIcon;
  }

  // It is important that this be a single text node so that the
  // selection offset is correct for copy/paste
  quotedKey = computed("key", function () {
    return `"${this.key}": `;
  })

  isToggleable = computed("value", function () {
    return !isPrimitive(this.value);
  })

  @action()
  toggleExpanded() {
    if (!this.isToggleable) {
      return;
    }
    this._isExpanded = !this.isExpanded;
  }
}
