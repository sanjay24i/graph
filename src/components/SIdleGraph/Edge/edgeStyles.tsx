import {
  PolylineEdgeStyle,
  Arrow,
  ArrowType,
  Stroke,
  IArrow,
  IEdgeStyle,
} from "yfiles";

// Define the common edge style configuration
export const commonEdgeStyle = new PolylineEdgeStyle({
  stroke: "1px black", // Adjust stroke width and color as needed
  targetArrow: new Arrow({
    type: ArrowType.DEFAULT,
    stroke: "1px black", // Adjust arrow stroke width and color as needed
    scale: 1, // Adjust scale to change arrow size
  }),
});

export const arrowEdgeStyle = (
  sourceArrow = IArrow.DEFAULT,
  targetArrow = IArrow.DEFAULT
): IEdgeStyle =>
  new PolylineEdgeStyle({
    stroke: Stroke.BLACK,
    targetArrow,
    sourceArrow,
  });
