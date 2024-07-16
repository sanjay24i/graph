import { useEffect } from "react";
import { Rect, IGraph, ILabelStyle, ILabelModelParameter } from "yfiles";
import { NodeProps } from "./Node.types";
import { getNodeStyle } from "./nodeStyle";

interface BaseNodeProps extends NodeProps {
  graph: IGraph;
  labelModel?: ILabelModelParameter;
  labelStyle?: ILabelStyle;
}

const BaseNode = ({
  graph,
  id,
  label,
  position,
  shape,
  color,
  size = { width: 0, height: 0 },
  onNodeCreated,
  isVisible,
  labelModel,
  labelStyle,
}: BaseNodeProps) => {
  useEffect(() => {
    const node = graph.createNode(
      !isVisible
        ? new Rect(position.x, position.y, size.width, 0)
        : new Rect(position.x, position.y, size.width, size.height),
      getNodeStyle(shape, color)
    );
    if (labelModel && labelStyle) {
      graph.addLabel(node, label, labelModel, labelStyle);
    } else {
      graph.addLabel(node, label);
    }
    node.tag = id;
    onNodeCreated(node, id);
  }, [
    graph,
    id,
    label,
    position,
    isVisible,
    onNodeCreated,
    shape,
    color,
    size,
    labelModel,
    labelStyle,
  ]);

  return null;
};

export default BaseNode;
