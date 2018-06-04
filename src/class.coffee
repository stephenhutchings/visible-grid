((window, document, Math) ->

  pixelDensity = window.devicePixelRatio or 1
  storageKey   = "visible-grid"

  class Grid
    constructor: ->
      @el = document.createElement("div")

      id  = "grid-#{Math.random().toFixed(8).split(".")[1]}"

      @el.setAttribute("id", id)
      @el.innerHTML = @template(id)

      @elements =
        canvas:   @el.querySelector("canvas")
        form:     @el.querySelector("form")

      @keys = [
        "gutter", "columns", "size", "color", "baseline", "offset",
        "grid", "divisions", "constrain", "gridOffset", "gridOrigin"
      ]

      @context = @elements.canvas.getContext("2d")

      document.body.appendChild @el, "beforeEnd"

      @load()
      @bindEvents()

    getIndex: ->
      +@elements.form.select.value

    bindEvents: ->
      @el.addEventListener("input", this, false)
      @el.addEventListener("click", this, false)
      @el.addEventListener("submit", this, false)

      window.addEventListener("keydown", this, false)
      window.addEventListener("resize", this, false)

    handleEvent: (e) ->
      switch e.type
        when "click"
          if e.target is @elements.form.remove
            @remove()
          if e.target is @elements.form.add
            @prompt()
          if e.target is @elements.form.reset
            @reset()
        when "keydown"
          @__keyDown(e)
        when "input"
          @__input(e)
          @draw()
        when "resize"
          @__resize(e)
          @draw()
        when "submit"
          e.preventDefault()
          return false

    __keyDown: (e) ->
      i = @getIndex()

      switch e.keyCode
        when 37
          if e.target is document.body
            @grids[i].columns-- if @grids[i].columns > 0
            @select(i)
        when 39
          if e.target is document.body
            @grids[i].columns++
            @select(i)
        when 85
          @elements.form.classList.toggle("disable")
        when 71
          inactive = @elements.canvas.classList.contains "disable"
          @elements.canvas.classList.toggle("disable")
          @elements.form.classList.add("disable") unless inactive

    __input: (e) ->
      return unless e.target.value

      i = @getIndex()

      if e.target is @elements.form.select
        @select(i)
      else if e.target is @elements.form.responsive
        @__resize(true)
      else
        for key in @keys
          transform = switch @elements.form[key].type
            when "number" then (el) -> parseInt(el.value, 10)
            when "checkbox" then (el) -> el.checked
            else (el) -> el.value
          @grids[i][key] = transform @elements.form[key]

        @save()

    __resize: (e) ->
      width  = document.body.offsetWidth
      height = document.body.offsetHeight

      @el.style.height = height + "px"
      @elements.canvas.width = width * pixelDensity
      @elements.canvas.height = height * pixelDensity

      i =
        if e and @elements.form.responsive.checked
          (i for { size, gutter }, i in @grids when size + gutter < width)[0]
        else
          (i for { active }, i in @grids when active)[0]

      @select(i or 0)

    select: (i) ->
      @elements.form.select.value = i

      for key in @keys
        transform = switch @elements.form[key].type
          when "checkbox" then (el, val) -> el.checked = val
          else (el, val) -> el.value = val or 0

        transform @elements.form[key], @grids[i][key]

      grid.active = i is j for grid, j in @grids

      @save()
      @draw()

    prompt: ->
      i = @grids.length
      text = "Enter a name for your new grid"
      name = window.prompt text, "Grid ##{i + 1}"

      if name
        @add
          name:      name
          columns:   12
          size:      1200
          gutter:    20
          baseline:  18
          color:     "lightcoral"
          constrain: true

        @select(i)

    add: (options) ->
      i = @grids.length

      @elements.form.select.innerHTML +=
        "<option value='#{i}'>#{options.name}</option>"

      @grids.push options

      @elements.form.remove.removeAttribute("disabled")

      @save()

    remove: (name) ->
      return if @grids.length is 1

      i = (i for g, i in @grids when g.name is name)[0] or @getIndex()

      @elements.form.select.children[i].remove()
      @grids.splice(i, 1)

      for child, i in @elements.form.select.children
        child.value = i

      if @grids.length is 1
        @elements.form.remove.setAttribute("disabled", "disabled")

      @save()

    draw: ->
      { width, height } = @elements.canvas

      data = Object.assign({}, @grids[@getIndex()])

      data.size      ?= 0
      data.gutter    ?= 0
      data.offset    ?= 0
      data.constrain ?= false

      data.gutter    *= pixelDensity
      data.size      *= pixelDensity
      data.baseline  *= pixelDensity
      data.grid      *= pixelDensity

      data.size      = width - data.gutter if data.size < 1
      data.x         = (width - data.size) / 2
      data.colWidth  = (data.size + data.gutter) / data.columns - data.gutter

      @elements.form.column.value =
        if data.columns > 0
          ((data.colWidth - data.gutter) / pixelDensity).toFixed(2)
        else
          "None"

      @context.strokeStyle = data.color
      @context.fillStyle   = data.color
      @context.lineWidth   = 1

      @context.clearRect(0, 0, width, height)

      @__drawColumns(data, width, height)
      @__drawBaseline(data, width, height)
      @__drawGrid(data, width, height)

    __drawColumns: (data, width, height) ->
      return if data.columns is 0

      @context.beginPath()

      if data.gutter is 0
        for i in [0..data.columns]
          if i > 0
            @context.moveTo(data.x + i * data.colWidth, 0)
            @context.lineTo(data.x + i * data.colWidth, height)
          if i < data.columns
            @context.moveTo(data.x + i * (data.colWidth + data.gutter), 0)
            @context.lineTo(data.x + i * (data.colWidth + data.gutter), height)

        @context.globalAlpha = 1
        @context.stroke()

      else
        for i in [0...data.columns]
          @context.rect(
            data.x + i * (data.colWidth + data.gutter), 0, data.colWidth, height
          )

        @context.globalAlpha = 0.12
        @context.fill()

    __drawBaseline: (data, width, height) ->
      return if data.baseline is 0

      rows = Math.floor((height - data.offset) / data.baseline)

      @context.beginPath()

      for i in [0..rows]
        @context.moveTo(data.x, i * data.baseline + data.offset)
        @context.lineTo(width - data.x, i * data.baseline + data.offset)

      @context.closePath()
      @context.globalAlpha = 1
      @context.stroke()

      @context.beginPath()

    __drawGrid: (data, width, height) ->
      return if data.grid is 0

      size = data.size

      unless data.constrain
        data.x = 0
        size   = width

      if data.gridOffset
        y = data.gridOffset * pixelDensity
      else
        y = 0

      rows = Math.floor((height - y * 2) / data.grid)
      cols = Math.floor(size / data.grid)

      switch data.gridOrigin
        when "Right"
          xOff = (size - cols * data.grid)

        when "Middle"
          xOff = (size - (cols - 1) * data.grid) / 2
          cols -= 1

        else
          xOff = 0

      @context.beginPath()

      for i in [0..rows]
        @context.moveTo(data.x, y + i * data.grid)
        @context.lineTo(width - data.x, y + i * data.grid)

      for i in [0..cols]
        @context.moveTo(xOff + data.x + i * data.grid, y)
        @context.lineTo(xOff + data.x + i * data.grid, height - y)

      if data.divisions > 0
        grid = data.grid / data.divisions
        xOff = xOff % grid
        rows = Math.floor((height - y * 2) / grid)
        cols = Math.floor((size - xOff) / grid)

        for i in [0..rows]
          @context.moveTo(data.x, y + i * grid)
          @context.lineTo(width - data.x, y + i * grid)

        for i in [0..cols]
          @context.moveTo(xOff + data.x + i * grid, y)
          @context.lineTo(xOff + data.x + i * grid, height - y)

      @context.globalAlpha = 0.33
      @context.stroke()

    show: ->
      @elements.form.classList.remove("disable")
      @elements.canvas.classList.remove("disable")

    hide: ->
      @elements.form.classList.add("disable")
      @elements.canvas.classList.add("disable")

    save: ->
      localStorage.setItem storageKey, JSON.stringify(@grids)

    load: ->
      @grids = []
      grids = (try JSON.parse(localStorage.getItem storageKey)) or @defaults
      @add grid for grid in grids
      @__resize()

    reset: ->
      localStorage.removeItem storageKey
      @elements.form.select.innerHTML = ""
      @load()

  window.Grid = Grid

)(window, document, Math)
