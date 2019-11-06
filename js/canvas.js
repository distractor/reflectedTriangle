var canvas = document.getElementById("canvas");
var ctxT = canvas.getContext("2d");
var ctxS = canvas.getContext("2d");
var canvasMouseX;
var canvasMouseY;
var canvasOffset = $("#canvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var canvasHeight = canvas.height;
var canvasCenterX = parseInt(0.5 * canvas.width);

var storedLines = [];
var storedLinesC = [];
var polygon = [];
var radius = 14;
var circumscribedRadius = 150;
ctxT.strokeStyle = "blue";
ctxT.font = '12px Arial';
ctxS.strokeStyle = "orange";
ctxS.font = '12px Arial';

var storedQuad = [];
var quadSideX = 230;
var quadSideY = 120;

// Initial triangle
storedLines.push({
  x: canvasCenterX * 0.5 + circumscribedRadius * Math.cos(7 * Math.PI / 6),
  y: canvasHeight * 0.5 - circumscribedRadius * Math.sin(7 * Math.PI / 6)
});
storedLines.push({
  x: canvasCenterX * 0.5 + circumscribedRadius * Math.cos(Math.PI / 6),
  y: canvasHeight * 0.5 + circumscribedRadius * Math.sin(Math.PI / 6)
});
storedLines.push({
  x: canvasCenterX * 0.5,
  y: canvasHeight * 0.5 - circumscribedRadius
});

// initial quadrilateral
storedQuad.push({
  x: canvasCenterX * 1.5 - quadSideX * 0.5,
  y: canvasHeight * 0.5 + quadSideY * 0.5
});
storedQuad.push({
  x: canvasCenterX * 1.5 + quadSideX * 0.5,
  y: canvasHeight * 0.5 + quadSideY * 0.5
});
storedQuad.push({
  x: canvasCenterX * 1.5 + quadSideX * 0.5,
  y: canvasHeight * 0.5 - quadSideY * 0.5
});
storedQuad.push({
  x: canvasCenterX * 1.5 - quadSideX * 0.5,
  y: canvasHeight * 0.5 - quadSideY * 0.5
});

// get mirrored triangle
function rotateOriginal(angle) {
  storedLinesC = []; // reset array
  for(var i = 0; i < storedLines.length; i++) {
    storedLinesC.push({
      x: Math.cos(angle) * (storedLines[i].x - canvasCenterX * 0.5) - Math.sin(angle) * (storedLines[i].y - canvasHeight * 0.5) + canvasCenterX * 0.5,
      y: Math.sin(angle) * (storedLines[i].x - canvasCenterX * 0.5) - Math.cos(angle) * (storedLines[i].y - canvasHeight * 0.5) + canvasHeight * 0.5
    });
  }
}

function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

// reset view = clear, draw separator, calculate copy, draw triangles
function resetView() {
  ctxT.clearRect(0, 0, canvas.width * 0.5, canvas.height);
  // Center line
  addDashedLine(canvasCenterX, 0, canvasCenterX, canvasHeight, ctxT, "black");
  // plot triangles
  fillPolyline(storedLines, "blue", ctxT);
  // center point
  point(canvasCenterX * 0.5, canvasHeight * 0.5, ctxT, "yellow");
}

// point definiton
function point(x, y, canvas, color){
  canvas.fillStyle = color;
  canvas.strokeStyle = color;
  canvas.beginPath();
  canvas.arc(x, y, 3, 0, 2 * Math.PI, true);
  canvas.closePath();
  canvas.fill();
}

function addText(text, x, y, canvas, color, fontSize){
  canvas.fillStyle = color;
  canvas.font = fontSize + 'px Arial';
  canvas.fillText(text, x, y);
  canvas.closePath();
  canvas.stroke();
}

function addDashedLine(xFrom, yFrom, xTo, yTo, canvas, color){
  canvas.strokeStyle = color;
  canvas.lineWidth = 2;
  canvas.beginPath();
  canvas.setLineDash([5, 10]);
  canvas.moveTo(xFrom, yFrom);
  canvas.lineTo(xTo, yTo);
  canvas.closePath();
  canvas.stroke();
}

function addLine(xFrom, yFrom, xTo, yTo, canvas, color){
  canvas.strokeStyle = color;
  canvas.lineWidth = 2;
  canvas.beginPath();
  canvas.setLineDash([0]);
  canvas.moveTo(xFrom, yFrom);
  canvas.lineTo(xTo, yTo);
  canvas.closePath();
  canvas.stroke();
}

// adds polygonal sides
function fillPolyline(points, color, ctx) {
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (var i = 0; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fill();
}


function drawReflectionOnQuad(e, x, y) {
  // clear plot and redraw polygon
  ctxT.clearRect(canvasCenterX, 0, canvas.width, canvas.height);
  fillPolyline(storedQuad, "blue", ctxT);

  // current mouse click position
  canvasMouseX = parseInt(e.clientX - offsetX);
  canvasMouseY = parseInt(e.clientY - offsetY);

  // mirror point over center
  var rX, ry;
  rX = canvasCenterX * 1.5 + (canvasCenterX * 1.5 - x);
  rY = canvasHeight * 0.5 + (canvasHeight * 0.5 - y);

  // add line over the two points
  addDashedLine(x, y, rX, rY, ctxT, "orange")
  point(rX, rY, ctxT, "orange");
  addText("T'", rX, rY, ctxT, "orange", 30);

  // add line paralel to it
  var nX, nY;
  nx = -(y - canvasHeight * 0.5);
  ny = x - canvasCenterX * 1.5;
  addLine(nx + canvasCenterX * 1.5, ny+ canvasHeight * 0.5, -nx + canvasCenterX * 1.5, -ny+ canvasHeight * 0.5, ctxT, "black");

  // original point
  point(x, y, ctxT, "orange");
  addText("T", x, y, ctxT, "orange", 30);
  // center point
  point(canvasCenterX * 1.5, canvasHeight * 0.5, ctxT, "yellow");
}

function drawReflection(e, x, y){
  resetView();
  canvasMouseX = parseInt(e.clientX - offsetX);
  canvasMouseY = parseInt(e.clientY - offsetY);

  // if corner hit, draw its refelection
  var indexHit = hitPoint(storedLines);
  if (indexHit != -1){
    rotateOriginal(0);
    fillPolyline(storedLinesC, "rgba(0, 0, 255, 0.3)", ctxT);
    fillPolyline(storedLines, "blue", ctxT);
  }
  // mirror point over center
  var rX, ry;
  rX = canvasCenterX * 0.5 + (canvasCenterX * 0.5 - x);
  rY = canvasHeight * 0.5 + (canvasHeight * 0.5 - y);

  // add line over the two points
  addDashedLine(x, y, rX, rY, ctxT, "orange")
  point(rX, rY, ctxT, "orange");
  addText("T'", rX, rY, ctxT, "orange", 30);

  // add line paralel to it
  var nX, nY;
  nx = -(y - canvasHeight * 0.5);
  ny = x - canvasCenterX * 0.5;
  addLine(nx + canvasCenterX * 0.5, ny+ canvasHeight * 0.5, -nx + canvasCenterX * 0.5, -ny+ canvasHeight * 0.5, ctxT, "black");

  // original point
  point(x, y, ctxT, "orange");
  addText("T", x, y, ctxT, "orange", 30);
  // center point
  point(canvasCenterX * 0.5, canvasHeight * 0.5, ctxT, "yellow");
  point(x, y, ctxT, "orange");
}

// loads initial state
window.onload = function() {
  resetView();
  // form array of points
  polygon = [];
  for (var i = 0; i < storedLines.length; i++) {
    polygon.push([storedLines[i].x, storedLines[i].y]);
  };
  // draw quad
  fillPolyline(storedQuad, "blue", ctxT)
  // draw center on quad
  point(canvasCenterX * 1.5, canvasHeight * 0.5, ctxT, "yellow");
};

function handleMouseDown(e) {
  canvasMouseX = parseInt(e.clientX - offsetX);
  canvasMouseY = parseInt(e.clientY - offsetY);
  var p = [canvasMouseX, canvasMouseY];

  if (canvasMouseX >= canvasCenterX) {
    // Quadrilateral area!
    var indexHit = hitPoint(storedQuad);
    if (indexHit != -1){
      // not hit
    drawReflectionOnQuad(e, storedQuad[indexHit].x, storedQuad[indexHit].y);
    }
    else {
      drawReflectionOnQuad(e, canvasMouseX, canvasMouseY);
    }
  } else {
    // triangle area
    //if (inside(p, polygon) ==  true) {
      // Check if node hit
      var indexHit = hitPoint(storedLines);
      if (indexHit != -1){
        // not hit
        drawReflection(e, storedLines[indexHit].x, storedLines[indexHit].y);
      }
      else {
        drawReflection(e, canvasMouseX, canvasMouseY);
      }
    //}
  }
}


// checks if point is hit
function hitPoint(pointArray) {
  var dx, dy;
  for(var i = 0; i < pointArray.length; i++){
    dx = canvasMouseX - pointArray[i].x;
    dy = canvasMouseY - pointArray[i].y;

    if (radius * radius > dx * dx + dy * dy) {
      return i;
    }
  }
  return -1
}

$("#canvas").mousedown(function(e) {handleMouseDown(e);});

$("#clear").click(function() {
  ctxT.clearRect(0, 0, canvas.width, canvas.height);
  resetView()
  // draw quad
  fillPolyline(storedQuad, "blue", ctxT)
  // draw center on quad
  point(canvasCenterX * 1.5, canvasHeight * 0.5, ctxT, "yellow");
});
