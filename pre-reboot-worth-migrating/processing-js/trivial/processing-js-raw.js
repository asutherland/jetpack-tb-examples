jetpack.future.import("menu");
jetpack.future.import("thunderbird.tabs");

let tb = jetpack.thunderbird;

let processingScript = <><![CDATA[
/*
  PROCESSINGJS.COM - BASIC EXAMPLE
  Delayed Mouse Tracking
  MIT License - Hyper-Metrix.com/F1LT3R
  Native Processing compatible
*/

// Global variables
float radius = 50.0;
int X, Y;
int nX, nY;
int delay = 16;

// Setup the Processing Canvas
void setup(){
  size( 200, 200 );
  strokeWeight( 10 );
  frameRate( 15 );
  X = width / 2;
  Y = width / 2;
  nX = X;
  nY = Y;
}

// Main draw loop
void draw(){

  radius = radius + sin( frameCount / 4 );

  // Track circle to new destination
  X+=(nX-X)/delay;
  Y+=(nY-Y)/delay;

  // Fill canvas grey
  background( 100 );

  // Set fill-color to blue
  fill( 0, 121, 184 );

  // Set stroke-color white
  stroke(255);

  // Draw circle
  ellipse( X, Y, radius, radius );
}


// Set circle's next destination
void mouseMoved(){
  nX = mouseX;
  nY = mouseY;
}]]></>.toString();

tb.tabs.defineTabType({
  name: "processing-js-raw",
  onTabOpened: function(tab, args) {
    tab.title = "Processing.js!";

    let doc = tab.contentDocument;
    let win = doc.defaultView;;

    win.Processing(doc.getElementById("canvas"), processingScript);
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
    </body>
  </html>
});

jetpack.menu.tools.add({
  label: "Show Raw Processing.js",
  command: function() tb.tabs.openTab("processing-js-raw", {})
});
