/* eslint-disable @typescript-eslint/no-explicit-any */
export type INodeItem = {
  id: number;
  label: string;
  isVisible: boolean;
  position: { x: number; y: number };
  shapeType: any;
  size: {
    width: number;
    height: number;
  };
};
