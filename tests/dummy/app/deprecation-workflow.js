import setupDeprecationWorkflow from 'ember-cli-deprecation-workflow';

setupDeprecationWorkflow({
  workflow: [{ handler: 'throw', matchId: 'this-property-fallback' }],
});
