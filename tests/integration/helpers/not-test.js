import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | not', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set('inputValue', 'truthy');

    await render(hbs`{{if (not this.inputValue) "YES" "NO"}}`);
    assert.equal(this.element.textContent.trim(), 'NO');

    this.set('inputValue', '0');
    assert.equal(this.element.textContent.trim(), 'NO');

    this.set('inputValue', 0);
    assert.equal(this.element.textContent.trim(), 'YES');

    this.set('inputValue', false);
    assert.equal(this.element.textContent.trim(), 'YES');
  });
});
