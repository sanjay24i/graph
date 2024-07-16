import Node from "./Node";
import TransitionNode from "./TransitionNode";
import { NodeProps } from "./Node.types";

const NodeFactory = ({ type, ...props }: { type: string } & NodeProps) => {
  switch (type) {
    case "transition":
      return <TransitionNode {...props} />;
    default:
      return <Node {...props} />;
  }
};

export default NodeFactory;
