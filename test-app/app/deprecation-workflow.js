import setupDeprecationWorkflow from 'ember-cli-deprecation-workflow';

setupDeprecationWorkflow({
  workflow: [
    { handler: 'throw', matchId: 'this-property-fallback' },
    { handler: 'throw', matchId: 'remove-owner-inject' },
    { handler: 'throw', matchId: 'deprecate-auto-location' },
    { handler: 'throw', matchId: 'ember-string.add-package' },
    { handler: 'throw', matchId: 'ember-string.from-ember-module' },
  ],
});
