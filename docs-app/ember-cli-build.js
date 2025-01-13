'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // The below ensures the app is rebuilt when the addon source is rebuilt,
    // from: https://github.com/embroider-build/embroider/issues/1892#issuecomment-2562911437
    trees: {
      app: (() => {
        let sideWatch = require('@embroider/broccoli-side-watch');

        return sideWatch('app', { watching: ['ember-json-viewer'] });
      })(),
    },
  });

  return app.toTree();
};
