import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import Component from '@ember/component';
import {
  isArray,
  isPrimitive,
  isObject,
} from 'ember-json-viewer/utils/value-types';
import { assert } from '@ember/debug';

@classic
@tagName('')
export default class ValueViewer extends Component {
  // passed-in
  value = null;

  showSummary = false;

  @computed('value')
  get isPrimitive() {
    return isPrimitive(this.value);
  }

  @computed('value')
  get prefix() {
    return isArray(this.value) ? '[' : '{';
  }

  @computed('value')
  get suffix() {
    return isArray(this.value) ? ']' : '}';
  }

  @computed('value')
  get isObj() {
    return isObject(this.value);
  }

  @computed('value')
  get valueSummary() {
    let v = this.value;
    assert(
      `valueSummary only possible for non-primitive, got ${v}`,
      !isPrimitive(v),
    );
    return isArray(v) ? v.length : Object.keys(v).length;
  }
}
