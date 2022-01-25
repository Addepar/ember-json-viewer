import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Helper | is-last", function (hooks) {
  setupRenderingTest(hooks);

  test("it works with arrays", async function (assert) {
    this.set("objOrArray", [1, 2, 3]);
    this.set("keyOrIndex", -1);

    await render(hbs`{{if (is-last this.objOrArray this.keyOrIndex) "YES" "NO"}}`);
    assert.equal(this.element.textContent.trim(), "NO");

    this.set("keyOrIndex", 0);
    assert.equal(this.element.textContent.trim(), "NO");

    this.set("keyOrIndex", 2);
    assert.equal(this.element.textContent.trim(), "YES");
  });

  test("it works with objects", async function (assert) {
    this.set("objOrArray", { foo: 1, bar: 2, baz: 3 });
    this.set("keyOrIndex", "foo");

    await render(hbs`{{if (is-last this.objOrArray this.keyOrIndex) "YES" "NO"}}`);
    assert.equal(this.element.textContent.trim(), "NO");

    this.set("keyOrIndex", "bar");
    assert.equal(this.element.textContent.trim(), "NO");

    this.set("keyOrIndex", "baz");
    assert.equal(this.element.textContent.trim(), "YES");
  });
});
