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

      @context = @elements.canvas.getContext("2d")

      document.body.appendChild @el, "beforeEnd"

      @load()
      @bindEvents()
      @__resize()

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
          if e.target is @elements.form.constrain
            i = @getIndex()
            @grids[i].constrain = e.target.checked
            @select(i)
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

      switch e.target
        when @elements.form.select
          @select(i)
        when @elements.form.color
          @grids[i].color = e.target.value
        else
          @grids[i][e.target.name] = Math.max(+e.target.value, 0)

      @save()

    __resize: (e) ->
      width  = document.body.offsetWidth
      height = document.body.offsetHeight

      @el.style.height = height + "px"
      @elements.canvas.width = width * pixelDensity
      @elements.canvas.height = height * pixelDensity

      i =
        if e
          (i for { size }, i in @grids when size < width)[0]
        else
          (i for { active }, i in @grids when active)[0]

      @select(i or 0)

    select: (i) ->
      @elements.form.select.value = i
      @elements.form.constrain.checked = @grids[i].constrain

      for key in ["columns", "size", "gutter", "baseline", "color", "grid", "divisions", "offset"]
        @elements.form[key]?.value = @grids[i][key] or 0

      grid.active = i is j for grid, j in @grids

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

      { gutter, columns, size, color, baseline,
        offset, grid, divisions, constrain } = @grids[@getIndex()]

      size   ?= 0
      gutter ?= 0

      gutter    *= pixelDensity
      size      *= pixelDensity
      baseline  *= pixelDensity
      grid      *= pixelDensity

      size      = width - gutter if size < 1
      x         = (width - size) / 2
      col       = (size + gutter) / columns

      @elements.form.column.value = ((col - gutter) / pixelDensity).toFixed(2)

      @context.strokeStyle = color
      @context.lineWidth   = 1

      @context.globalAlpha = 1
      @context.clearRect(0, 0, width, height)
      @context.beginPath()

      if columns > 0
        for i in [0..columns]
          if i > 0
            @context.moveTo(x + i * col - gutter, 0)
            @context.lineTo(x + i * col - gutter, height)
          if i < columns
            @context.moveTo(x + i * col, 0)
            @context.lineTo(x + i * col, height)

      if baseline > 0
        offset ?= 0
        rows = Math.floor((height - offset) / baseline)

        for i in [0..rows]
          @context.moveTo(x, i * baseline + offset)
          @context.lineTo(width - x, i * baseline + offset)

      @context.closePath()
      @context.stroke()

      @context.globalAlpha = 0.33
      @context.beginPath()

      if grid > 0

        unless constrain
          x    = 0
          size = width

        rows = Math.floor(height / grid)
        cols = Math.floor(size / grid)

        for i in [0..rows]
          @context.moveTo(x, i * grid)
          @context.lineTo(width - x, i * grid)

        for i in [0..cols]
          @context.moveTo(x + i * grid, 0)
          @context.lineTo(x + i * grid, height)

        if divisions > 0

          grid = grid / divisions
          rows = Math.floor(height / grid)
          cols = Math.floor(size / grid)

          for i in [0..rows]
            @context.moveTo(x, i * grid)
            @context.lineTo(width - x, i * grid)

          for i in [0..cols]
            @context.moveTo(x + i * grid, 0)
            @context.lineTo(x + i * grid, height)

      @context.closePath()
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

    reset: ->
      localStorage.removeItem storageKey
      @grids = [].concat @defaults
      @save()

  window.Grid = Grid

)(window, document, Math)
