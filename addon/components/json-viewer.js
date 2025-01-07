import Component from '@ember/component';
import layout from '../templates/components/json-viewer';
import { assert } from '@ember/debug';
import jsonStringify from '../utils/json-stringify';
import { computed } from '@ember/object';

const ALLOWED_OPTIONS = ['expandedIcon', 'collapsedIcon', 'collapseDepth'];

// Returns [startNode, startOffset, endNode, endOffset]
// Reverses the window selection if the anchor node is after the
// focus node
function getOrderedSelection() {
  let selection = window.getSelection();

  if (!selection) {
    return null;
  }

  let { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
  if (
    focusNode.compareDocumentPosition(anchorNode) &
    Node.DOCUMENT_POSITION_FOLLOWING
  ) {
    // Range is reversed
    return [focusNode, focusOffset, anchorNode, anchorOffset];
  } else {
    return [anchorNode, anchorOffset, focusNode, focusOffset];
  }
}

function getPath(node) {
  let path = null;
  while (!path && node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.hasAttribute('data-path')) {
        return node.getAttribute('data-path');
      }
    }
    node = node.parentNode;
  }
}

export default Component.extend({
  classNames: ['json-viewer'],
  layout,

  // passed-in
  json: null,

  displayOptions: computed('options', function () {
    let options = this.options || {};
    assert(
      `Only allowed options are: ${ALLOWED_OPTIONS}`,
      Object.keys(options).every((key) => ALLOWED_OPTIONS.includes(key)),
    );
    return options;
  }),

  didInsertElement() {
    this._super(...arguments);
    this._copyHandler = (evt) => {
      let [startNode, startOffset, endNode, endOffset] = getOrderedSelection();

      let startPath = getPath(startNode);
      let endPath = getPath(endNode);
      let range = {
        start: { path: startPath, index: startOffset },
        end: { path: endPath, index: endOffset },
      };
      let str = jsonStringify(this.json, range);
      evt.clipboardData.setData('text/plain', str);
      evt.preventDefault();
    };
    this.element.addEventListener('copy', this._copyHandler);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.element.removeEventListener('copy', this._copyHandler);
    this._copyHandler = null;
  },
});
