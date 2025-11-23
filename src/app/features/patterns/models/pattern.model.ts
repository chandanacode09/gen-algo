export enum PatternType {
  TWO_POINTERS = 'two-pointers',
  SLIDING_WINDOW = 'sliding-window',
  FAST_SLOW = 'fast-slow',
  MERGE_INTERVALS = 'merge-intervals'
}

export interface PatternStep {
  description: string;
  array: number[];
  pointers?: PointerState[];
  windowStart?: number;
  windowEnd?: number;
  currentSum?: number;
  targetSum?: number;
  result?: any;
  highlight?: number[];
}

export interface PointerState {
  index: number;
  name: string;
  color: string;
}

export interface PatternMetadata {
  id: string;
  name: string;
  description: string;
  useCase: string;
  complexity: {
    time: string;
    space: string;
  };
  category: PatternType;
}

export const PATTERN_METADATA: Record<PatternType, PatternMetadata> = {
  [PatternType.TWO_POINTERS]: {
    id: 'two-pointers',
    name: 'Two Pointers',
    description: 'Uses two pointers to iterate through data structure, often from opposite ends',
    useCase: 'Finding pairs with target sum, reversing arrays, palindrome checking',
    complexity: {
      time: 'O(n)',
      space: 'O(1)'
    },
    category: PatternType.TWO_POINTERS
  },
  [PatternType.SLIDING_WINDOW]: {
    id: 'sliding-window',
    name: 'Sliding Window',
    description: 'Maintains a window that slides through the array to find optimal subarray',
    useCase: 'Maximum sum subarray, longest substring, minimum window substring',
    complexity: {
      time: 'O(n)',
      space: 'O(1)'
    },
    category: PatternType.SLIDING_WINDOW
  },
  [PatternType.FAST_SLOW]: {
    id: 'fast-slow',
    name: 'Fast & Slow Pointers',
    description: 'Two pointers move at different speeds to detect cycles or find middle',
    useCase: 'Cycle detection, finding middle element, happy number',
    complexity: {
      time: 'O(n)',
      space: 'O(1)'
    },
    category: PatternType.FAST_SLOW
  },
  [PatternType.MERGE_INTERVALS]: {
    id: 'merge-intervals',
    name: 'Merge Intervals',
    description: 'Merges overlapping intervals or inserts new intervals',
    useCase: 'Meeting rooms, interval merging, task scheduling',
    complexity: {
      time: 'O(n log n)',
      space: 'O(n)'
    },
    category: PatternType.MERGE_INTERVALS
  }
};
