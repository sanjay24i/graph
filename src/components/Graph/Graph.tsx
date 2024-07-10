/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useMemo, useLayoutEffect, useState, useEffect } from 'react';
import {
  GraphComponent,
  GraphEditorInputMode,
  INode,
  License
} from 'yfiles';
import axios from 'axios';
import licenseData from '../../license.json';
import { initialGraphData, loadGraphFromData } from './graphUtils';


License.value = licenseData;

export function Graph() {
  const [data, setData] = useState<any>(initialGraphData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState<{ visible: boolean, x: number, y: number, nodeLabel: string }>({ visible: false, x: 0, y: 0, nodeLabel: '' });
  const graphComponentContainer = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const graphComponent = useMemo(() => {
    License.value = licenseData;
    const gc = new GraphComponent();
    gc.inputMode = new GraphEditorInputMode({
      allowCreateNode:false
    });
    return gc;
  }, []);

  useEffect(()=>{
       const fetchGraphData = async () => {
        setIsLoading(true);
       const {data} = await axios.get('./graph.json');
       setData(data);
       setIsLoading(false)
      }
      fetchGraphData()
  },[])

  useLayoutEffect(() => {
    const gcContainer = graphComponentContainer.current!;
    gcContainer.appendChild(graphComponent.div);

     // Add item clicked listener
     const inputMode = graphComponent.inputMode as GraphEditorInputMode
     inputMode?.addItemClickedListener((sender, evt) => {
       const clickedNode = evt.item as INode;
       
       if (clickedNode) {
         const nodeLabel = clickedNode.labels.size > 0 ? clickedNode.labels.get(0).text : 'No Label';
         
         const bottomRightPos = Object.values(clickedNode.layout.bottomRight);
         setContextMenu({
           visible: true,
           x: bottomRightPos[0]+(clickedNode.layout.width*2),
           y: bottomRightPos[1]+ (clickedNode.layout.height ),
           nodeLabel: nodeLabel
         });
         
       }
     });

    return () => {
      gcContainer.innerHTML = '';
    };

  }, [graphComponentContainer, graphComponent]);

  useLayoutEffect(() => {
    const graph = graphComponent.graph;
    if (data) {
      loadGraphFromData(graph, data);
    }

    
  }, [graphComponent, data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu]);

const handleActionClick = (act:string) => {
  console.log('data...act', act)
}

  return (
     isLoading && data?.nodes?.length > 1 ? <div>Loading...</div> :
    <><div
      className="graph-component-container"
      style={{ width: '800px', height: '600px' }}
      ref={graphComponentContainer}
    />
    {contextMenu.visible && (
        <div
        ref={contextMenuRef}
          style={{
            position: 'absolute',
            left: contextMenu.x,
            top: contextMenu.y,
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '10px',
            zIndex: 1000
          }}
        >
          <div onClick={() => handleActionClick('Action 1')}>Action 1</div>
          <div onClick={() => handleActionClick('Action 2')}>Action 2</div>
        </div>
      )}
    </>
  );
}
