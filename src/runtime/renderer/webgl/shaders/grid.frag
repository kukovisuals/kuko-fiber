uniform vec2 iResolution;
uniform float uColumns;
uniform float uRows;

void main() {
  vec2 cellSize = iResolution / vec2(uColumns, uRows);
  vec2 pixelInCell = mod(gl_FragCoord.xy, cellSize);

  float lineWidth = 1.0;
  float lineX = step(pixelInCell.x, lineWidth) + step(cellSize.x - lineWidth, pixelInCell.x);
  float lineY = step(pixelInCell.y, lineWidth) + step(cellSize.y - lineWidth, pixelInCell.y);
  float line = min(lineX + lineY, 1.0);

  gl_FragColor = vec4(vec3(1.0), line * 0.6);
}
