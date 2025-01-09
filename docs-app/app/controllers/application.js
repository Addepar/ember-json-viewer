import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

const DEFAULT_JSON = {
  stringKey: 'stringValue',
  numberKey: 123,
  numArrayKey: [1, 2, 3],
  includeNull: [1, null, 'two', false],
  mixedKey: ['one', 2.1234, 'three point four five 6', 7.891],
  stringArrayKey: [
    'one',
    'two',
    'three',
    'stringValue1',
    'stringValue2',
    'stringValue3',
  ],
  bool: true,
  nonBool: false,
  objKey: {
    foo: 'bar',
    baz: 123,
    nested: {
      more: 'value',
      deeper: {
        thoughts: [123, 456, 789],
        foo: 'bar',
        baz: 123,
        nested: {
          more: 'value',
          deeper: {
            thoughts: [123, 456, 789],
            foo: 'bar',
            baz: 123,
            nested: {
              more: 'value',
              deeper: {
                thoughts: [123, 456, 789],
                stringArrayKey: [
                  'one',
                  'two',
                  'three',
                  'stringValue',
                  'stringValue',
                  'stringValue',
                  'stringValue',
                  'stringValue',
                ],
              },
            },
          },
        },
      },
    },
  },
};

function isParseable(json) {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}

export default class ApplicationController extends Controller {
  @tracked
  sourceJSONStr = JSON.stringify(DEFAULT_JSON, null, 2);

  @tracked
  viewJSON = DEFAULT_JSON;

  @tracked
  isJSONValid = true;

  @action
  updateJSON(evt) {
    this.sourceJSONStr = evt.target.value;
    this.isJSONValid = isParseable(this.sourceJSONStr);
    if (this.isJSONValid) {
      this.viewJSON = JSON.parse(this.sourceJSONStr);
    }
  }

  @action
  formatSourceJSONStr() {
    this.sourceJSONStr = JSON.stringify(this.viewJSON, null, 2);
  }
}
