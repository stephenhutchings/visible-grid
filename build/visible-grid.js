/* visible-grid - v0.0.1 - MIT */
/* Design and develop with a visible grid */
/* https://github.com/stephenhutchings/visible-grid.git */
(function(window, document, Math) {
  var Grid, pixelDensity, storageKey;
  pixelDensity = window.devicePixelRatio || 1;
  storageKey = "visible-grid";
  Grid = (function() {
    function Grid() {
      var id;
      this.el = document.createElement("div");
      id = "grid-" + (Math.random().toFixed(8).split(".")[1]);
      this.el.setAttribute("id", id);
      this.el.innerHTML = this.template(id);
      this.elements = {
        canvas: this.el.querySelector("canvas"),
        form: this.el.querySelector("form")
      };
      this.context = this.elements.canvas.getContext("2d");
      document.body.appendChild(this.el, "beforeEnd");
      this.load();
      this.bindEvents();
      this.__resize();
    }

    Grid.prototype.getIndex = function() {
      return +this.elements.form.select.value;
    };

    Grid.prototype.bindEvents = function() {
      this.el.addEventListener("input", this, false);
      this.el.addEventListener("click", this, false);
      this.el.addEventListener("submit", this, false);
      window.addEventListener("keydown", this, false);
      return window.addEventListener("resize", this, false);
    };

    Grid.prototype.handleEvent = function(e) {
      var i;
      switch (e.type) {
        case "click":
          if (e.target === this.elements.form.remove) {
            this.remove();
          }
          if (e.target === this.elements.form.add) {
            this.prompt();
          }
          if (e.target === this.elements.form.constrain) {
            i = this.getIndex();
            this.grids[i].constrain = e.target.checked;
            return this.select(i);
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
    };

    Grid.prototype.__keyDown = function(e) {
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
    };

    Grid.prototype.__input = function(e) {
      var i;
      if (!e.target.value) {
        return;
      }
      i = this.getIndex();
      switch (e.target) {
        case this.elements.form.select:
          this.select(i);
          break;
        case this.elements.form.color:
          this.grids[i].color = e.target.value;
          break;
        default:
          this.grids[i][e.target.name] = Math.max(+e.target.value, 0);
      }
      return this.save();
    };

    Grid.prototype.__resize = function(e) {
      var active, height, i, size, width;
      width = document.body.offsetWidth;
      height = document.body.offsetHeight;
      this.el.style.height = height + "px";
      this.elements.canvas.width = width * pixelDensity;
      this.elements.canvas.height = height * pixelDensity;
      i = e ? ((function() {
        var _i, _len, _ref, _results;
        _ref = this.grids;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          size = _ref[i].size;
          if (size < width) {
            _results.push(i);
          }
        }
        return _results;
      }).call(this))[0] : ((function() {
        var _i, _len, _ref, _results;
        _ref = this.grids;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          active = _ref[i].active;
          if (active) {
            _results.push(i);
          }
        }
        return _results;
      }).call(this))[0];
      return this.select(i || 0);
    };

    Grid.prototype.select = function(i) {
      var grid, j, key, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      this.elements.form.select.value = i;
      this.elements.form.constrain.checked = this.grids[i].constrain;
      _ref = ["columns", "size", "gutter", "baseline", "color", "grid", "divisions", "offset"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if ((_ref1 = this.elements.form[key]) != null) {
          _ref1.value = this.grids[i][key] || 0;
        }
      }
      _ref2 = this.grids;
      for (j = _j = 0, _len1 = _ref2.length; _j < _len1; j = ++_j) {
        grid = _ref2[j];
        grid.active = i === j;
      }
      return this.draw();
    };

    Grid.prototype.prompt = function() {
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
    };

    Grid.prototype.add = function(options) {
      var i;
      i = this.grids.length;
      this.elements.form.select.innerHTML += "<option value='" + i + "'>" + options.name + "</option>";
      this.grids.push(options);
      this.elements.form.remove.removeAttribute("disabled");
      return this.save();
    };

    Grid.prototype.remove = function(name) {
      var child, g, i, _i, _len, _ref;
      if (this.grids.length === 1) {
        return;
      }
      i = ((function() {
        var _i, _len, _ref, _results;
        _ref = this.grids;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          g = _ref[i];
          if (g.name === name) {
            _results.push(i);
          }
        }
        return _results;
      }).call(this))[0] || this.getIndex();
      this.elements.form.select.children[i].remove();
      this.grids.splice(i, 1);
      _ref = this.elements.form.select.children;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        child = _ref[i];
        child.value = i;
      }
      if (this.grids.length === 1) {
        this.elements.form.remove.setAttribute("disabled", "disabled");
      }
      return this.save();
    };

    Grid.prototype.draw = function() {
      var baseline, col, color, cols, columns, constrain, divisions, grid, gutter, height, i, offset, rows, size, width, x, _i, _j, _k, _l, _m, _n, _ref, _ref1;
      _ref = this.elements.canvas, width = _ref.width, height = _ref.height;
      _ref1 = this.grids[this.getIndex()], gutter = _ref1.gutter, columns = _ref1.columns, size = _ref1.size, color = _ref1.color, baseline = _ref1.baseline, offset = _ref1.offset, grid = _ref1.grid, divisions = _ref1.divisions, constrain = _ref1.constrain;
      if (size == null) {
        size = 0;
      }
      if (gutter == null) {
        gutter = 0;
      }
      gutter *= pixelDensity;
      size *= pixelDensity;
      baseline *= pixelDensity;
      grid *= pixelDensity;
      divisions *= pixelDensity;
      if (size < 1) {
        size = width - gutter;
      }
      x = (width - size) / 2;
      col = (size + gutter) / columns;
      this.elements.form.column.value = (col / pixelDensity).toFixed(2);
      this.context.strokeStyle = color;
      this.context.lineWidth = 1;
      this.context.globalAlpha = 1;
      this.context.clearRect(0, 0, width, height);
      this.context.beginPath();
      if (columns > 0) {
        for (i = _i = 0; 0 <= columns ? _i <= columns : _i >= columns; i = 0 <= columns ? ++_i : --_i) {
          if (i > 0) {
            this.context.moveTo(x + i * col - gutter, 0);
            this.context.lineTo(x + i * col - gutter, height);
          }
          if (i < columns) {
            this.context.moveTo(x + i * col, 0);
            this.context.lineTo(x + i * col, height);
          }
        }
      }
      if (baseline > 0) {
        if (offset == null) {
          offset = 0;
        }
        rows = Math.floor((height - offset) / baseline);
        for (i = _j = 0; 0 <= rows ? _j <= rows : _j >= rows; i = 0 <= rows ? ++_j : --_j) {
          this.context.moveTo(x, i * baseline + offset);
          this.context.lineTo(width - x, i * baseline + offset);
        }
      }
      this.context.closePath();
      this.context.stroke();
      this.context.globalAlpha = 0.33;
      this.context.beginPath();
      if (grid > 0) {
        if (!constrain) {
          x = 0;
          size = width;
        }
        rows = Math.floor(height / grid);
        cols = Math.floor(size / grid);
        for (i = _k = 0; 0 <= rows ? _k <= rows : _k >= rows; i = 0 <= rows ? ++_k : --_k) {
          this.context.moveTo(x, i * grid);
          this.context.lineTo(width - x, i * grid);
        }
        for (i = _l = 0; 0 <= cols ? _l <= cols : _l >= cols; i = 0 <= cols ? ++_l : --_l) {
          this.context.moveTo(x + i * grid, 0);
          this.context.lineTo(x + i * grid, height);
        }
        if (divisions > 0) {
          grid = grid / divisions;
          rows = Math.floor(height / grid);
          cols = Math.floor(size / grid);
          for (i = _m = 0; 0 <= rows ? _m <= rows : _m >= rows; i = 0 <= rows ? ++_m : --_m) {
            this.context.moveTo(x, i * grid);
            this.context.lineTo(width - x, i * grid);
          }
          for (i = _n = 0; 0 <= cols ? _n <= cols : _n >= cols; i = 0 <= cols ? ++_n : --_n) {
            this.context.moveTo(x + i * grid, 0);
            this.context.lineTo(x + i * grid, height);
          }
        }
      }
      this.context.closePath();
      return this.context.stroke();
    };

    Grid.prototype.show = function() {
      this.elements.form.classList.remove("disable");
      return this.elements.canvas.classList.remove("disable");
    };

    Grid.prototype.hide = function() {
      this.elements.form.classList.add("disable");
      return this.elements.canvas.classList.add("disable");
    };

    Grid.prototype.save = function() {
      return localStorage.setItem(storageKey, JSON.stringify(this.grids));
    };

    Grid.prototype.load = function() {
      var grid, grids, _i, _len, _results;
      this.grids = [];
      grids = ((function() {
        try {
          return JSON.parse(localStorage.getItem(storageKey));
        } catch (_error) {}
      })()) || this.defaults;
      _results = [];
      for (_i = 0, _len = grids.length; _i < _len; _i++) {
        grid = grids[_i];
        _results.push(this.add(grid));
      }
      return _results;
    };

    Grid.prototype.reset = function() {
      localStorage.removeItem(storageKey);
      this.grids = [].concat(this.defaults);
      return this.save();
    };

    return Grid;

  })();
  return window.Grid = Grid;
})(window, document, Math);
(function() {
  return Grid.prototype.template = function(id) {
    return "<style> #" + id + ", #" + id + " canvas, #" + id + " form { position: absolute; top: 0; left: 0; width: 100%; height: 100%; } #" + id + " { z-index: 5000; pointer-events: none; font-size: 11px; line-height: 16px; font-family: sans-serif; } #" + id + " form, #" + id + " label, #" + id + " footer { display: block; background: #333; padding: 0; margin: 0; color: #ccc; } #" + id + " form { width: 160px; height: auto; margin: 10px; position: fixed; pointer-events: all; } #" + id + " label { clear: both; margin-bottom: 0; border-top: 1px solid #444; border-bottom: 1px solid #222; cursor: pointer; font-weight: bold; } #" + id + " label span { display: inline-block; width: 100px; position: relative; z-index: 1; padding: 4px 0 4px 12px; } #" + id + " label em { font-style: normal; font-family: monospace; color: #888; } #" + id + " input, #" + id + " select { color: inherit; } #" + id + " output { cursor: not-allowed; } #" + id + " input[type=\"number\"], #" + id + " output { display: inline-block; background: transparent; margin: 0; border: none; font: inherit; box-sizing: border-box; padding: 4px; font-family: monospace; width: 100%; text-align: right; padding-left: 88px; margin-left: -103px; padding-right: 20px; margin-right: -20px; -webkit-appearance: none; } #" + id + " input[type=\"checkbox\"] { float: right; margin-right: 20px; } #" + id + " select { border: none; background: transparent; margin: 4px; } #" + id + " select[name=\"select\"] { width: 100px; } #" + id + " select[name=\"color\"] { width: 72px; margin-left: -21px; } #" + id + " input[type=\"button\"] { width: 20px; border: none; background: transparent; margin-left: 3px; display: inline-block; border-radius: 3px; padding: 0 4px; height: 20px; margin: 4px 0; text-align: center; } #" + id + " input::-webkit-inner-spin-button, #" + id + " input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; } #" + id + " label:hover, #" + id + " input:hover { color: #eee; } #" + id + " input:focus, #" + id + " select:focus { outline: none; color: #fff; background-color: #444; } #" + id + " footer { padding: 4px 12px; } #" + id + " footer strong { color: #fff; } #" + id + " .disable { display: none; } </style> <canvas></canvas> <form> <label> <select name=\"select\"></select> <input title=\"Add grid\" type=\"button\" name=\"add\" value=\"+\" /> <input title=\"Delete grid\" type=\"button\" name=\"remove\" value=\"–\" /> </label> <label> <span>Color</span> <select name=\"color\"> <option value=\"black\">Black</option> <option value=\"white\">White</option> <option value=\"coral\">Orange</option> <option value=\"crimson\">Red</option> <option value=\"chartreuse\">Green</option> <option value=\"deeppink\">Pink</option> <option value=\"aquamarine\">Cyan</option> <option value=\"dodgerblue\">Blue</option> <option value=\"lightcoral\">Peach</option> <option value=\"rebeccapurple\">Purple</option> </select> </label> <label title=\"The number of columns\"> <span>Columns</span> <input name=\"columns\" type=\"number\" min=\"1\" max=\"30\" /> </label> <label title=\"The total width of the grid without outer gutters. Set a value of 0 for full-width containers. \"> <span>Container Width</span> <input name=\"size\" type=\"number\" min=\"0\" /> <em>px</em> </label> <label title=\"The margin between each column\"> <span>Gutter</span> <input name=\"gutter\" type=\"number\" min=\"0\" /> <em>px</em> </label> <label title=\"The ideal line-height on which content should align\"> <span>Baseline Grid</span> <input name=\"baseline\" type=\"number\" min=\"0\" /> <em>px</em> </label> <label title=\"The vertical offset for the baseline grid\"> <span>Baseline Offset</span> <input name=\"offset\" type=\"number\" min=\"0\" /> <em>px</em> </label> <label title=\"Create an additional grid\"> <span>Document Grid</span> <input name=\"grid\" type=\"number\" min=\"0\" /> <em>px</em> </label> <label title=\"Create subdivisions within the document grid\"> <span>Grid Divisions</span> <input name=\"divisions\" type=\"number\" min=\"0\" /> <em>px</em> </label> <label title=\"Constrain the grid to the container width\"> <span>Constrain Grid</span> <input name=\"constrain\" type=\"checkbox\" /> </label> <label title=\"The computed column width\"> <span>Column Width</span> <output name=\"column\" type=\"number\"></output> <em>px</em> </label> <footer> Toggle <strong>u</strong>ser interface / <strong>g</strong>rid </footer> <form>";
  };
})();
(function() {
  return Grid.prototype.defaults = [
    {
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
    }
  ];
})();
