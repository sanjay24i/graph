// Node.js
import { useEffect } from "react";
import { Rect } from "yfiles";
import { NodeProps } from "./Node.types";
import { getNodeStyle } from "./nodeStyle";

const Node = ({
  graph,
  id,
  label,
  position,
  shape,
  color,
  size = { width: 70, height: 30 },
  onNodeCreated,
  isVisible,
}: NodeProps) => {
  useEffect(() => {
    const node = graph.createNode(
      !isVisible
        ? new Rect(position.x, position.y, size.width, 0)
        : new Rect(position.x, position.y, size.width, size.height),
      getNodeStyle(shape, color)
    );
    graph.addLabel(node, label);
    node.tag = id;
    onNodeCreated(node, id);
  }, [graph, id, label, position, isVisible, onNodeCreated, shape, color]);

  return null;
};

export default Node;
