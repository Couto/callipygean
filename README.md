# callipygean
_adj._ Having beautifully proportioned buttocks.

From Ancient Greek __καλλίπυγος__ (kallipugos), from __καλλι-__ (kalli-, _beautiful_) + __πυγή__ (pugē, _buttocks_).

```
     .         .
     |         |
     j    :    l
    /           \
   /             \
  Y       .       Y
  |       |       |
  l "----~Y~----" !
   \      |      /
    Y     |     Y
    |     I     |
```

JSON expandable/collapsible with compatibility with common Syntax Highlighters

## Getting Started

### In the browser
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/Couto/callipygean/master/dist/callipygean.min.js
[max]: https://raw.github.com/Couto/callipygean/master/dist/callipygean.js

In your web page:

```html
<script src="dist/callipygean.min.js"></script>
<script>
awesome(); // "awesome"
</script>
```

In your code, you can attach callipygean's methods to any object.

```html
<script>
this.exports = Bocoup.utils;
</script>
<script src="dist/callipygean.min.js"></script>
<script>
Bocoup.utils.awesome(); // "awesome"
</script>
```

Or you can use an AMD loader

```javascript
require(['dist/callipygean.min'], function (callipygean) {
    callipygean()
});
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "lib" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Couto
Licensed under the [MIT license](http://couto.mit-license.org).
