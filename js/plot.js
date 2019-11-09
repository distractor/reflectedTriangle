// draw point
function point(vector, context, color, size){
  context.fillStyle = color;
  context.beginPath();
  context.arc(vector.x, vector.y, size, 0, 2 * Math.PI, true);
  context.closePath();
  context.fill();
}

// adds polygonal sides
function fillObject(points, color, ctx) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (var i = 0; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fill();
}
