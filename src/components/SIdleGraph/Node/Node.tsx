import { ShapeNodeShape, Fill } from "yfiles";
import BaseNode from "./BaseNode";
import { NodeProps } from "./Node.types";

const Node = (props: NodeProps) => {
  return <BaseNode {...props} />;
};

Node.defaultProps = {
  shape: ShapeNodeShape.ROUND_RECTANGLE,
  color: Fill.LIGHT_GRAY,
  size: { width: 70, height: 30 },
};

export default Node;
