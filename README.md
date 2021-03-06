## visible-grid

`visible-grid` makes it easier to develop and design beautiful web
applications by making your grid system visible while you work.
See the [demo][1].

### How to use it

The easiest way to use it is via the bookmarklet available [here][1].

Download the source files from the `build` directory, or use [Bower][2].

```bash
$ bower install visible-grid
```

Add the JS to your page. It's all packaged in there.

```html
<script src="visual-grid.js" type="text/javascript">
```

Then you can create a new instance on your page.

```js
var myGrid = new Grid();
```

### Tell me more

Configure as many grids as you want. They are saved to `localStorage`, so you
can use them on any page you're working on. Resizing is taken care of
automatically, so if you have a responsive set-up simply resize to see the
grid at that width.

Quickly toggle the UI and grid with the <kbd>u</kbd> and <kbd>g</kbd> hot-keys.

You can reset your storage...

```
myGrid.reset();
```

...add a new grid...

```
myGrid.add({
  name: "Example Grid",
  color: "black",
  columns: 12,
  size: 1200,
  gutter: 20,
  baseline: 20
})
```

...and remove a grid.

```
myGrid.remove("Example Grid")
myGrid.remove(4)
```

### Developing and testing

There is a `Cakefile` for building, watching and linting. All these commands can be run with `cake`.

```bash
$ cake build    # Build the library
$ cake watch    # Watch for changes
$ cake lint     # Lint the compiled javascript.
```

Feel free to submit [issues](https://github.com/stephenhutchings/visible-grid/issues) or make [pull](https://github.com/stephenhutchings/visible-grid/pulls) requests.

[1]: http://stephenhutchings.github.io/visible-grid/demo/
[2]: http://www.bower.io/
