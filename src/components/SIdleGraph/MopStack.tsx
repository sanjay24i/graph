import React, { useEffect, useRef } from "react";
import { IGraph, INode, Point, Rect, ShapeNodeStyle } from "yfiles";
import Node from "./Node/Node"; // Your existing Node component
import TransitionNode from "./Node/TransitionNode"; // Your existing TransitionNode component
import { commonEdgeStyle } from "./Edge/edgeStyles";

interface MopStackProps {
  graph: IGraph;
  data: Record<string, any>;
  onNodeCreated: (node: INode, id: string) => void;
  xPos: number;
}

const MopStack: React.FC<MopStackProps> = ({
  graph,
  data,
  onNodeCreated,
  xPos,
}) => {
  const nodeRefs = useRef<{ [key: string]: INode }>({});
  const stackXPos = xPos || 100;

  const handleNodeCreated = (node: INode, id: string) => {
    nodeRefs.current = { ...nodeRefs.current, [id]: node };
    onNodeCreated(node, id);
  };

  useEffect(() => {
    const nodeIds = Object.keys(data);
    if (nodeIds.length === 0) return;

    const stepTag = data[nodeIds[0]].step_tag;
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
      transitions.forEach((transition, index) => {
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
      {Object.keys(data).map((key, index) => {
        const stepTag = data[key].step_tag;
        const transitions = data[key].Transitions;

        return (
          <React.Fragment key={key}>
            <TransitionNode
              graph={graph}
              id={key}
              isVisible={true}
              label={key}
              position={new Point(stackXPos, 300)}
              onNodeCreated={handleNodeCreated}
            />
            {stepTag && (
              <Node
                graph={graph}
                id={`${key}-step`}
                isVisible={true}
                label={stepTag}
                position={new Point(stackXPos, 400)}
                onNodeCreated={handleNodeCreated}
              />
            )}
            {transitions.map((transition, idx) => (
              <TransitionNode
                key={`${key}-transition-${idx}`}
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
