/* visible-grid - v0.2.0 - MIT */
/* Design and develop with a visible grid */
/* https://github.com/stephenhutchings/visible-grid.git */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, document, Math) {
  var Grid, pixelDensity, storageKey;
  pixelDensity = window.devicePixelRatio || 1;
  storageKey = "visible-grid";
  Grid = function () {
    function Grid() {
      _classCallCheck(this, Grid);

      var id;
      this.el = document.createElement("div");
      id = "grid-" + Math.random().toFixed(8).split(".")[1];
      this.el.setAttribute("id", id);
      this.el.innerHTML = this.template(id);
      this.elements = {
        canvas: this.el.querySelector("canvas"),
        form: this.el.querySelector("form")
      };
      this.keys = ["gutter", "columns", "size", "color", "baseline", "offset", "grid", "divisions", "constrain", "gridOffset", "gridOrigin"];
      this.context = this.elements.canvas.getContext("2d");
      document.body.appendChild(this.el, "beforeEnd");
      this.load();
      this.bindEvents();
    }

    _createClass(Grid, [{
      key: "getIndex",
      value: function getIndex() {
        return +this.elements.form.select.value;
      }
    }, {
      key: "bindEvents",
      value: function bindEvents() {
        this.el.addEventListener("input", this, false);
        this.el.addEventListener("click", this, false);
        this.el.addEventListener("submit", this, false);
        window.addEventListener("keydown", this, false);
        return window.addEventListener("resize", this, false);
      }
    }, {
      key: "handleEvent",
      value: function handleEvent(e) {
        switch (e.type) {
          case "click":
            if (e.target === this.elements.form.remove) {
              this.remove();
            }
            if (e.target === this.elements.form.add) {
              this.prompt();
            }
            if (e.target === this.elements.form.reset) {
              return this.reset();
            }
            break;
          case "keydown":
            return this.__keyDown(e);
          case "input":
            this.__input(e);
            return this.draw();
          case "resize":
            this.__resize(e);
            return this.draw();
          case "submit":
            e.preventDefault();
            return false;
        }
      }
    }, {
      key: "__keyDown",
      value: function __keyDown(e) {
        var i, inactive;
        i = this.getIndex();
        switch (e.keyCode) {
          case 37:
            if (e.target === document.body) {
              if (this.grids[i].columns > 0) {
                this.grids[i].columns--;
              }
              return this.select(i);
            }
            break;
          case 39:
            if (e.target === document.body) {
              this.grids[i].columns++;
              return this.select(i);
            }
            break;
          case 85:
            return this.elements.form.classList.toggle("disable");
          case 71:
            inactive = this.elements.canvas.classList.contains("disable");
            this.elements.canvas.classList.toggle("disable");
            if (!inactive) {
              return this.elements.form.classList.add("disable");
            }
        }
      }
    }, {
      key: "__input",
      value: function __input(e) {
        var i, k, key, len, ref, transform;
        if (!e.target.value) {
          return;
        }
        i = this.getIndex();
        if (e.target === this.elements.form.select) {
          return this.select(i);
        } else if (e.target === this.elements.form.responsive) {
          return this.__resize(true);
        } else {
          ref = this.keys;
          for (k = 0, len = ref.length; k < len; k++) {
            key = ref[k];
            transform = function () {
              switch (this.elements.form[key].type) {
                case "number":
                  return function (el) {
                    return parseInt(el.value, 10);
                  };
                case "checkbox":
                  return function (el) {
                    return el.checked;
                  };
                default:
                  return function (el) {
                    return el.value;
                  };
              }
            }.call(this);
            this.grids[i][key] = transform(this.elements.form[key]);
          }
          return this.save();
        }
      }
    }, {
      key: "__resize",
      value: function __resize(e) {
        var active, gutter, height, i, size, width;
        width = document.body.offsetWidth;
        height = document.body.offsetHeight;
        this.el.style.height = height + "px";
        this.elements.canvas.width = width * pixelDensity;
        this.elements.canvas.height = height * pixelDensity;
        i = e && this.elements.form.responsive.checked ? function () {
          var k, len, ref, results;
          ref = this.grids;
          results = [];
          for (i = k = 0, len = ref.length; k < len; i = ++k) {
            var _ref$i = ref[i];
            size = _ref$i.size;
            gutter = _ref$i.gutter;

            if (size + gutter < width) {
              results.push(i);
            }
          }
          return results;
        }.call(this)[0] : function () {
          var k, len, ref, results;
          ref = this.grids;
          results = [];
          for (i = k = 0, len = ref.length; k < len; i = ++k) {
            active = ref[i].active;

            if (active) {
              results.push(i);
            }
          }
          return results;
        }.call(this)[0];
        return this.select(i || 0);
      }
    }, {
      key: "select",
      value: function select(i) {
        var grid, j, k, key, l, len, len1, ref, ref1, transform;
        this.elements.form.select.value = i;
        ref = this.keys;
        for (k = 0, len = ref.length; k < len; k++) {
          key = ref[k];
          transform = function () {
            switch (this.elements.form[key].type) {
              case "checkbox":
                return function (el, val) {
                  return el.checked = val;
                };
              default:
                return function (el, val) {
                  return el.value = val || 0;
                };
            }
          }.call(this);
          transform(this.elements.form[key], this.grids[i][key]);
        }
        ref1 = this.grids;
        for (j = l = 0, len1 = ref1.length; l < len1; j = ++l) {
          grid = ref1[j];
          grid.active = i === j;
        }
        this.save();
        return this.draw();
      }
    }, {
      key: "prompt",
      value: function prompt() {
        var i, name, text;
        i = this.grids.length;
        text = "Enter a name for your new grid";
        name = window.prompt(text, "Grid #" + (i + 1));
        if (name) {
          this.add({
            name: name,
            columns: 12,
            size: 1200,
            gutter: 20,
            baseline: 18,
            color: "lightcoral",
            constrain: true
          });
          return this.select(i);
        }
      }
    }, {
      key: "add",
      value: function add(options) {
        var i;
        i = this.grids.length;
        this.elements.form.select.innerHTML += "<option value='" + i + "'>" + options.name + "</option>";
        this.grids.push(options);
        this.elements.form.remove.removeAttribute("disabled");
        return this.save();
      }
    }, {
      key: "remove",
      value: function remove(name) {
        var child, g, i, k, len, ref;
        if (this.grids.length === 1) {
          return;
        }
        i = function () {
          var k, len, ref, results;
          ref = this.grids;
          results = [];
          for (i = k = 0, len = ref.length; k < len; i = ++k) {
            g = ref[i];
            if (g.name === name) {
              results.push(i);
            }
          }
          return results;
        }.call(this)[0] || this.getIndex();
        this.elements.form.select.children[i].remove();
        this.grids.splice(i, 1);
        ref = this.elements.form.select.children;
        for (i = k = 0, len = ref.length; k < len; i = ++k) {
          child = ref[i];
          child.value = i;
        }
        if (this.grids.length === 1) {
          this.elements.form.remove.setAttribute("disabled", "disabled");
        }
        return this.save();
      }
    }, {
      key: "draw",
      value: function draw() {
        var data, height, width;
        var _elements$canvas = this.elements.canvas;
        width = _elements$canvas.width;
        height = _elements$canvas.height;

        data = Object.assign({}, this.grids[this.getIndex()]);
        if (data.size == null) {
          data.size = 0;
        }
        if (data.gutter == null) {
          data.gutter = 0;
        }
        if (data.offset == null) {
          data.offset = 0;
        }
        if (data.constrain == null) {
          data.constrain = false;
        }
        data.gutter *= pixelDensity;
        data.size *= pixelDensity;
        data.baseline *= pixelDensity;
        data.grid *= pixelDensity;
        if (data.size < 1) {
          data.size = width - data.gutter;
        }
        data.x = (width - data.size) / 2;
        data.colWidth = (data.size + data.gutter) / data.columns - data.gutter;
        this.elements.form.column.value = data.columns > 0 ? ((data.colWidth - data.gutter) / pixelDensity).toFixed(2) : "None";
        this.context.strokeStyle = data.color;
        this.context.fillStyle = data.color;
        this.context.lineWidth = 1;
        this.context.clearRect(0, 0, width, height);
        this.__drawColumns(data, width, height);
        this.__drawBaseline(data, width, height);
        return this.__drawGrid(data, width, height);
      }
    }, {
      key: "__drawColumns",
      value: function __drawColumns(data, width, height) {
        var i, k, l, ref, ref1;
        if (data.columns === 0) {
          return;
        }
        this.context.beginPath();
        if (data.gutter === 0) {
          for (i = k = 0, ref = data.columns; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
            if (i > 0) {
              this.context.moveTo(data.x + i * data.colWidth, 0);
              this.context.lineTo(data.x + i * data.colWidth, height);
            }
            if (i < data.columns) {
              this.context.moveTo(data.x + i * (data.colWidth + data.gutter), 0);
              this.context.lineTo(data.x + i * (data.colWidth + data.gutter), height);
            }
          }
          this.context.globalAlpha = 1;
          return this.context.stroke();
        } else {
          for (i = l = 0, ref1 = data.columns; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
            this.context.rect(data.x + i * (data.colWidth + data.gutter), 0, data.colWidth, height);
          }
          this.context.globalAlpha = 0.12;
          return this.context.fill();
        }
      }
    }, {
      key: "__drawBaseline",
      value: function __drawBaseline(data, width, height) {
        var i, k, ref, rows;
        if (data.baseline === 0) {
          return;
        }
        rows = Math.floor((height - data.offset) / data.baseline);
        this.context.beginPath();
        for (i = k = 0, ref = rows; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
          this.context.moveTo(data.x, i * data.baseline + data.offset);
          this.context.lineTo(width - data.x, i * data.baseline + data.offset);
        }
        this.context.closePath();
        this.context.globalAlpha = 1;
        this.context.stroke();
        return this.context.beginPath();
      }
    }, {
      key: "__drawGrid",
      value: function __drawGrid(data, width, height) {
        var cols, grid, i, k, l, m, n, ref, ref1, ref2, ref3, rows, size, xOff, y;
        if (data.grid === 0) {
          return;
        }
        size = data.size;
        if (!data.constrain) {
          data.x = 0;
          size = width;
        }
        if (data.gridOffset) {
          y = data.gridOffset * pixelDensity;
        } else {
          y = 0;
        }
        rows = Math.floor((height - y * 2) / data.grid);
        cols = Math.floor(size / data.grid);
        switch (data.gridOrigin) {
          case "Right":
            xOff = size - cols * data.grid;
            break;
          case "Middle":
            xOff = (size - (cols - 1) * data.grid) / 2;
            cols -= 1;
            break;
          default:
            xOff = 0;
        }
        this.context.beginPath();
        for (i = k = 0, ref = rows; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
          this.context.moveTo(data.x, y + i * data.grid);
          this.context.lineTo(width - data.x, y + i * data.grid);
        }
        for (i = l = 0, ref1 = cols; 0 <= ref1 ? l <= ref1 : l >= ref1; i = 0 <= ref1 ? ++l : --l) {
          this.context.moveTo(xOff + data.x + i * data.grid, y);
          this.context.lineTo(xOff + data.x + i * data.grid, height - y);
        }
        if (data.divisions > 0) {
          grid = data.grid / data.divisions;
          xOff = xOff % grid;
          rows = Math.floor((height - y * 2) / grid);
          cols = Math.floor((size - xOff) / grid);
          for (i = m = 0, ref2 = rows; 0 <= ref2 ? m <= ref2 : m >= ref2; i = 0 <= ref2 ? ++m : --m) {
            this.context.moveTo(data.x, y + i * grid);
            this.context.lineTo(width - data.x, y + i * grid);
          }
          for (i = n = 0, ref3 = cols; 0 <= ref3 ? n <= ref3 : n >= ref3; i = 0 <= ref3 ? ++n : --n) {
            this.context.moveTo(xOff + data.x + i * grid, y);
            this.context.lineTo(xOff + data.x + i * grid, height - y);
          }
        }
        this.context.globalAlpha = 0.33;
        return this.context.stroke();
      }
    }, {
      key: "show",
      value: function show() {
        this.elements.form.classList.remove("disable");
        return this.elements.canvas.classList.remove("disable");
      }
    }, {
      key: "hide",
      value: function hide() {
        this.elements.form.classList.add("disable");
        return this.elements.canvas.classList.add("disable");
      }
    }, {
      key: "save",
      value: function save() {
        return localStorage.setItem(storageKey, JSON.stringify(this.grids));
      }
    }, {
      key: "load",
      value: function load() {
        var grid, grids, k, len;
        this.grids = [];
        grids = function () {
          try {
            return JSON.parse(localStorage.getItem(storageKey));
          } catch (error) {}
        }() || this.defaults;
        for (k = 0, len = grids.length; k < len; k++) {
          grid = grids[k];
          this.add(grid);
        }
        return this.__resize();
      }
    }, {
      key: "reset",
      value: function reset() {
        localStorage.removeItem(storageKey);
        this.elements.form.select.innerHTML = "";
        return this.load();
      }
    }]);

    return Grid;
  }();
  return window.Grid = Grid;
})(window, document, Math);"use strict";

