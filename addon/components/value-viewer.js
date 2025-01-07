import Component from '@glimmer/component';
import {
  isArray,
  isPrimitive,
  isObject,
} from 'ember-json-viewer/utils/value-types';
import { assert } from '@ember/debug';

export default class ValueViewer extends Component {
  get isPrimitive() {
    return isPrimitive(this.args.value);
  }

  get prefix() {
    return isArray(this.args.value) ? '[' : '{';
  }

  get suffix() {
    return isArray(this.args.value) ? ']' : '}';
  }

  get isObj() {
    return isObject(this.args.value);
  }

  get valueSummary() {
    let v = this.args.value;
    assert(
      `valueSummary only possible for non-primitive, got ${v}`,
      !isPrimitive(v),
    );
    return isArray(v) ? v.length : Object.keys(v).length;
  }
}
