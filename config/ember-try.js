"use strict";

module.exports = async function () {
  return {
    useYarn: true,
    scenarios: [
      {
        name: "ember-lts-3.28",
        npm: {
          devDependencies: {
            "ember-source": "~3.28.0",
          },
        },
      },
      {
        name: "ember-default-with-jquery",
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            "jquery-integration": true,
          }),
        },
        npm: {
          devDependencies: {
            "@ember/jquery": "^1.1.0",
          },
        },
      },
    ],
  };
};
