# ember-json-viewer

Ember addon that exposes a component `{{json-viewer}}`.
Pass it a JSON object (not string) as `json`: `{{json-viewer json=this.jsonValue}}`.

Demo: http://addepar.github.io/ember-json-viewer

![Demo Gif](./demo.gif)

## Compatibility

- Ember.js v3.8 or above
- Ember CLI v2.13 or above (unconfirmed)
- Node.js v10 or above (unconfirmed)

## Installation

```
ember install ember-json-viewer
```

## Options

You can use options by passing in an object (or hash) with the following keys:

```html.handlebars
<JsonViewer
  @json={{this.json}}
  @options={{hash
    expandedIcon=">"
    collapsedIcon="<"
    collapseDepth=5
  }}
/>
```

### `expandedIcon`

The string prepended to a key when that particular key value is expanded.

### `collapsedIcon`

The string prepended to a key when that particular key value is collapsed.

### `collapseDepth`

This sets the initial level of expanded items.  `collapseDepth=0` will have all properties collapsed completely.  `collapseDepth=1` will expand the first level of keys.

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## Deploy Demo to Github Pages

`npm run deploy`

## License

This project is licensed under the [MIT License](LICENSE.md).
