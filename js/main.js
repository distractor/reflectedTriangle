var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");
var canvasMouseX;
var canvasMouseY;
var canvasOffset = $("#canv").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var canvasHeight = canvas.height;
canvasCenter = new Vector(canvas.width * 0.5, -canvasHeight * 0.5);
ctx.strokeStyle = blue;

var reflectOverCenter;
var reflectOverAxis;

var canvasOrigin = new Vector(0, canvasHeight);

var nodes;
var nodeArray = [];
var currentObject = "";
var radius = 8;
var reflectOver = new Vector(0, 1);

// Get reflection status
function readCheckbox() {
  reflectOverCenter = document.getElementById("centerCheck").checked;
  reflectOverAxis = document.getElementById("axisCheck").checked;
}

// Handle mouse down
function handleMouseDown(e) {
  canvasMouseX = parseInt(e.clientX - offsetX);
  canvasMouseY = parseInt(e.clientY - offsetY);

  readCheckbox();

  mousePos = new Vector(canvasMouseX, -canvasMouseY);

  // clear canvas
  clearCanvas();

  // replot object
  var reflect = nodeHit(mousePos) != -1;
  reflect = reflect && reflectOverCenter;
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
  if (reflectOverCenter == true) {
    addReflectionLine(mousePos, ctx, orange, lineThickness);
    // add center point
    addPoint(canvasCenter, ctx, yellow, pointSize);
  }
  if (reflectOverAxis == true) {
    // axis reflection
    addAxisSymmetry(mousePos, ctx, orange, pointSize, lineThickness);
  }
  // mous click position
  addPoint(mousePos, ctx, orange, pointSize);
  addText("T", mousePos, ctx, orange, fontSize);
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
