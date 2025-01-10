import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | json-viewer', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders simple JSON', async function (assert) {
    let json = { foo: 'bar' };
    this.set('json', json);
    await render(hbs`<JsonViewer @json={{this.json}} />`);

    assert.true(this.element.textContent.trim().includes('"foo"'));
    assert.true(this.element.textContent.trim().includes('"bar"'));

    let expectedPaths = {
      rootOpen: '$<',
      fooKey: '$.foo',
      fooValue: '$.foo@',
      rootClose: '$>',
    };

    for (let [name, path] of Object.entries(expectedPaths)) {
      assert.dom(`[data-path="${path}"]`).exists(`expect path ${name}`);
    }
  });

  test('it renders more complex JSON', async function (assert) {
    let json = {
      foo: 'bar',
      arr: [1, 2, 3],
      obj: { one: 1, two: 2 },
      last: 'last',
    };
    this.set('json', json);
    await render(hbs`<JsonViewer @json={{this.json}} />`);

    let expectedPaths = {
      rootOpen: '$<',
      fooKey: '$.foo',
      fooValue: '$.foo@',
      fooValueDelimiter: '$.foo@,',
      arrKey: '$.arr',
      arrValueOpen: '$.arr<',
      arrValueClose: '$.arr>',
      arrEntry: '$.arr[0]@',
      arrEntryDelim: '$.arr[0]@,',
      objKey: '$.obj',
      objOpen: '$.obj<',
      objClose: '$.obj>',
      objPropKey: '$.obj.one',
      objPropValue: '$.obj.one@',
      objPropValueDelim: '$.obj.one@,',
      objDelim: '$.obj@,',
      rootClose: '$>',
    };

    for (let [name, path] of Object.entries(expectedPaths)) {
      assert.dom(`[data-path="${path}"]`).exists(`expect path ${name}`);
    }
  });

  test('collapse depth', async function (assert) {
    let json = { zero: { one: { two: { three: 3 } } } };

    this.set('json', json);
    this.set('collapseDepth', 0);

    await render(
      hbs`<JsonViewer @json={{this.json}} @options={{hash collapseDepth=this.collapseDepth}}/>`,
    );

    assert.dom('[data-path="$.zero"]').exists('collapse 0');
    assert.dom('[data-path="$.zero.one"]').doesNotExist('collapse 0');

    this.set('collapseDepth', 1);
    assert.dom('[data-path="$.zero"]').exists('collapse 1');
    assert.dom('[data-path="$.zero.one"]').exists('collapse 1');
    assert.dom('[data-path="$.zero.one.two"]').doesNotExist('collapse 1');

    this.set('collapseDepth', 2);
    assert.dom('[data-path="$.zero"]').exists('collapse 2');
    assert.dom('[data-path="$.zero.one"]').exists('collapse 2');
    assert.dom('[data-path="$.zero.one.two"]').exists('collapse 2');
    assert.dom('[data-path="$.zero.one.two.three"]').doesNotExist('collapse 2');

    this.set('collapseDepth', 3);
    assert.dom('[data-path="$.zero"]').exists('collapse 3');
    assert.dom('[data-path="$.zero.one"]').exists('collapse 3');
    assert.dom('[data-path="$.zero.one.two"]').exists('collapse 3');
    assert.dom('[data-path="$.zero.one.two.three"]').exists('collapse 3');
  });

  test('shows entry summary', async function (assert) {
    let json = { zero: { one: { two: { three: 3 } } } };

    this.set('json', json);
    this.set('collapseDepth', 0);

    await render(
      hbs`<JsonViewer @json={{this.json}} @options={{hash collapseDepth=this.collapseDepth}}/>`,
    );

    assert.dom('[data-path="$.zero"]').exists();
    assert.dom('[data-path="$.zero.one"]').doesNotExist();
    assert
      .dom('[data-test-entry-summary="$.zero"]')
      .exists('shows entry summary');
    assert.dom('[data-test-entry-summary="$.zero"]').containsText('1');

    await click('[data-test-toggle="$.zero"]');
    assert
      .dom('[data-test-entry-summary="$.zero"]')
      .doesNotExist('does not show entry summary after toggle to open');
    assert.dom('[data-path="$.zero.one"]').exists('shows zero.one after open');

    await click('[data-test-toggle="$.zero"]');
    assert
      .dom('[data-test-entry-summary="$.zero"]')
      .exists('shows summary again after toggle closed');
    assert
      .dom('[data-path="$.zero.one"]')
      .doesNotExist('hides zero.one after toggle close');
  });

  test('only data-path elements are user-selectable', async function (assert) {
    this.set('json', {
      foo: 'bar',
      obj: { foo: 'bar' },
      arr: [1, true, 'tree'],
    });

    await render(
      hbs`<JsonViewer data-test-json-viewer-outer @json={{this.json}} />`,
    );
    let outerEl = document.querySelector('[data-test-json-viewer-outer]');
    let els = outerEl.querySelectorAll('*');
    for (let el of Array.from(els)) {
      let isSelectable = el.hasAttribute('data-path');
      let userSelectStyle = window
        .getComputedStyle(el)
        .getPropertyValue('user-select');
      let expected = isSelectable ? 'text' : 'none';
      assert.strictEqual(userSelectStyle, expected);
    }
  });

  test('no comma after final object', async function (assert) {
    this.set('json', {
      obj: { foo: 'bar' },
    });
    await render(
      hbs`<JsonViewer data-test-json-viewer-outer @json={{this.json}} />`,
    );

    assert
      .dom('[data-path="$.obj>"]')
      .containsText('}', 'object closing brace is present');
    assert
      .dom('[data-path="$.obj@,"]')
      .doesNotExist('no comma after final object');
    assert
      .dom('[data-test-json-viewer-outer]')
      .doesNotContainText(',', 'No comma appears in the output');
  });
});
