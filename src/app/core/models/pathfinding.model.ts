/**
 * Grid cell type
 */
export enum CellType {
  EMPTY = 'empty',
  WALL = 'wall',
  START = 'start',
  END = 'end',
  VISITED = 'visited',
  PATH = 'path',
  CURRENT = 'current'
}

/**
 * Grid cell model
 */
export interface GridCell {
  row: number;
  col: number;
  type: CellType;
  distance: number;
  previousCell: GridCell | null;
  isAnimating?: boolean;
}

/**
 * Path finding step
 */
export interface PathfindingStep {
  cell: GridCell;
  type: 'visit' | 'path' | 'complete';
  description: string;
}

/**
 * Grid configuration
 */
export interface GridConfig {
  rows: number;
  cols: number;
  startCell: { row: number; col: number };
  endCell: { row: number; col: number };
}

export const DEFAULT_GRID_CONFIG: GridConfig = {
  rows: 20,
  cols: 30,
  startCell: { row: 10, col: 5 },
  endCell: { row: 10, col: 25 }
};
