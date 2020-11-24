import Component from "@glimmer/component";

function isPrimitive(v) {
  return ["number", "boolean", "string"].includes(typeof v);
}

export default class ValueViewerComponent extends Component {
  get isPrimitive() {
    return isPrimitive(this.args.value);
  }

  get prefix() {
    return this.isArray ? "[" : "{";
  }

  get suffix() {
    return this.isArray ? "]" : "}";
  }

  get isObj() {
    return !this.isArray && typeof this.args.value === "object";
  }

  get isArray() {
    return Array.isArray(this.args.value);
  }

  get entryDelimiter() {
    return ",";
  }

  get valueSummary() {
    if (this.isArray) {
      let count = this.args.value.length;
      return `${count} ${count === 1 ? "item" : "items"}`;
    } else {
      let count = Object.keys(this.args.value).length;
      return `${count} ${count === 1 ? "entry" : "entries"}`;
    }
  }
}
