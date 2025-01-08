import Component from '@glimmer/component';

export default class SimpleValue extends Component {
  get syntaxClass() {
    return `syntax-${this.type}`;
  }

  get type() {
    let v = this.args.value;
    return [true, false].includes(v)
      ? 'boolean'
      : Number.isFinite(v)
        ? 'number'
        : typeof v === 'string'
          ? 'string'
          : v === null
            ? 'null'
            : 'unknown';
  }

  get formattedValue() {
    let v = this.args.value;
    if (this.type === 'string') {
      return `"${v}"`;
    } else if (this.type === 'null') {
      return `null`;
    } else {
      return v;
    }
  }
}
