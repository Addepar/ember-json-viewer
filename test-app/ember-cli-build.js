'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // The below ensures the app is rebuilt when the addon source is rebuilt,
    // from: https://github.com/embroider-build/embroider/issues/1892#issuecomment-2562911437
    trees: {
      app: (() => {
        let sideWatch = require('@embroider/broccoli-side-watch');

        return sideWatch('app', {
          watching: [require('../addon/package.json').name],
        });
      })(),
    },
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    // Without the following, the build fails in CI (ie when env.CI=true) with somewhat mysterious webpack errors
    // about failing to find exports from QUnit (and other) modules.
    // See: https://github.com/embroider-build/embroider/issues/677/#issuecomment-813118275
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
