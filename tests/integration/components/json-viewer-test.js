import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | json-viewer", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders simple JSON", async function (assert) {
    let json = { foo: "bar" };
    this.set("json", json);
    await render(hbs`<JsonViewer @json={{this.json}} />`);

    assert.ok(this.element.textContent.trim().includes('"foo"'));
    assert.ok(this.element.textContent.trim().includes('"bar"'));

    let expectedPaths = {
      rootOpen: "$<",
      fooKey: "$.foo",
      fooValue: "$.foo@",
      rootClose: "$>",
    };

    for (let [name, path] of Object.entries(expectedPaths)) {
      assert.dom(`[data-path="${path}"]`).exists(`expect path ${name}`);
    }
  });

  test("it renders more complex JSON", async function (assert) {
    let json = {
      foo: "bar",
      arr: [1, 2, 3],
      obj: { one: 1, two: 2 },
      last: "last",
    };
    this.set("json", json);
    await render(hbs`<JsonViewer @json={{this.json}} />`);

    let expectedPaths = {
      rootOpen: "$<",
      fooKey: "$.foo",
      fooValue: "$.foo@",
      fooValueDelimiter: "$.foo@,",
      arrKey: "$.arr",
      arrValueOpen: "$.arr<",
      arrValueClose: "$.arr>",
      arrEntry: "$.arr[0]@",
      arrEntryDelim: "$.arr[0]@,",
      objKey: "$.obj",
      objOpen: "$.obj<",
      objClose: "$.obj>",
      objPropKey: "$.obj.one",
      objPropValue: "$.obj.one@",
      objPropValueDelim: "$.obj.one@,",
      objDelim: "$.obj@,",
      rootClose: "$>",
    };

    for (let [name, path] of Object.entries(expectedPaths)) {
      assert.dom(`[data-path="${path}"]`).exists(`expect path ${name}`);
    }
  });

  test("collapse depth", async function (assert) {
    let json = { zero: { one: { two: { three: 3 } } } };

    this.set("json", json);
    this.set("collapseDepth", 0);

    await render(
      hbs`<JsonViewer @json={{this.json}} @options={{hash collapseDepth=this.collapseDepth}}/>`
    );

    assert.dom('[data-path="$.zero"]').exists("collapse 0");
    assert.dom('[data-path="$.zero.one"]').doesNotExist("collapse 0");

    this.set("collapseDepth", 1);
    assert.dom('[data-path="$.zero"]').exists("collapse 1");
    assert.dom('[data-path="$.zero.one"]').exists("collapse 1");
    assert.dom('[data-path="$.zero.one.two"]').doesNotExist("collapse 1");

    this.set("collapseDepth", 2);
    assert.dom('[data-path="$.zero"]').exists("collapse 2");
    assert.dom('[data-path="$.zero.one"]').exists("collapse 2");
    assert.dom('[data-path="$.zero.one.two"]').exists("collapse 2");
    assert.dom('[data-path="$.zero.one.two.three"]').doesNotExist("collapse 2");

    this.set("collapseDepth", 3);
    assert.dom('[data-path="$.zero"]').exists("collapse 3");
    assert.dom('[data-path="$.zero.one"]').exists("collapse 3");
    assert.dom('[data-path="$.zero.one.two"]').exists("collapse 3");
    assert.dom('[data-path="$.zero.one.two.three"]').exists("collapse 3");
  });
});
