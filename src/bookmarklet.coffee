((window, document) ->
  if window.Grid
    new Grid()

  else if not document.getElementById("visible-grid-js")

    script = document.createElement("script")
    script.id   = "visible-grid-js"
    script.type = "text/javascript"
    script.src  = "http://s-ings.com/experiments/visible-grid/visible-grid.min.js"

    document.getElementsByTagName("body")[0].appendChild(script)

    script.onreadystatechange =
    script.onload = (evt) ->
      window.myGrid = new Grid() unless window.myGrid

    return
)(window, document)
