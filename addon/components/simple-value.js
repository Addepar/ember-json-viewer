import Component from "@glimmer/component";

export default class SimpleValueComponent extends Component {
  get syntaxClass() {
    return `syntax-${this.type}`;
  }

  get type() {
    return [true, false].includes(this.args.value)
      ? "literal"
      : Number.isFinite(this.args.value)
      ? "number"
      : typeof this.args.value === "string"
      ? "string"
      : "unknown";
  }

  get formattedValue() {
    if (this.type === "string") {
      return `"${this.args.value}"`;
    } else {
      return this.args.value;
    }
  }
}
