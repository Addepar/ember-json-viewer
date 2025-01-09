'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
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
