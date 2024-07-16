import {
  ShapeNodeShape,
  Fill,
  ExteriorLabelModel,
  DefaultLabelStyle,
} from "yfiles";
import BaseNode from "./BaseNode";
import { NodeProps } from "./Node.types";

const TransitionNode = (props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      shape={ShapeNodeShape.RECTANGLE}
      color={Fill.BLACK}
      size={{ width: 70, height: 10 }}
      labelModel={ExteriorLabelModel.EAST}
      labelStyle={new DefaultLabelStyle({ insets: [0, 4] })}
    />
  );
};

export default TransitionNode;
