import React, { useEffect, useRef } from "react";
import { INode, Point, Rect, ShapeNodeStyle } from "yfiles";
import NodeFactory from "./Node/NodeFactory"; // Import the NodeFactory component
import { commonEdgeStyle } from "./Edge/edgeStyles";
import { MopStackProps } from "./MopStack.types";

const MopStack = ({ graph, data, onNodeCreated, xPos }: MopStackProps) => {
  const nodeRefs = useRef<{ [key: string]: INode }>({});
  const stackXPos = xPos || 100;

  const handleNodeCreated = (node: INode, id: string) => {
    nodeRefs.current = { ...nodeRefs.current, [id]: node };
    onNodeCreated(node, id);
  };

  console.log("data...data", data);

  useEffect(() => {
    const nodeIds = Object.keys(data);
    if (nodeIds.length === 0) return;

    const transitions = data[nodeIds[0]].Transitions;

    const node1 = nodeRefs.current[nodeIds[0]];
    const node2 = nodeRefs.current[`${nodeIds[0]}-step`];

    if (node1 && node2) {
      // Connect the nodes once they are created
      graph.createEdge(node1, node2);

      // Create an arrow pointing upwards from the first node
      const topArrowNode = graph.createNode({
        layout: new Rect(node1.layout.center.x, node1.layout.y - 100, 0, 0),
        tag: "topArrowNode",
        style: new ShapeNodeStyle({
          shape: "rectangle",
          fill: "transparent",
          stroke: "none",
        }),
      });
      graph.createEdge({
        source: topArrowNode,
        target: node1,
        style: commonEdgeStyle, // Use the common edge style
      });

      // Connect transition nodes
      transitions.forEach((_, index: number) => {
        const transitionNode =
          nodeRefs.current[`${nodeIds[0]}-transition-${index}`];
        if (transitionNode) {
          graph.createEdge({
            source: node2,
            target: transitionNode,
            style: commonEdgeStyle, // Use the common edge style
          });
        }
      });

      // Identify the last transition node
      const lastTransitionNodeId = `${nodeIds[0]}-transition-${
        transitions.length - 1
      }`;
      const lastTransitionNode = nodeRefs.current[lastTransitionNodeId];

      if (lastTransitionNode) {
        // Create a new node below the last transition node
        const bottomLineNode = graph.createNode({
          layout: new Rect(
            lastTransitionNode.layout.center.x,
            lastTransitionNode.layout.y + 50,
            0,
            0
          ),
          tag: "bottomLineNode",
          style: new ShapeNodeStyle({
            shape: "rectangle",
            fill: "transparent",
            stroke: "none",
          }),
        });
        graph.createEdge({
          source: lastTransitionNode,
          target: bottomLineNode,
          style: commonEdgeStyle, // Use the common edge style
        });
      }
    }
  }, [graph, data, nodeRefs.current]);

  return (
    <>
      {Object.keys(data).map((key) => {
        const stepTag = data[key].step_tag;
        const transitions = data[key].Transitions;

        return (
          <React.Fragment key={key}>
            <NodeFactory
              type="transition"
              graph={graph}
              id={key}
              isVisible={true}
              label={key}
              position={new Point(stackXPos, 300)}
              onNodeCreated={handleNodeCreated}
            />
            {stepTag && (
              <NodeFactory
                type="default"
                graph={graph}
                id={`${key}-step`}
                isVisible={true}
                label={stepTag}
                position={new Point(stackXPos, 400)}
                onNodeCreated={handleNodeCreated}
              />
            )}
            {transitions.map((transition, idx: number) => (
              <NodeFactory
                key={`${key}-transition-${idx}`}
                type="transition"
                graph={graph}
                id={`${key}-transition-${idx}`}
                isVisible={true}
                label={transition.Transition_from_to}
                position={new Point(stackXPos, 500 + idx * 100)}
                onNodeCreated={handleNodeCreated}
              />
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default MopStack;
