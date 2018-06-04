(->
  Grid.prototype.template = (id) ->
    "
      <style>
        ##{id},
        ##{id} canvas,
        ##{id} form {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        ##{id} {
          z-index: 5000;
          pointer-events: none;
          font-size: 11px;
          line-height: 16px;
          font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;
        }
        ##{id} form,
        ##{id} form * {
          all: unset;
          box-sizing: border-box;
        }
        ##{id} form,
        ##{id} label,
        ##{id} footer {
          display: block;
          padding: 0;
          margin: 0;
          color: #ccc;
        }
        ##{id} form {
          width: 160px;
          height: auto;
          margin: 10px;
          position: fixed;
          pointer-events: all;
        }
        ##{id} fieldset {
          border: 0;
          padding: 0;
          margin: 0;
          background: rgba(0,0,0,0.88);
          background-clip: padding-box;
          display: block;
        }
        ##{id} fieldset + fieldset {
          border-top: 1px solid rgba(0,0,0,0.5);
        }
        ##{id} fieldset:first-child {
          border-radius: 2px 2px 0 0;
        }
        ##{id} fieldset:last-child {
          border-radius: 0 0 2px 2px;
        }
        ##{id} label {
          clear: both;
          margin-bottom: 0;
          cursor: pointer;
          font-weight: bold;
          padding: 1px 0;
          height: 22px;
        }
        ##{id} .legend {
          font-weight: bold;
          width: 100%;
          margin: 0;
          border: none;
          padding: 4px 6px 2px;
          display: block;
          color: #fff;
        }
        ##{id} label span {
          display: inline-block;
          min-width: 100px;
          position: relative;
          z-index: 1;
          padding-left: 6px;
        }
        ##{id} label em {
          font-style: normal;
          font-family: monospace;
          color: #888;
        }
        ##{id} input,
        ##{id} select {
          color: inherit;
        }
        ##{id} output {
          cursor: not-allowed;
          color: #888;
        }
        ##{id} input[type=\"number\"],
        ##{id} output {
          display: inline-block;
          background: transparent;
          margin: 0;
          border: none;
          font: inherit;
          box-sizing: border-box;
          font-family: monospace;
          width: 100%;
          text-align: right;
          padding-left: 88px;
          margin-left: -103px;
          padding-right: 20px;
          margin-right: -20px;
          -webkit-appearance: none;
        }
        ##{id} input[type=\"checkbox\"] {
          float: right;
          margin-right: 20px;
          width: 16px;
          height: 16px;
          -webkit-appearance: checkbox;
          -moz-appearance: checkbox;
        }
        ##{id} select {
          border: none;
          background: transparent;
          margin: 0;
          padding: 0 6px;
          background: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='#ffffff80'><polygon points='0,0 100,0 50,50'/></svg>\") no-repeat;
          background-size: 8px;
          background-position: calc(100% - 4px) 6px;
          background-repeat: no-repeat;
        }
        ##{id} select[name=\"select\"] {
          width: 100px;
        }
        ##{id} select[name=\"gridOrigin\"],
        ##{id} select[name=\"color\"] {
          width: 64px;
          margin-left: -10px;
          z-index: 1;
          position: relative;
        }
        ##{id} input[type=\"button\"] {
          border: none;
          background: transparent;
          margin-left: 3px;
          display: inline-block;
          border-radius: 3px;
          padding: 0 8px;
          height: 20px;
          text-align: center;
          font-weight: bold;
        }
        ##{id} input::-webkit-inner-spin-button,
        ##{id} input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        ##{id} label:hover,
        ##{id} input:hover {
          color: #eee;
        }
        ##{id} input:focus,
        ##{id} select:focus {
          outline: none;
          color: #fff;
          background-color: #444;
        }
        ##{id} strong {
          color: #fff;
        }
        ##{id} .disable {
          display: none;
        }
        ##{id} footer {
          padding: 2px 6px 4px;
          background: transparent;
        }
      </style>
      <canvas></canvas>
      <form>
        <fieldset>
        <label>
          <select name=\"select\"></select>
          <input title=\"Add grid\" type=\"button\" name=\"add\" value=\"+\" />
          <input title=\"Delete grid\" type=\"button\" name=\"remove\" value=\"–\" />
        </label>
        <label>
          <span>Color</span>
          <select name=\"color\">
            <option value=\"black\">Black</option>
            <option value=\"white\">White</option>
            <option value=\"coral\">Orange</option>
            <option value=\"crimson\">Red</option>
            <option value=\"chartreuse\">Green</option>
            <option value=\"deeppink\">Pink</option>
            <option value=\"aquamarine\">Cyan</option>
            <option value=\"dodgerblue\">Blue</option>
            <option value=\"lightcoral\">Peach</option>
            <option value=\"rebeccapurple\">Purple</option>
          </select>
        </label>
        <label title=\"Automatically choose the right grid for your viewport\">
          <span>Responsive</span>
          <input name=\"responsive\" type=\"checkbox\" checked>
        </label>
        </fieldset>
        <fieldset>
          <span class=\"legend\">Columns</span>
        <label title=\"The number of columns\">
          <span>Columns</span>
          <input name=\"columns\" type=\"number\" min=\"0\" max=\"30\" />
        </label>
        <label title=\"The total width of the grid without outer gutters. Set a value of 0 for full-width containers. \">
          <span>Container Width</span>
          <input name=\"size\" type=\"number\" min=\"0\" />
          <em>px</em>
        </label>
        <label title=\"The margin between each column\">
          <span>Gutter</span>
          <input name=\"gutter\" type=\"number\" min=\"0\" />
          <em>px</em>
        </label>
        <label title=\"The ideal line-height on which content should align\">
          <span>Baseline Grid</span>
          <input name=\"baseline\" type=\"number\" min=\"0\" />
          <em>px</em>
        </label>
        <label title=\"The vertical offset for the baseline grid\">
          <span>Baseline Offset</span>
          <input name=\"offset\" type=\"number\" min=\"0\" />
          <em>px</em>
        </label>
        <label title=\"The computed column width\">
          <span>Column Width</span>
          <output name=\"column\" type=\"number\"></output>
          <em>px</em>
        </label>
        </fieldset>
        <fieldset>
        <span class=\"legend\">Document Grid</span>
        <label title=\"Create an additional grid\">
          <span>Size</span>
          <input name=\"grid\" type=\"number\" min=\"0\" />
          <em>px</em>
        </label>
        <label title=\"Create subdivisions within the document grid\">
          <span>Divisions</span>
          <input name=\"divisions\" type=\"number\" min=\"0\" />
        </label>
        <label title=\"Constrain the grid to the container width\">
          <span>Constrain</span>
          <input name=\"constrain\" type=\"checkbox\" />
        </label>
        <label title=\"Inset the grid from the top of the page\">
          <span>Vertical Offset</span>
          <input name=\"gridOffset\" type=\"number\" />
          <em>px</em>
        </label>
        <label title=\"Start the grid from the left, middle or right\">
          <span>Origin</span>
          <select name=\"gridOrigin\">
            <option selected>Left</option>
            <option>Middle</option>
            <option>Right</option>
          </select>
        </label>
        </fieldset>
        <fieldset>
          <footer>
            Toggle <strong>U</strong>I / <strong>G</strong>rid
            <input
               title=\"Reset all grids to defaults\"
              name=\"reset\" value=\"Reset\" type=\"button\">
          </footer>
        </fieldset>
      <form>
    "
)()
