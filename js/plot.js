// draw point
function addPoint(vector, context, color, size){
  // move to global system
  var v = movePointToGlobalOrigin(vector);

  context.fillStyle = color;
  context.beginPath();
  context.arc(v.x, v.y, size, 0, 2 * Math.PI, true);
  context.closePath();
  context.fill();
}

// adds polygonal sides
function addObject(points, color, context) {
  // move to global system
  var temp = [];
  for(var i = 0; i< nodeArray.length; i++)
    temp.push(movePointToGlobalOrigin(points[i]));

  context.fillStyle = color;
  context.beginPath();
  context.moveTo(temp[0].x, temp[0].y);
  for (var i = 0; i < temp.length; i++) {
      context.lineTo(temp[i].x, temp[i].y);
  }
  context.closePath();
  context.fill();
}

function reflectObject(points) {
  var t = points;

  // Translate from center
  for(var i = 0; i < t.length; i++) {
    t[i] = addVector(t[i], scalarProduct(canvasCenter, -1));
    t[i] = rotate(t[i], Math.PI);
    t[i] = addVector(t[i], canvasCenter);
  }
  return t;
}

function addReflectionLine(mousePosition, canvas, color, lineWidth){
  var v = addVector(mousePosition, scalarProduct(addVector(canvasCenter, scalarProduct(mousePosition, -1)), 2))
  // Plot
  // dashed line
  addDashedLine(movePointToGlobalOrigin(mousePosition), movePointToGlobalOrigin(v), canvas, color, lineWidth);
  // points
  addPoint(mousePosition, canvas, color, pointSize);
  addPoint(v, canvas, color, pointSize);
  // text
  addText("T", mousePosition, ctx, "orange", 30);
  addText("T'", v, ctx, "orange", 30);
}

function addDashedLine(vFrom, vTo, canvas, color, lineWidth){
  canvas.strokeStyle = color;
  canvas.lineWidth = lineWidth;
  canvas.setLineDash([5, 10]);
  canvas.beginPath();
  canvas.moveTo(vFrom.x, vFrom.y);
  canvas.lineTo(vTo.x, vTo.y);
  canvas.stroke();
}

function addText(text, position, canvas, color, fontSize){
  // move to global system
  var v = movePointToGlobalOrigin(position);
  canvas.strokeStyle = color;
  canvas.font = fontSize + 'px Arial';
  canvas.fillText(text, v.x, v.y);
  canvas.closePath();
  canvas.stroke();
}

function addAxisSymmetry(nodePos, canvas, color, pointSize, lineWidth){
  s = new Vector(0, 1);
  r0 = canvasCenterA;

  var t = (dotProduct(nodePos, s) - dotProduct(r0,s)) / vectorLength(s);

  closest = addVector(r0, scalarProduct(s, t));
  copy = addVector(closest, addVector(closest, scalarProduct(nodePos, -1)));
  addPoint(closest, canvas, color, pointSize);
  addDashedLine(copy, nodePos, canvas, color, 2);
  addPoint(nodePos, canvas, color, pointSize);
  addPoint(copy, canvas, color, pointSize);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctxA.clearRect(0, 0, canvasA.width, canvasA.height);
}

function addPolygon(reflect = false) {
  currentObject = "Polygon";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctxA.clearRect(0, 0, canvasA.width, canvasA.height);

  var diagonal = 220;
  var top = 150;
  var angle = Math.PI / 6;

  nodeArray = [];

  // first node
  node = new Vector(1, 0);
  node = rotate(node, angle);
  node = scalarProduct(node, diagonal * 0.5);
  nodeArray.push(node);
  // second node
  node = new Vector(node.x - top, node.y)
  nodeArray.push(node);
  // third array
  node = new Vector(1, 0);
  node = rotate(node, angle);
  node = scalarProduct(node, -diagonal * 0.5);
  nodeArray.push(node);
  // forth array
  node = new Vector(node.x + top, node.y)
  nodeArray.push(node);

  // Translate to center
  for(var i = 0; i< nodeArray.length; i++)
    nodeArray[i] = addVector(nodeArray[i], canvasCenter);

  if (reflect == true){
    addObject(reflectObject([...nodeArray]), lightBlue, ctx);
  }
  addObject([...nodeArray], blue, ctx);
  addObject([...nodeArray], blue, ctxA);
}

function addKite(reflect = false) {
  currentObject = "Kite";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctxA.clearRect(0, 0, canvasA.width, canvasA.height);

  var kiteWidth = 110; // total width
  var h1 = 70;         // top node
  var h2 = 130;        // bottom node

  nodeArray = [];

  // first node
  node = new Vector(kiteWidth * 0.5, 0);
  nodeArray.push(node);
  // second node
  node = new Vector(0, h1);
  nodeArray.push(node);
  // third node
  node = new Vector(-kiteWidth * 0.5, 0);
  nodeArray.push(node);
  // forth node
  node = new Vector(0, -h2);
  nodeArray.push(node);

  // Translate to center
  for(var i = 0; i< nodeArray.length; i++)
    nodeArray[i] = addVector(nodeArray[i], canvasCenter);

  if (reflect == true){
    addObject(reflectObject([...nodeArray]), lightBlue, ctx);
  }
  addObject([...nodeArray], blue, ctx);
  addObject([...nodeArray], blue, ctxA);
}

function addRectangle(reflect = false) {
  currentObject = "Rectangle";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctxA.clearRect(0, 0, canvasA.width, canvasA.height);

  nodeArray = [];
  var rectangleSize = 100;
  var recHeight = 0.65;

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

  // Translate to center
  for(var i = 0; i< nodeArray.length; i++)
    nodeArray[i] = addVector(nodeArray[i], canvasCenter);
  if (reflect == true){
    addObject(reflectObject([...nodeArray]), lightBlue, ctx);
  }
  addObject([...nodeArray], blue, ctx);
  addObject([...nodeArray], blue, ctxA);
}

function addTriangle(reflect = false) {
  currentObject = "Triangle";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctxA.clearRect(0, 0, canvasA.width, canvasA.height);

  nodeArray = [];
  var triangleSize = 100;

  // first node
  node = new Vector(1, 0);
  node = rotate(node, 2 * Math.PI / 3 + Math.PI / 2);
  node = scalarProduct(node, triangleSize);
  nodeArray.push(node);
  // second node
  node = new Vector(1, 0);
  node = rotate(node, -(2 * Math.PI / 3 - Math.PI / 2));
  node = scalarProduct(node, triangleSize);
  nodeArray.push(node);
  // third node
  node = new Vector(1, 0);
  node = rotate(node, Math.PI / 2);
  node = scalarProduct(node, triangleSize);
  nodeArray.push(node);

  // Translate to center
  for(var i = 0; i < nodeArray.length; i++)
    nodeArray[i] = addVector(nodeArray[i], canvasCenter);

  if (reflect == true){
    addObject(reflectObject([...nodeArray]), lightBlue, ctx);
  }
  addObject([...nodeArray], blue, ctx);
  addObject([...nodeArray], blue, ctxA);
}
