import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { isPrimitive } from '../utils/value-types';

@classic
@tagName('')
export default class EntryViewer extends Component {
  _isExpanded = null;
  @computed('depth', 'collapseDepth', '_isExpanded')
  get isExpanded() {
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

  @readOnly('displayOptions.collapseDepth') collapseDepth;
  @readOnly('displayOptions.expandedIcon') expandedIcon;
  @readOnly('displayOptions.collapsedIcon') collapsedIcon;

  // It is important that this be a single text node so that the
  // selection offset is correct for copy/paste
  @computed('key')
  get quotedKey() {
    return `"${this.key}": `;
  }

  @computed('value')
  get isToggleable() {
    return !isPrimitive(this.value);
  }

  @action
  toggleExpanded() {
    if (!this.isToggleable) {
      return;
    }
    this.set('_isExpanded', !this.isExpanded);
  }
}
