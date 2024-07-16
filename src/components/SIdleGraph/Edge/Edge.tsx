import React, { useEffect } from 'react';
import { IGraph, IEdge, PolylineEdgeStyle, IArrow, INode } from 'yfiles';

type EdgeProps = {
  graph: IGraph;
  source: INode;
  target: INode;
  targetArrow?: IArrow;
  sourceArrow?: IArrow;
};

const Edge: React.FC<EdgeProps> = ({ graph, source, target, targetArrow = IArrow.NONE, sourceArrow = IArrow.NONE }) => {
  useEffect(() => {
    const edgeStyle = new PolylineEdgeStyle({
      targetArrow: targetArrow,
      sourceArrow: sourceArrow
    });
    graph.createEdge(source, target, edgeStyle);
  }, [graph, source, target, targetArrow, sourceArrow]);

  return null;
};

export default Edge;
