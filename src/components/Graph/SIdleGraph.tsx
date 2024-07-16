/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useMemo, useLayoutEffect } from 'react';
import {
  GraphComponent,
  GraphEditorInputMode,
  IGraph,
  INode,
  License,
  Point,
  ShapeNodeStyle,
  PolylineEdgeStyle,
  IArrow
} from 'yfiles';
import licenseData from '../../license.json';

License.value = licenseData;

const createNodeAt = (graph: IGraph, label: string, position: Point): INode => {
  const node = graph.createNode([position.x , position.y, 100, 20], new ShapeNodeStyle({
    shape: 'round-rectangle',
    fill: 'lightgray',
    stroke: 'black'
  }));
  graph.addLabel(node, label);
  return node;
};

const createEdge = (graph: IGraph, source: INode, target: INode) => {
  graph.createEdge(source, target, new PolylineEdgeStyle({
    stroke: 'black',
    targetArrow: IArrow.DEFAULT
  }));
};

const createGraphFromJson = (graph: IGraph, jsonData: any) => {
  const centerX = 400; // Center X of the page
  const topY = 50; // Top Y of the page
  const verticalOffset = 100;
  const horizontalSpacing = 100;

  // Create central node "SIdle"
  const centralNode = createNodeAt(graph, jsonData.Start, new Point(centerX, topY));
 // const centralNodeLeft = createNodeAt(graph, jsonData.Start, new Point(0, topY+50));
 // const centralNodeRight = createNodeAt(graph, jsonData.Start, new Point(800, topY));

  // Create nodes from Mop array and connect them
  const mopNodes: Record<string, INode> = {};
  jsonData.Mop.forEach((mopItem: any, index: number) => {
    const key = Object.keys(mopItem)[0];
    const label = key.split(':')[1];
    const stepTag = mopItem[key].step_tag;

    let node = createNodeAt(graph, label, new Point(centerX + index * horizontalSpacing, topY + verticalOffset));
    mopNodes[stepTag] = node;

    // Connect central node to this node
    createEdge(graph, centralNode, node);

    // Create additional nodes and transitions
    mopItem[key].Transitions.forEach((transition: any) => {
      if (transition.Destination) {
        const destNode = createNodeAt(graph, transition.Destination, new Point(centerX + index * horizontalSpacing, topY + verticalOffset * 2));
        mopNodes[transition.Destination] = destNode;

        createEdge(graph, node, destNode);
        node = destNode;
      }
    });
  });
};

export function SIdleGraph() {
  const graphComponentContainer = useRef<HTMLDivElement>(null);

  const graphComponent = useMemo(() => {
    const gc = new GraphComponent();
    gc.inputMode = new GraphEditorInputMode({
      allowCreateNode: false
    });
    return gc;
  }, []);

  useLayoutEffect(() => {
    const gcContainer = graphComponentContainer.current!;
    gcContainer.appendChild(graphComponent.div);

    const graph = graphComponent.graph;
    const jsonData = {
      "Start": "SIdle",
      "Mop": [
        {
          "1:OoS": {
            "step_tag": "Aqtk1_OoS",
            "Transitions": [
              {
                "Origin": "Aqtk1_OoS",
                "Destination": "",
                "Transition_from_to": "Aqtk1_OoS_wait"
              }
            ]
          }
        },
        {
          "2:InS": {
            "step_tag": "Aqtk1_InS",
            "Transitions": [
              {
                "Origin": "Aqtk1_InS",
                "Destination": "Aqtk1_Run",
                "Transition_from_to": "Aqtk1_InS_Run"
              },
              {
                "Origin": "Aqtk1_InS",
                "Destination": "",
                "Transition_from_to": "Aqtk1_InS_wait"
              }
            ]
          }
        },
        {
          "3:Run": {
            "step_tag": "Aqtk1_Run",
            "Transitions": [
              {
                "Origin": "Aqtk1_Run",
                "Destination": "Aqtk1_Run2",
                "Transition_from_to": "Aqtk1_Run_Run2"
              },
              {
                "Origin": "Aqtk1_Run2",
                "Destination": "Aqtk1_Run3",
                "Transition_from_to": "Aqtk1_Run2_Run3"
              },
              {
                "Origin": "Aqtk1_Run2",
                "Destination": "Aqtk1_InS",
                "Transition_from_to": "Aqtk1_Run2_InS"
              },
              {
                "Origin": "Aqtk1_Run3",
                "Destination": "Aqtk1_Run4",
                "Transition_from_to": "Aqtk1_Run3_Run4"
              },
              {
                "Origin": "Aqtk1_Run4",
                "Destination": "",
                "Transition_from_to": "Aqtk1_Run4_wait"
              }
            ]
          }
        },
        {
          "4:Run45": {
            "step_tag": "Aqtk1_Run45",
            "Transitions": [
              {
                "Origin": "Aqtk1_Run45",
                "Destination": "",
                "Transition_from_to": "Aqtk1_Run45_wait"
              }
            ]
          }
        }
      ]
    };

    createGraphFromJson(graph, jsonData);

    return () => {
      gcContainer.innerHTML = '';
    };
  }, [graphComponent]);

  return (
    <div
      className="graph-component-container"
      style={{ width: '800px', height: '600px' }}
      ref={graphComponentContainer}
    />
  );
}
