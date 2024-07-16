/* eslint-disable @typescript-eslint/no-explicit-any */
import { INodeItem } from './Graph.types';
import {
    IGraph,
    Point,
    Rect,
    ShapeNodeStyle,
    ShapeNodeShape,
    Stroke,
    Fill,
    INode,
    PolylineEdgeStyle,
    IArrow
  } from 'yfiles';


// Graph Node black shap
const thinLineNode =  {
    shape: ShapeNodeShape.RECTANGLE,
    stroke: Stroke.BLACK,
    fill: Fill.WHITE
  }
  
  // Graph Initial data
  export const initialGraphData = {
    nodes: [],
    edges: []
  };


  // Create Node
 export const createNodeAt = (graph: IGraph, node:INodeItem): INode => {
   const width = node?.size?.width || 75;
   const height = node?.size?.height || 25;
   const newNode = graph.createNode(
      !node.isVisible ? new Rect(node.position.x, node.position.y, width, 0):new Rect(node.position.x, node.position.y, width, height),
      new ShapeNodeStyle( node?.shapeType ==="thinLine" ? thinLineNode :{
        shape: ShapeNodeShape.ROUND_RECTANGLE,
        stroke: Stroke.BLACK,
        fill: Fill.LIGHT_GRAY,
      })
    )
    newNode.tag = node.id;
    return newNode;
  }
  
  // render Gtaph
  export const loadGraphFromData = (graph: IGraph, data: any): void => {
    graph.clear();
    const nodeMap = new Map<number, INode>();

    data.nodes.forEach((node: any) => {
      const graphNode = createNodeAt(graph, node);
      if (node.label) {
        graph.addLabel(graphNode, node.label);
      }
      nodeMap.set(node.id, graphNode);
    });

    data.edges.forEach((edge: any) => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      if (sourceNode && targetNode) {
        const edgeStyle = new PolylineEdgeStyle();
        if(edge.targetArrow){
          edgeStyle.targetArrow = IArrow.DEFAULT
        }
  
        if(edge.sourceArrow){
          edgeStyle.sourceArrow = IArrow.DEFAULT
        }
        
        const newEdge = graph.createEdge(sourceNode, targetNode, edgeStyle);
   
        if (edge?.sourceBend || edge?.targetBend) {
          const bendSourceX = sourceNode.layout.center.x; 
          const bendSourceY = edge?.sourceBend;
          const bendTargetX = targetNode.layout.center.x;
          const bendTargetY = edge?.targetBend;
        
          graph.clearBends(newEdge);
          if(edge?.sourceBend){
            graph.addBend(newEdge, new Point(bendSourceX, bendSourceY));
          }
          if(edge?.targetBend){
            graph.addBend(newEdge, new Point(bendTargetX, bendTargetY));
          }
        }
      }
    });
  };


