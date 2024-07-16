import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { GraphComponent, GraphEditorInputMode, INode, License } from "yfiles";
import licenseData from "../../license.json";
import { SIdleNode } from "./Node/SIdleNode";
import MopStack from "./MopStack";
import axios from "axios";
import { initialGraphData } from "./graphUtils";
import { GraphDataType } from "./SIdleGraph.types";

License.value = licenseData;

const SIdleGraph = () => {
  const graphComponentContainer = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<GraphDataType>(initialGraphData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const nodeRefs = useRef<{ [key: string]: INode }>({});

  const graphComponent = useMemo(() => {
    const gc = new GraphComponent();
    gc.inputMode = new GraphEditorInputMode();
    return gc;
  }, []);

  useEffect(() => {
    const fetchGraphData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("./demograph.json");
        setData(response.data);
        console.log("Fetched data:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGraphData();
  }, []);

  useLayoutEffect(() => {
    const gcContainer = graphComponentContainer.current!;
    gcContainer.appendChild(graphComponent.div);
    return () => {
      gcContainer.innerHTML = "";
    };
  }, [graphComponentContainer, graphComponent, data]);

  const handleNodeCreated = (node: INode, id: string) => {
    nodeRefs.current = { ...nodeRefs.current, [id]: node };
  };

  const mopLength = data.Mop.length - 1;

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div
      className="graph-component-container"
      style={{ width: "800px", height: "600px" }}
      ref={graphComponentContainer}
    >
      <SIdleNode
        graph={graphComponent.graph}
        mopSize={mopLength}
        onNodeCreated={handleNodeCreated}
      />
      {data.Mop.map((stack, index) => (
        <MopStack
          key={index}
          graph={graphComponent.graph}
          data={stack}
          xPos={(800 / mopLength) * index}
          onNodeCreated={handleNodeCreated}
        />
      ))}
    </div>
  );
};

export default SIdleGraph;
