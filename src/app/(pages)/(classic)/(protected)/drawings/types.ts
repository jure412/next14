export type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

export type Point = { x: number; y: number };

export type DrawLineProps = Draw & {
  color: string;
  isMouseDown?: boolean;
  prevDimensions?: { width: number; height: number };
};
