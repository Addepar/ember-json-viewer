import Component from "@ember/component";
import { computed } from "@ember/object";
import {
  isArray,
  isPrimitive,
  isObject,
} from "ember-json-viewer/utils/value-types";
import { assert } from "@ember/debug";

export default class ValueViewer extends Component {
  tagName = "";

  // passed-in
  value = null;
  showSummary = false;

  @computed('value')
  get isPrimitive() {
    return isPrimitive(this.get("value"));
  }

  @computed('value')
  get prefix() {
    return isArray(this.get("value")) ? "[" : "{";
  }

      @computed('value')
  get suffix() {
    return isArray(this.get("value")) ? "]" : "}";
  }

  @computed('value')
  get isObj() {
    return isObject(this.get("value"));
  }

  @computed('value')
  get valueSummary() {
    let v = this.get("value");
    assert(
      `valueSummary only possible for non-primitive, got ${v}`,
      !isPrimitive(v)
    );
    return isArray(v) ? v.length : Object.keys(v).length;
  }
}
