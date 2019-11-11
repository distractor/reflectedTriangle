var canvas = document.getElementById("canv");
var canvasA = document.getElementById("canAxis");
var ctx = canvas.getContext("2d");
var ctxA = canvasA.getContext("2d");
var canvasMouseX;
var canvasMouseY;
var canvasOffset = $("#canv").offset();
var canvasOffsetA = $("#canAxis").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var canvasHeight = canvas.height;
canvasCenter = new Vector(canvas.width * 0.5, -canvasHeight * 0.5);
var offsetAX = canvasOffsetA.left;
var offsetAY = canvasOffsetA.top;
var canvasHeightA = canvasA.height;
canvasCenterA = new Vector(canvasA.width * 0.5, -canvasHeightA * 0.5);

var blue = "rgba(0, 0, 255, 1.0)";
var lightBlue = "rgba(0, 0, 255, 0.3)";
var pointSize = 4;
ctx.strokeStyle = blue;

var canvasOrigin = new Vector(0, canvasHeight);

var nodes;
var nodeArray = [];
var currentObject = "";
var radius = 8;
var reflectOver = new Vector(0, 1);

// Handle mouse down
function handleMouseDown(e) {
  canvasMouseX = parseInt(e.clientX - offsetX);
  canvasMouseY = parseInt(e.clientY - offsetY);

  mousePos = new Vector(canvasMouseX, -canvasMouseY);

  // clear canvas
  $("#Clear").click();

  // replot object
  var reflect = nodeHit(mousePos) != -1;
  if (reflect == true) {
    mousePos = nodeArray[nodeHit(mousePos)];
  }
  if (currentObject != ""){
    switch (currentObject){
      case "Triangle":
        addTriangle(reflect);
        break;
      case "Rectangle":
        addRectangle(reflect);
        break;
      case "Kite":
        addKite(reflect);
        break;
      case "Polygon":
        addPolygon(reflect);
        break;
      default:
        // do nothing
    }
  }

  // add mirroring line
  addReflectionLine(mousePos, ctx, "orange", 2);
  // add center point
  addPoint(canvasCenter, ctx, "yellow", pointSize);
  // axis reflection
  addAxisSymmetry(mousePos, ctxA, "orange", pointSize, 2);
}

// Handle function
$("#canv").mousedown(function(e) {handleMouseDown(e);});

// Different objects
$("#Triangle").click(function() {
  addTriangle();
});
$("#Rectangle").click(function() {
  addRectangle();
});
$("#Kite").click(function() {
  addKite();
});
$("#Polygon").click(function() {
  addPolygon();
});

// Clear button
$("#Clear").click(function() {
  clearCanvas();
});
