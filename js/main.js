var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");
var canvasMouseX;
var canvasMouseY;
var canvasOffset = $("#canv").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var canvasHeight = canvas.height;
canvasCenter = new Vector(canvas.width * 0.5, -canvasHeight * 0.5)

var blue = "rgba(0, 0, 255, 1.0)";
var pointSize = 4;
ctx.strokeStyle = blue;

var canvasOrigin = new Vector(0, canvasHeight);

var nodes;
var nodeArray = [];

// Handle mouse down
function handleMouseDown(e) {
  canvasMouseX = parseInt(e.clientX - offsetX);
  canvasMouseY = parseInt(e.clientY - offsetY);
}

// Handle function
$("#canv").mousedown(function(e) {handleMouseDown(e);});

// Different objects
$("#Triangle").click(function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  nodeArray = [];
  var triangleSize = 100;

  // first node
  node = new Vector(1, 0);
  node = rotate(node, 2 * Math.PI / 3 + Math.PI / 2);
  node = scalarProduct(node, triangleSize);
  node = addVector(canvasCenter, node);
  nodeArray.push(node);
  // second node
  node = new Vector(1, 0);
  node = rotate(node, -(2 * Math.PI / 3 - Math.PI / 2));
  node = scalarProduct(node, triangleSize);
  node = addVector(canvasCenter, node);
  nodeArray.push(node);
  // third node
  node = new Vector(1, 0);
  node = rotate(node, Math.PI / 2);
  node = scalarProduct(node, triangleSize);
  node = addVector(canvasCenter, node);
  nodeArray.push(node);

  var temp = [];
  for(var i = 0; i< nodeArray.length; i++)
    temp.push(movePointToGlobalOrigin(nodeArray[i]));

  fillObject(temp, blue, ctx)
  for(var i = 0; i< nodeArray.length; i++)
    point(temp[i], ctx, "orange", pointSize);
});
$("#Rectangle").click(function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  nodeArray = [];
  var rectangleSize = 100;
  var recHeight = 0.75;

  // first node
  node = new Vector(rectangleSize, recHeight * rectangleSize);
  nodeArray.push(node);
  // second node
  node = new Vector(-node.x, node.y);
  nodeArray.push(node);
  // third node
  node = new Vector(node.x, -node.y);
  nodeArray.push(node);
  // forth node
  node = new Vector(-node.x, node.y);
  nodeArray.push(node);

  for(var i = 0; i< nodeArray.length; i++)
    nodeArray[i] = addVector(nodeArray[i], canvasCenter);

  var temp = [];
  for(var i = 0; i< nodeArray.length; i++)
    temp.push(movePointToGlobalOrigin(nodeArray[i]));

  fillObject(temp, blue, ctx)
  for(var i = 0; i< nodeArray.length; i++)
    point(temp[i], ctx, "orange", pointSize);
});
$("#Kite").click(function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
$("#Polygon").click(function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Clear button
$("#Clear").click(function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
