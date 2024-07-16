import { useEffect } from "react";
import {
  Rect,
  ShapeNodeStyle,
  ShapeNodeShape,
  Stroke,
  Fill,
  ExteriorLabelModel,
  DefaultLabelStyle,
} from "yfiles";
import { NodeProps } from "./Node.types";

const TransitionNode = ({
  graph,
  id,
  label,
  position,
  shape = ShapeNodeShape.RECTANGLE,
  color = Fill.BLACK,
  size = { width: 70, height: 10 },
  onNodeCreated,
  isVisible,
}: NodeProps) => {
  useEffect(() => {
    const node = graph.createNode(
      !isVisible
        ? new Rect(position.x, position.y, size.width, 0)
        : new Rect(position.x, position.y, size.width, size.height),
      new ShapeNodeStyle({
        shape: shape,
        stroke: Stroke.BLACK,
        fill: color,
      })
    );
    graph.addLabel(
      node,
      label,
      ExteriorLabelModel.EAST,
      new DefaultLabelStyle({ insets: [0, 4] })
    );
    node.tag = id;
    onNodeCreated(node, id);
  }, [graph, id, label, position, shape, color, size, onNodeCreated]);

  return null;
};

export default TransitionNode;
