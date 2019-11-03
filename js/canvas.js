var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var ctxC = canvas.getContext("2d");
var canvasMouseX;
var canvasMouseY;
var canvasOffset = $("#canvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var canvasHeight = canvas.height;
var centerX = parseInt(0.5 * canvas.width);

var storedLines = [];
var storedLinesC = [];
var startX = 0;
var startY = 0;
var radius = 14;
ctx.strokeStyle = "orange";
ctx.font = '12px Arial';
ctxC.strokeStyle = "blue";
ctxC.font = '12px Arial';

var isDragging = false;

// Initial triangle
storedLines.push({
  x: 196,
  y: 297
});
storedLines.push({
  x: 368,
  y: 92
});
storedLines.push({
  x: 211,
  y: 123
});

// get mirrored triangle
function mirrorOriginal() {
  storedLinesC = []; // reset array
  for(var i = 0; i < storedLines.length; i++) {
    storedLinesC.push({
      x: storedLines[i].x + 2 * (centerX - storedLines[i].x),
      y: storedLines[i].y
    });
  }
}

// reset view = clear, draw separator, calculate copy, draw triangles
function resetView() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctxC.clearRect(0, 0, canvas.width, canvas.height);
  // Center line
  ctxC.strokeStyle = "black";
  ctxC.lineWidth = 1;
  ctxC.beginPath();
  ctxC.moveTo(centerX, 0);
  ctxC.lineTo(centerX, canvasHeight);
  ctxC.stroke();

  // calculate copies
  mirrorOriginal();
  // plot triangles
  fillPolyline();
  // fill points
  fillPoints();
}

// adds points
function fillPoints() {
  for(var i = 0; i < storedLines.length; i++){
    point(storedLines[i].x, storedLines[i].y, ctx, "blue");
    point(storedLinesC[i].x, storedLines[i].y, ctxC, "red");
  }
}

// point definiton
function point(x, y, canvas, color){
  canvas.strokeStyle = color;
  canvas.beginPath();
  canvas.arc(x, y, 2, 0, 2 * Math.PI, true);
  canvas.stroke();
}

// adds polygonal sides
function fillPolyline() {
  var c = storedLines.length - 1;
  ctx.strokeStyle = "orange";
  ctx.lineWidth = 3;
  for(var i = 0; i < storedLines.length - 1; i++){
    ctx.beginPath();
    ctx.moveTo(storedLines[i].x, storedLines[i].y);
    ctx.lineTo(storedLines[i + 1].x, storedLines[i + 1].y);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(storedLines[c].x, storedLines[c].y);
  ctx.lineTo(storedLines[0].x, storedLines[0].y);
  ctx.stroke();

  ctxC.strokeStyle = "blue";
  ctxC.lineWidth = 3;
  for(var i = 0; i < storedLines.length - 1; i++){
    ctxC.beginPath();
    ctxC.moveTo(storedLinesC[i].x, storedLinesC[i].y);
    ctxC.lineTo(storedLinesC[i + 1].x, storedLinesC[i + 1].y);
    ctxC.stroke();
  }
  ctxC.beginPath();
  ctxC.moveTo(storedLinesC[c].x, storedLinesC[c].y);
  ctxC.lineTo(storedLinesC[0].x, storedLinesC[0].y);
  ctxC.stroke();
}

// loads initial state
window.onload = function() {
  resetView();
};

function handleMouseDown(e) {
  canvasMouseX = parseInt(e.clientX - offsetX);
  canvasMouseY = parseInt(e.clientY - offsetY);

  // Check if node hit
  var indexHit = hitPoint();
  console.log(indexHit);
  if (indexHit != -1){
    isDragging = true;
  }
}
function handleMouseMove(e) {
  if (isDragging){

    canvasMouseX = parseInt(e.clientX - offsetX);
    canvasMouseY = parseInt(e.clientY - offsetY);

    // Check for right node
    var indexHit = hitPoint();
    if (indexHit != -1) {
      storedLines[indexHit].x = canvasMouseX;
      storedLines[indexHit].y = canvasMouseY;
    };
    resetView();
  }
}

function handleMouseUp(e) {
  canvasMouseX = parseInt(e.clientX - offsetX);
  canvasMouseY = parseInt(e.clientY - offsetY);

  var indexHit = hitPoint();
  if (indexHit != -1) {
    storedLines[indexHit].x = canvasMouseX;
    storedLines[indexHit].y = canvasMouseY;
  };
  resetView();
  // reset isDragging
  isDragging = false;
}

// checks if point is hit
function hitPoint() {
  var dx, dy;
  for(var i = 0; i < storedLines.length; i++){
    dx = canvasMouseX - storedLines[i].x;
    dy = canvasMouseY - storedLines[i].y;

    if (radius * radius > dx * dx + dy * dy) {
      return i;
    }
  }
  return -1
}

$("#canvas").mousedown(function(e) {handleMouseDown(e);});
$("#canvas").mousemove(function(e){handleMouseMove(e);});
$("#canvas").mouseup(function(e){handleMouseUp(e);});

$("#clear").click(function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctxC.clearRect(0, 0, canvas.width, canvas.height);
  resetView()
});
