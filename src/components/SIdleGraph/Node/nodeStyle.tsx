// nodeStyles.js
import { ShapeNodeStyle, ShapeNodeShape, Stroke, Fill } from "yfiles";

export const getNodeStyle = (
  shape = ShapeNodeShape.ROUND_RECTANGLE,
  color = Fill.LIGHT_GRAY
) => {
  return new ShapeNodeStyle({
    shape: shape,
    stroke: Stroke.BLACK,
    fill: color,
  });
};
