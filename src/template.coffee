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
          font-family: sans-serif;
        }
        ##{id} * {
          box-sizing: border-box;
        }
        ##{id} form,
        ##{id} label,
        ##{id} footer {
          display: block;
          background: #333;
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
        ##{id} label {
          clear: both;
          margin-bottom: 0;
          border-top: 1px solid #444;
          border-bottom: 1px solid #222;
          cursor: pointer;
          font-weight: bold;
        }
        ##{id} label span {
          display: inline-block;
          width: 100px;
          position: relative;
          z-index: 1;
          padding: 4px 0 4px 12px;
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
        }
        ##{id} input[type=\"number\"],
        ##{id} output {
          display: inline-block;
          background: transparent;
          margin: 0;
          border: none;
          font: inherit;
          box-sizing: border-box;
          padding: 4px;
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
        }
        ##{id} select {
          border: none;
          background: transparent;
          margin: 4px;
        }
        ##{id} select[name=\"select\"] {
          width: 100px;
        }
        ##{id} select[name=\"color\"] {
          width: 72px;
          margin-left: -21px;
        }
        ##{id} input[type=\"button\"] {
          width: 20px;
          border: none;
          background: transparent;
          margin-left: 3px;
          display: inline-block;
          border-radius: 3px;
          padding: 0 4px;
          height: 20px;
          margin: 4px 0;
          text-align: center;
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
        ##{id} footer {
          padding: 4px 12px;
        }
        ##{id} footer strong {
          color: #fff;
        }
        ##{id} .disable {
          display: none;
        }
      </style>
      <canvas></canvas>
      <form>
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
        <label title=\"The number of columns\">
          <span>Columns</span>
          <input name=\"columns\" type=\"number\" min=\"1\" max=\"30\" />
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
        <label title=\"Create an additional grid\">
          <span>Document Grid</span>
          <input name=\"grid\" type=\"number\" min=\"0\" />
          <em>px</em>
        </label>
        <label title=\"Create subdivisions within the document grid\">
          <span>Grid Divisions</span>
          <input name=\"divisions\" type=\"number\" min=\"0\" />
          <em>px</em>
        </label>
        <label title=\"Constrain the grid to the container width\">
          <span>Constrain Grid</span>
          <input name=\"constrain\" type=\"checkbox\" />
        </label>
        <label title=\"The computed column width\">
          <span>Column Width</span>
          <output name=\"column\" type=\"number\"></output>
          <em>px</em>
        </label>
        <footer>
          Toggle <strong>u</strong>ser interface / <strong>g</strong>rid
        </footer>
      <form>
    "
)()
