'use strict';

const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');
module.exports = async function () {
  return {
    useYarn: true,
    scenarios: [
      embroiderSafe(),
      embroiderOptimized(),
      {
        name: 'ember-lts-3.28',
        npm: {
          devDependencies: {
            'ember-source': '~3.28.0',
            '@ember/test-helpers': '^2.4.0',
            '@glimmer/component': '^1.1.2',
          },
        },
      },
      {
        name: 'ember-lts-4.4',
        npm: {
          devDependencies: {
            'ember-source': '~4.4.0',
            '@glimmer/component': '^1.1.2',
          },
        },
      },
      {
        name: 'ember-lts-4.8',
        npm: {
          devDependencies: {
            'ember-source': '~4.8.0',
            '@glimmer/component': '^1.1.2',
          },
        },
      },
      {
        name: 'ember-lts-4.12',
        npm: {
          devDependencies: {
            'ember-source': '~4.12.0',
          },
        },
      },
    ],
  };
};
