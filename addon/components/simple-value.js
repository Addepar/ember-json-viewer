import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import Component from '@ember/component';

@classic
@tagName('')
export default class SimpleValue extends Component {
  // passed-in
  value = null;

  @computed('type')
  get syntaxClass() {
    return `syntax-${this.type}`;
  }

  @computed('value')
  get type() {
    let v = this.value;
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

  @computed('value', 'type')
  get formattedValue() {
    let v = this.value;
    if (this.type === 'string') {
      return `"${v}"`;
    } else if (this.type === 'null') {
      return `null`;
    } else {
      return v;
    }
  }
}
