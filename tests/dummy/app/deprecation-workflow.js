import setupDeprecationWorkflow from 'ember-cli-deprecation-workflow';

setupDeprecationWorkflow({
  workflow: [{ handler: 'silence', matchId: 'this-property-fallback' }],
});
