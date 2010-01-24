jetpack.future.import("menu");
jetpack.future.import("thunderbird.tabs");
jetpack.future.import("thunderbird.gloda");

let tb = jetpack.thunderbird;

let exampleScript = <><![CDATA[
/* Volvox-inspired visualization of your top contact history v0.1.
 *  Andrew Sutherland <asutherland@asutherland.org>
 * Released under the MIT license.
 */

void setup() {
  size(250,250);
  frameRate(10);
  strokeWeight(1);
}

int[] fromMe = { 5, 1, 3, 4, 2, 1, 1, 8, 0, 0, 0, 8, 2, 2, 1, 4, 1, 0};

int[] toMe = { 1, 5, 3, 4, 1, 1, 3, 8, 0, 0, 0, 8, 1, 2, 3, 5, 1, 2};

float rotation = 0.0;
float rotateStep = TWO_PI / 360;

color baseColor = color(255, 255, 255, 128);
color fromMeColor = color(192, 192, 255, 128);
color toMeColor = color(192, 255, 192, 128);
color lineColor = color(128, 128, 128, 64);
stroke(lineColor);

void draw() {
  background(255);
  pushMatrix();
  translate(125, 125);

  // figure the linear length desired for display and that is our
  //  circumference.  use that to figure out the base radius
  int circumference = (fromMe.length * 15);
  float baseR = circumference / TWO_PI;

  rotation = rotation + rotateStep;
  if (rotation >= TWO_PI)
    rotation = rotation - TWO_PI;

  float startAng;
  float endAng;
  float lipSize = 4.0;
  float outerR = baseR + lipSize;
  float innerR = baseR - lipSize;

  for (int i=0; i < fromMe.length; i++) {
    startAng = i * TWO_PI / fromMe.length + rotation;
    endAng = (i + 1) * TWO_PI / fromMe.length + rotation;

    float outerCR = outerR + toMe[i] * 2 + lipSize;
    color curToColor = lerpColor(baseColor, toMeColor,
                         constrain(float(toMe[i]) / 8, 0.0, 1.0));
    fill(curToColor);
    beginShape();
    vertex(baseR * cos(startAng), baseR * sin(startAng));
    vertex(outerR * cos(startAng), outerR * sin(startAng));
    bezierVertex(outerCR * cos(startAng), outerCR * sin(startAng),
                 outerCR * cos(endAng), outerCR * sin(endAng),
                 outerR * cos(endAng), outerR * sin(endAng));
    vertex(baseR * cos(endAng), baseR * sin(endAng));
    bezierVertex(outerR * cos(endAng), outerR * sin(endAng),
                 outerR * cos(startAng), outerR * sin(startAng),
                 baseR * cos(startAng), baseR * sin(startAng));
    endShape(CLOSE);

    float innerCR = innerR - fromMe[i] * 2 + lipSize - 1;
    color curFromColor = lerpColor(baseColor, fromMeColor,
                           constrain(float(fromMe[i]) / 8, 0.0, 1.0));
    fill(curFromColor);
    beginShape();
    vertex(baseR * cos(startAng), baseR * sin(startAng));
    vertex(innerR * cos(startAng), innerR * sin(startAng));
    bezierVertex(innerCR * cos(startAng), innerCR * sin(startAng),
                 innerCR * cos(endAng), innerCR * sin(endAng),
                 innerR * cos(endAng), innerR * sin(endAng));
    vertex(baseR * cos(endAng), baseR * sin(endAng));
    bezierVertex(outerR * cos(endAng), outerR * sin(endAng),
                 outerR * cos(startAng), outerR * sin(startAng),
                 baseR * cos(startAng), baseR * sin(startAng));
    endShape(CLOSE);
  }

  popMatrix();
}
]]></>.toString();

tb.tabs.defineTabType({
  name: "top-contact-history",
  onTabOpened: function(tab, args) {
    tab.title = "Top Contacts IDE";

    let doc = tab.contentDocument;
    let win = doc.defaultView;;

    // kick off the query

    tb.gloda.getTopContactsWithPersonalHistory({
      onHistoryAvailable: function(contactResults) {
        win.contactResults = contactResults;
      }
    });

    //tab.p = win.Processing(doc.getElementById("canvas"), processingScript);
  },
  html: <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <style type="text/css"><![CDATA[
        body {
          background-color: #ffffff;
          padding: 4px;
        }
      ]]></style>
      <script type="application/javascript" src="resource://jetpack/content/js/processing.js"/>
    </head>
    <body>
      <canvas id="canvas" width="200px" height="200px"></canvas>
      <textarea id="code" rows="60" cols="80">
      </textarea>
    </body>
  </html>
});

jetpack.menu.tools.add({
  label: "Visualize Top Contact History",
  command: function() tb.tabs.openTab("top-contact-history", {})
});
