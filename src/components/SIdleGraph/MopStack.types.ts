import { IGraph, INode } from "yfiles";

export type TransitionProps = {
    Origin: string;
    Destination: string;
    Transition_from_to: string;
  };
  
export type MopProps = {
    step_tag: string;
    Transitions: TransitionProps[];
  };
  
export  type MopStackProps = {
    graph: IGraph;
    data: Record<string, MopProps>;
    onNodeCreated: (node: INode, id: string) => void;
    xPos: number;
  };