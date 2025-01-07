import Component from '@ember/component';
import { action, computed } from '@ember/object';
import layout from '../templates/components/entry-viewer';
import { readOnly } from '@ember/object/computed';
import { isPrimitive } from '../utils/value-types';

export default Component.extend({
  tagName: '',
  layout,
  _isExpanded: null,
  isExpanded: computed('depth', 'collapseDepth', '_isExpanded', function () {
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
  }),

  // passed-in
  value: null,
  depth: 0,

  collapseDepth: readOnly('displayOptions.collapseDepth'),
  expandedIcon: readOnly('displayOptions.expandedIcon'),
  collapsedIcon: readOnly('displayOptions.collapsedIcon'),

  // It is important that this be a single text node so that the
  // selection offset is correct for copy/paste
  quotedKey: computed('key', function () {
    return `"${this.key}": `;
  }),

  isToggleable: computed('value', function () {
    return !isPrimitive(this.value);
  }),

  toggleExpanded: action(function () {
    if (!this.isToggleable) {
      return;
    }
    this.set('_isExpanded', !this.isExpanded);
  }),
});
