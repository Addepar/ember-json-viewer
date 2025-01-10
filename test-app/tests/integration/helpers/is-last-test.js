import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { isLast } from 'ember-json-viewer';

module('Integration | Helper | is-last', function (hooks) {
  setupRenderingTest(hooks);

  test('it works with arrays', async function (assert) {
    this.set('objOrArray', [1, 2, 3]);
    this.set('keyOrIndex', -1);
    this.set('isLast', isLast);

    await render(
      hbs`{{if (this.isLast this.objOrArray this.keyOrIndex) "YES" "NO"}}`,
    );
    assert.strictEqual(this.element.textContent.trim(), 'NO');

    this.set('keyOrIndex', 0);
    assert.strictEqual(this.element.textContent.trim(), 'NO');

    this.set('keyOrIndex', 2);
    assert.strictEqual(this.element.textContent.trim(), 'YES');
  });

  test('it works with objects', async function (assert) {
    this.set('objOrArray', { foo: 1, bar: 2, baz: 3 });
    this.set('keyOrIndex', 'foo');
    this.set('isLast', isLast);

    await render(
      hbs`{{if (this.isLast this.objOrArray this.keyOrIndex) "YES" "NO"}}`,
    );
    assert.strictEqual(this.element.textContent.trim(), 'NO');

    this.set('keyOrIndex', 'bar');
    assert.strictEqual(this.element.textContent.trim(), 'NO');

    this.set('keyOrIndex', 'baz');
    assert.strictEqual(this.element.textContent.trim(), 'YES');
  });
});
