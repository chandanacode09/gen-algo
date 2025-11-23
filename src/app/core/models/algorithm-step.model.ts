/**
 * Represents the type of operation in an algorithm step
 */
export enum OperationType {
  COMPARE = 'compare',
  SWAP = 'swap',
  SET = 'set',
  MARK_SORTED = 'mark_sorted',
  PIVOT = 'pivot',
  SPLIT = 'split',
  MERGE = 'merge',
  VISIT = 'visit',
  HIGHLIGHT = 'highlight'
}

/**
 * Represents a single step in an algorithm's execution
 */
export interface AlgorithmStep {
  /** Type of operation being performed */
  operationType: OperationType;

  /** Indices involved in the operation */
  indices: number[];

  /** Array state after this step */
  array: number[];

  /** Human-readable description of the step */
  description: string;

  /** Optional line number in pseudocode */
  codeLine?: number;

  /** Optional metadata for special visualizations */
  metadata?: {
    pivot?: number;
    range?: { start: number; end: number };
    [key: string]: any;
  };
}
