import Node from "./Node";
import TransitionNode from "./TransitionNode";
import { NodeFactoryProps } from "./Node.types";

const NodeFactory = ({ type, ...props }: NodeFactoryProps) => {
  switch (type) {
    case "transition":
      return <TransitionNode {...props} />;
    case "default":
    default:
      return <Node {...props} />;
  }
};

export default NodeFactory;
