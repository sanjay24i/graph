import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  GraphComponent,
  GraphEditorInputMode,
  IGraph,
  INode,
  Point,
  License,
} from "yfiles";
import Node from "./Node/Node";
import Edge from "./Edge/Edge";
import licenseData from "../../license.json";

License.value = licenseData;

const GraphMapper: React.FC = () => {
  const graphComponentContainer = useRef<HTMLDivElement>(null);
  const [nodeRefs, setNodeRefs] = useState<{ [key: string]: INode | null }>({
    node1: null,
    node2: null,
  });

  const graphComponent = useMemo(() => {
    const gc = new GraphComponent();
    gc.inputMode = new GraphEditorInputMode();
    return gc;
  }, []);

  useEffect(() => {
    const gcContainer = graphComponentContainer.current!;
    gcContainer.appendChild(graphComponent.div);
    return () => {
      gcContainer.innerHTML = "";
    };
  }, [graphComponentContainer, graphComponent]);

  const handleNodeCreated = (node: INode, id: string) => {
    setNodeRefs((prevRefs) => ({ ...prevRefs, [id]: node }));
  };

  return (
    <div>
      <div
        className="graph-component-container"
        style={{ width: "800px", height: "600px" }}
        ref={graphComponentContainer}
      />

      <Node
        graph={graphComponent.graph}
        id="node1"
        label="Node 1"
        position={new Point(100, 100)}
        onNodeCreated={handleNodeCreated}
      />

      <Node
        graph={graphComponent.graph}
        id="node2"
        label="Node 2"
        position={new Point(300, 100)}
        onNodeCreated={handleNodeCreated}
      />
      {nodeRefs.node1 && nodeRefs.node2 && (
        <Edge
          graph={graphComponent.graph}
          source={nodeRefs.node1}
          target={nodeRefs.node2}
        />
      )}
    </div>
  );
};

export default GraphMapper;
