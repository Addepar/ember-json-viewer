import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { isPrimitive } from '../../../utils/value-types';

export default class EntryViewer extends Component {
  @tracked
  _isExpanded = null;

  get isExpanded() {
    if (this._isExpanded !== null) {
      return this._isExpanded;
    }
    let depth = this.args.depth;
    let collapseDepth = this.collapseDepth;
    if (Number.isInteger(collapseDepth)) {
      return depth < collapseDepth;
    } else {
      return true;
    }
  }

  get isNotExpanded() {
    return !this.isExpanded;
  }

  inc = (num) => num + 1;

  get collapseDepth() {
    return this.args.displayOptions?.collapseDepth;
  }

  get expandedIcon() {
    return this.args.displayOptions?.expandedIcon;
  }

  get collapsedIcon() {
    return this.args.displayOptions?.collapsedIcon;
  }

  // It is important that this be a single text node so that the
  // selection offset is correct for copy/paste
  get quotedKey() {
    return `"${this.args.key}": `;
  }

  get isToggleable() {
    return !isPrimitive(this.args.value);
  }

  @action
  toggleExpanded() {
    if (!this.isToggleable) {
      return;
    }
    this._isExpanded = !this.isExpanded;
  }
}
