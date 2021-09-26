export interface Point {
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

export interface TruchetProps {
  seed: number;
  lineWidth: number;
  tileSize: number;
  strokeStyle: string;
}
