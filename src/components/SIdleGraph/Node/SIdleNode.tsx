import { useEffect, useRef } from "react";
import Node from "./Node";
import { IArrow, IGraph, INode, Point, ShapeNodeStyle } from "yfiles";
import Edge from "../Edge/Edge";
import { arrowEdgeStyle } from "../Edge/edgeStyles";

export const SIdleNode = ({
  graph,
  mopSize,
}: {
  graph: IGraph;
  onNodeCreated: (node: INode, id: string) => void;
  mopSize: number;
}) => {
  const nodeRefs = useRef<{ [key: string]: INode }>({});

  const startYPoint = 100;
  const startXPoint = 400;
  const leftEdgeXPos = 25;
  const bend = 20;
  const nodeVDistance = 70;

  const data = {
    nodes: [
      {
        id: "sIdleCornerNode",
        label: "",
        isVisible: false,
        position: { x: leftEdgeXPos, y: startYPoint },
      },
      {
        id: "seconLastLeftNode",
        label: "",
        isVisible: false,
        position: { x: leftEdgeXPos, y: 500 },
      },
      {
        id: "lastLeftNode",
        label: "",
        isVisible: false,
        position: { x: leftEdgeXPos, y: 700 },
      },
      {
        id: "SIdleNode",
        label: "SIdle",
        isVisible: true,
        position: { x: startXPoint, y: startYPoint + bend },
      },
      {
        id: "middleEdgeSourceNode",
        label: "",
        isVisible: false,
        position: { x: 100, y: startYPoint + nodeVDistance },
      },
      {
        id: "middleEdgeTargetNode",
        label: "",
        isVisible: false,
        position: { x: 800, y: startYPoint + nodeVDistance },
      },
    ],
    edges: [
      {
        source: "sIdleCornerNode",
        target: "seconLastLeftNode",
        sourceNodeArrow: IArrow.NONE,
        targetNodeArrow: IArrow.NONE,
      },
      { source: "seconLastLeftNode", target: "lastLeftNode" },
    ],
  };

  const handleNodeCreated = (node: INode, id: string) => {
    nodeRefs.current = { ...nodeRefs.current, [id]: node };
  };

  useEffect(() => {
    if (mopSize > 1) {
      data.edges.push({
        source: "middleEdgeSourceNode",
        target: "middleEdgeTargetNode",
        sourceNodeArrow: IArrow.NONE,
        targetNodeArrow: IArrow.NONE,
      });
    }
  }, [mopSize]);

  useEffect(() => {
    if (Object.keys(nodeRefs.current).length === data.nodes.length) {
      // Create edges after all nodes are created
      data.edges.forEach((edgeData) => {
        const sourceNode = nodeRefs.current[edgeData.source];
        const targetNode = nodeRefs.current[edgeData.target];
        const style = arrowEdgeStyle(
          edgeData?.sourceNodeArrow,
          edgeData?.targetNodeArrow
        );

        if (sourceNode && targetNode) {
          graph.createEdge(sourceNode, targetNode, style);
        }
      });

      // Calculate the midpoint of the edge between node 8 and node 9
      const SIdleNode = nodeRefs.current["SIdleNode"];
      const sIdleCornerNode = nodeRefs.current["sIdleCornerNode"];

      // Create an invisible style
      const invisibleStyle = new ShapeNodeStyle({
        shape: "rectangle",
        fill: "transparent",
        stroke: "none",
      });

      const centerPointSIdleNode = new Point(
        startXPoint + 50,
        startYPoint + nodeVDistance
      );
      const midpointNode = graph.createNodeAt({
        location: centerPointSIdleNode,
        tag: "Midpoint",
        style: invisibleStyle,
      });

      graph.createEdge(SIdleNode, midpointNode);

      if (sIdleCornerNode && SIdleNode) {
        // Create an edge from node 2 to the top middle of node 7 with a bend
        const edge = graph.createEdge({
          source: sIdleCornerNode,
          target: SIdleNode,
        });

        // Adjust the bend position
        graph.addBend(
          edge,
          new Point(SIdleNode.layout.center.x, sIdleCornerNode.layout.center.y)
        );

        // Set the target arrow style (uncomment if needed)
        // edge.style.targetArrow = "default";
      }
    }
  }, [nodeRefs.current, graph, data.nodes.length, data.edges]);

  return (
    <>
      {data.nodes.map(({ id, label, position, isVisible }) => (
        <Node
          key={id}
          graph={graph}
          id={id}
          isVisible={isVisible}
          label={label}
          position={new Point(position.x, position.y)}
          onNodeCreated={handleNodeCreated}
        />
      ))}
    </>
  );
};
