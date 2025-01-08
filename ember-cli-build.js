'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

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
