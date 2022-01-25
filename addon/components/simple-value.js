import Component from "@ember/component";
import { computed } from "@ember/object";

export default class SimpleValue extends Component {
  tagName = "";
  // passed-in
  value = null;

  @computed('type')
  get syntaxClass() {
    return `syntax-${this.get("type")}`;
  }

@computed('value')
  get type(){
    let v = this.get("value");
    return [true, false].includes(v)
      ? "boolean"
      : Number.isFinite(v)
      ? "number"
      : typeof v === "string"
      ? "string"
      : v === null
      ? "null"
      : "unknown";
  }

  @computed('value', 'type')
  get formattedValue() {
    let v = this.get("value");
    if (this.get("type") === "string") {
      return `"${v}"`;
    } else if (this.get("type") === "null") {
      return `null`;
    } else {
      return v;
    }
  }
}
