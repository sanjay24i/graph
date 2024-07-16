import { Fill, IGraph, INode, Point, ShapeNodeShape } from "yfiles";

export type NodeProps = {
    graph: IGraph;
    id: string;
    label: string;
    position: Point;
    shape?: ShapeNodeShape;
    color?: Fill;
    isVisible?:boolean;
    size?: { width: number; height: number };
    onNodeCreated: (node: INode, id: string) => void;
  };

