/* ***** BEGIN LICENSE BLOCK *****
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/licenses/publicdomain/
 * ***** END LICENSE BLOCK ***** */

/*
 * Protovis googly eyes.  Based on:
 * http://vis.stanford.edu/protovis/ex/eyes.html
 */

jetpack.future.import("thunderbird.messageDisplay");

let tb = jetpack.thunderbird;

tb.messageDisplay.appendReaderPanel({
  onReady: function (panel) {
    let doc = panel.contentDocument;

    pvFixupDoc(doc, panel.contentWindow);
    let vis = new pv.Panel()
      .canvas(doc.getElementById("canvas"))
      .width(200)
      .height(28);
    vis.add(pv.Panel)
        .data([{x: 60, y: 14, r: 14}, {x: 120, y: 14, r: 14}])
        .left(function(d) d.x)
        .top(function(d) d.y)
      .add(pv.Dot)
        .fillStyle("#fff")
        .strokeStyle(null)
        .size(function(d) d.r * d.r)
      .add(pv.Dot)
        .def("v", function(d) this.mouse().norm().times(d.r / 2))
        .fillStyle("#aaa")
        .left(function(d) this.v().x)
        .top(function(d) this.v().y)
        .size(function(d) d.r * d.r / 4);

    vis.render();
    panel.contentWindow.onmousemove = function() vis.render();

    panel.show();
  },
  html:
    <>
      <body style="margin: 0px; overflow: hidden;">
        <div id="canvas"/>
      </body>
    </>
});
