import Controller from "@ember/controller";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

const DEFAULT_JSON = {
  stringKey: "stringValue",
  numberKey: 123,
  numArrayKey: [1, 2, 3],
  includeNull: [1, null, "two", false],
  mixedKey: ["one", 2.1234, "three point four five 6", 7.891],
  stringArrayKey: [
    "one",
    "two",
    "three",
    "stringValue1",
    "stringValue2",
    "stringValue3",
  ],
  bool: true,
  nonBool: false,
  objKey: {
    foo: "bar",
    baz: 123,
    nested: {
      more: "value",
      deeper: {
        thoughts: [123, 456, 789],
        foo: "bar",
        baz: 123,
        nested: {
          more: "value",
          deeper: {
            thoughts: [123, 456, 789],
            foo: "bar",
            baz: 123,
            nested: {
              more: "value",
              deeper: {
                thoughts: [123, 456, 789],
                stringArrayKey: [
                  "one",
                  "two",
                  "three",
                  "stringValue",
                  "stringValue",
                  "stringValue",
                  "stringValue",
                  "stringValue",
                ],
              },
            },
          },
        },
      },
    },
  },
};

export default class ApplicationController extends Controller {
  @tracked
  json = DEFAULT_JSON;

  @tracked
  isJSONValid = true;

  @action updateJSON(evt) {
    try {
      let v = JSON.parse(evt.target.value);
      this.json = v;
      this.isJSONValid = true;
    } catch (e) {
      // ignore unparseable json
      this.isJSONValid = false;
    }
  }
}
