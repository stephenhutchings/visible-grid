(function(window, document) {
  var script;
  if (window.Grid) {
    return new Grid();
  } else if (!document.getElementById("visible-grid-js")) {
    script = document.createElement("script");
    script.id = "visible-grid-js";
    script.type = "text/javascript";
    script.src = "http://s-ings.com/experiments/visible-grid/visible-grid.min.js";
    document.getElementsByTagName("body")[0].appendChild(script);
    script.onreadystatechange = script.onload = function(evt) {
      if (!window.myGrid) {
        return window.myGrid = new Grid();
      }
    };
  }
})(window, document);
