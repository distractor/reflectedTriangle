// Rotates vector around origin
function rotate(Point, Angle) {
  Result = new Vector(0.0, 0.0);
  Result.x = Point.x * Math.cos(Angle) - Point.y * Math.sin(Angle);
  Result.y = Point.y * Math.cos(Angle) + Point.x * Math.sin(Angle);

  return Result;
}

function movePointToLocalOrigin(Point) {
  return new Vector(Point.x, -Point.y);
}

function movePointToGlobalOrigin(Point) {
  return new Vector(Point.x, -Point.y);
}

function scalarProduct(r, alpha) {
  return new Vector(r.x * alpha, r.y * alpha);
}

function addVector(v1, v2) {
  return new Vector(v1.x + v2.x, v1.y + v2.y);
}
