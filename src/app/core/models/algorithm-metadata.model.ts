/**
 * Time complexity notation
 */
export interface Complexity {
  best: string;
  average: string;
  worst: string;
}

/**
 * Algorithm category
 */
export enum AlgorithmCategory {
  SORTING = 'sorting',
  PATHFINDING = 'pathfinding',
  TREE = 'tree',
  GRAPH = 'graph',
  SEARCHING = 'searching'
}

/**
 * Metadata describing an algorithm
 */
export interface AlgorithmMetadata {
  /** Unique identifier */
  id: string;

  /** Display name */
  name: string;

  /** Category */
  category: AlgorithmCategory;

  /** Brief description */
  description: string;

  /** Time complexity */
  timeComplexity: Complexity;

  /** Space complexity */
  spaceComplexity: string;

  /** Whether the algorithm is stable */
  isStable?: boolean;

  /** Whether the algorithm is in-place */
  isInPlace?: boolean;

  /** Pseudocode lines */
  pseudocode: string[];

  /** Algorithm difficulty (1-5) */
  difficulty?: number;
}
