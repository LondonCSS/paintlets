export interface PointXY {
  x: number;
  y: number;
}

export interface Tile {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface TileProps {
  strokeStyle: string;
  lineWidth: number;
  random: () => number;
}