(function () {
  return Grid.prototype.template = function (id) {
    return "<style> #" + id + ", #" + id + " canvas, #" + id + " form { position: absolute; top: 0; left: 0; width: 100%; height: 100%; } #" + id + " { z-index: 5000; pointer-events: none; font-size: 11px; line-height: 16px; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; } #" + id + " form, #" + id + " form * { all: unset; box-sizing: border-box; } #" + id + " form, #" + id + " label, #" + id + " footer { display: block; padding: 0; margin: 0; color: #ccc; } #" + id + " form { width: 160px; height: auto; margin: 10px; position: fixed; pointer-events: all; } #" + id + " fieldset { border: 0; padding: 0; margin: 0; background: rgba(0,0,0,0.88); background-clip: padding-box; display: block; } #" + id + " fieldset + fieldset { border-top: 1px solid rgba(0,0,0,0.5); } #" + id + " fieldset:first-child { border-radius: 2px 2px 0 0; } #" + id + " fieldset:last-child { border-radius: 0 0 2px 2px; } #" + id + " label { clear: both; margin-bottom: 0; cursor: pointer; font-weight: bold; padding: 1px 0; height: 22px; } #" + id + " .legend { font-weight: bold; width: 100%; margin: 0; border: none; padding: 4px 6px 2px; display: block; color: #fff; } #" + id + " label span { display: inline-block; min-width: 100px; position: relative; z-index: 1; padding-left: 6px; } #" + id + " label em { font-style: normal; font-family: monospace; color: #888; } #" + id + " input, #" + id + " select { color: inherit; } #" + id + " output { cursor: not-allowed; color: #888; } #" + id + " input[type=\"number\"], #" + id + " output { display: inline-block; background: transparent; margin: 0; border: none; font: inherit; box-sizing: border-box; font-family: monospace; width: 100%; text-align: right; padding-left: 88px; margin-left: -103px; padding-right: 20px; margin-right: -20px; -webkit-appearance: none; } #" + id + " input[type=\"checkbox\"] { float: right; margin-right: 20px; width: 16px; height: 16px; -webkit-appearance: checkbox; -moz-appearance: checkbox; } #" + id + " select { border: none; background: transparent; margin: 0; padding: 0 6px; background: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='#ffffff80'><polygon points='0,0 100,0 50,50'/></svg>\") no-repeat; background-size: 8px; background-position: calc(100% - 4px) 6px; background-repeat: no-repeat; } #" + id + " select[name=\"select\"] { width: 100px; } #" + id + " select[name=\"gridOrigin\"], #" + id + " select[name=\"color\"] { width: 64px; margin-left: -10px; z-index: 1; position: relative; } #" + id + " input[type=\"button\"] { border: none; background: transparent; margin-left: 3px; display: inline-block; border-radius: 3px; padding: 0 8px; height: 20px; text-align: center; font-weight: bold; } #" + id + " input::-webkit-inner-spin-button, #" + id + " input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; } #" + id + " label:hover, #" + id + " input:hover { color: #eee; } #" + id + " input:focus, #" + id + " select:focus { outline: none; color: #fff; background-color: #444; } #" + id + " strong { color: #fff; } #" + id + " .disable { display: none; } #" + id + " footer { padding: 2px 6px 4px; background: transparent; } </style> <canvas></canvas> <form> <fieldset> <label> <select name=\"select\"></select> <input title=\"Add grid\" type=\"button\" name=\"add\" value=\"+\" /> <input title=\"Delete grid\" type=\"button\" name=\"remove\" value=\"\u2013\" /> </label> <label> <span>Color</span> <select name=\"color\"> <option value=\"black\">Black</option> <option value=\"white\">White</option> <option value=\"coral\">Orange</option> <option value=\"crimson\">Red</option> <option value=\"chartreuse\">Green</option> <option value=\"deeppink\">Pink</option> <option value=\"aquamarine\">Cyan</option> <option value=\"dodgerblue\">Blue</option> <option value=\"lightcoral\">Peach</option> <option value=\"rebeccapurple\">Purple</option> </select> </label> <label title=\"Automatically choose the right grid for your viewport\"> <span>Responsive</span> <input name=\"responsive\" type=\"checkbox\" checked> </label> </fieldset> <fieldset> <span class=\"legend\">Columns</span> <label title=\"The number of columns\"> <span>Columns</span> <input name=\"columns\" type=\"number\" min=\"0\" max=\"30\" /> </label> <label title=\"The total width of the grid without outer gutters. Set a value of 0 for full-width containers. \"> <span>Container Width</span> <input name=\"size\" type=\"number\" min=\"0\" /> <em>px</em> </label> <label title=\"The margin between each column\"> <span>Gutter</span> <input name=\"gutter\" type=\"number\" min=\"0\" /> <em>px</em> </label> <label title=\"The ideal line-height on which content should align\"> <span>Baseline Grid</span> <input name=\"baseline\" type=\"number\" min=\"0\" /> <em>px</em> </label> <label title=\"The vertical offset for the baseline grid\"> <span>Baseline Offset</span> <input name=\"offset\" type=\"number\" min=\"0\" /> <em>px</em> </label> <label title=\"The computed column width\"> <span>Column Width</span> <output name=\"column\" type=\"number\"></output> <em>px</em> </label> </fieldset> <fieldset> <span class=\"legend\">Document Grid</span> <label title=\"Create an additional grid\"> <span>Size</span> <input name=\"grid\" type=\"number\" min=\"0\" /> <em>px</em> </label> <label title=\"Create subdivisions within the document grid\"> <span>Divisions</span> <input name=\"divisions\" type=\"number\" min=\"0\" /> </label> <label title=\"Constrain the grid to the container width\"> <span>Constrain</span> <input name=\"constrain\" type=\"checkbox\" /> </label> <label title=\"Inset the grid from the top of the page\"> <span>Vertical Offset</span> <input name=\"gridOffset\" type=\"number\" /> <em>px</em> </label> <label title=\"Start the grid from the left, middle or right\"> <span>Origin</span> <select name=\"gridOrigin\"> <option selected>Left</option> <option>Middle</option> <option>Right</option> </select> </label> </fieldset> <fieldset> <footer> Toggle <strong>U</strong>I / <strong>G</strong>rid <input title=\"Reset all grids to defaults\" name=\"reset\" value=\"Reset\" type=\"button\"> </footer> </fieldset> <form>";
  };
})();"use strict";

(function () {
  return Grid.prototype.defaults = [{
    name: "Bootstrap LG",
    columns: 12,
    size: 1140,
    gutter: 30,
    baseline: 20,
    active: true,
    color: "dodgerblue"
  }, {
    name: "Bootstrap MD",
    columns: 12,
    size: 940,
    gutter: 30,
    baseline: 20,
    color: "chartreuse"
  }, {
    name: "Bootstrap SM",
    columns: 12,
    size: 720,
    gutter: 30,
    baseline: 20,
    color: "rebeccapurple"
  }, {
    name: "Bootstrap XS",
    columns: 12,
    gutter: 30,
    baseline: 20,
    size: 0,
    color: "lightcoral"
  }, {
    name: "960 (12 Columns)",
    columns: 12,
    size: 940,
    gutter: 20,
    color: "purple"
  }, {
    name: "960 (16 Columns)",
    columns: 16,
    size: 940,
    gutter: 20,
    color: "purple"
  }, {
    name: "Grid (32px)",
    grid: 32,
    size: 1024,
    divisions: 8,
    constrain: true,
    color: "deeppink"
  }, {
    name: "3-way Split",
    columns: 3,
    color: "deeppink"
  }];
})();