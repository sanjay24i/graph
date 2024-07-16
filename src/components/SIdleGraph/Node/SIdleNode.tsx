import { useEffect, useRef } from "react";
import Node from "./Node";
import { IGraph, INode, Point, ShapeNodeStyle } from "yfiles";

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
  const bend = 30;

  const data = {
    nodes: [
      {
        id: "2",
        label: "2",
        isVisible: false,
        position: { x: 25, y: startYPoint },
      },
      { id: "3", label: "", isVisible: false, position: { x: 25, y: 500 } },
      {
        id: "7",
        label: "7",
        isVisible: true,
        position: { x: startXPoint, y: startYPoint + bend },
      },
      {
        id: "8",
        label: "8",
        isVisible: false,
        position: { x: 100, y: startYPoint + 100 },
      },
      {
        id: "9",
        label: "9",
        isVisible: false,
        position: { x: 800, y: startYPoint + 100 },
      },
    ],
    edges: [{ source: "2", target: "3" }],
  };

  const handleNodeCreated = (node: INode, id: string) => {
    nodeRefs.current = { ...nodeRefs.current, [id]: node };
  };

  useEffect(() => {
    if (mopSize > 1) {
      data.edges.push({ source: "8", target: "9" });
    }
  }, [mopSize]);

  useEffect(() => {
    if (Object.keys(nodeRefs.current).length === data.nodes.length) {
      // Create edges after all nodes are created
      data.edges.forEach((edgeData) => {
        const sourceNode = nodeRefs.current[edgeData.source];
        const targetNode = nodeRefs.current[edgeData.target];
        if (sourceNode && targetNode) {
          graph.createEdge(sourceNode, targetNode);
        }
      });

      // Calculate the midpoint of the edge between node 8 and node 9
      const node7 = nodeRefs.current["7"];
      const node2 = nodeRefs.current["2"];

      // Create an invisible style
      const invisibleStyle = new ShapeNodeStyle({
        shape: "rectangle",
        fill: "transparent",
        stroke: "none",
      });

      const centerPointNode7 = new Point(
        startXPoint + bend + 5,
        startYPoint + 115
      );
      const midpointNode = graph.createNodeAt({
        location: centerPointNode7,
        tag: "Midpoint",
        style: invisibleStyle,
      });

      graph.createEdge({
        source: node7,
        target: midpointNode,
      });

      if (node2 && node7) {
        // Create an edge from node 2 to the top middle of node 7 with a bend
        const edge = graph.createEdge({
          source: node2,
          target: node7,
        });

        // Adjust the bend position
        graph.addBend(
          edge,
          new Point(node7.layout.center.x, node2.layout.center.y)
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
