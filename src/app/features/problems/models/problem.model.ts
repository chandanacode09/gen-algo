/**
 * LeetCode coding patterns
 */
export enum CodingPattern {
  TWO_POINTERS = 'TWO_POINTERS',
  SLIDING_WINDOW = 'SLIDING_WINDOW',
  FAST_SLOW_POINTERS = 'FAST_SLOW_POINTERS',
  MERGE_INTERVALS = 'MERGE_INTERVALS',
  CYCLIC_SORT = 'CYCLIC_SORT',
  IN_PLACE_REVERSAL = 'IN_PLACE_REVERSAL',
  TREE_BFS = 'TREE_BFS',
  TREE_DFS = 'TREE_DFS',
  TWO_HEAPS = 'TWO_HEAPS',
  SUBSETS = 'SUBSETS',
  MODIFIED_BINARY_SEARCH = 'MODIFIED_BINARY_SEARCH',
  TOP_K_ELEMENTS = 'TOP_K_ELEMENTS',
  K_WAY_MERGE = 'K_WAY_MERGE',
  TOPOLOGICAL_SORT = 'TOPOLOGICAL_SORT',
  DYNAMIC_PROGRAMMING = 'DYNAMIC_PROGRAMMING',
  BACKTRACKING = 'BACKTRACKING',
  GRAPH = 'GRAPH',
}

/**
 * Problem difficulty
 */
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Med.',
  HARD = 'Hard',
}

/**
 * LeetCode Problem
 */
export interface Problem {
  /** LeetCode problem number */
  id: number;

  /** Problem title */
  title: string;

  /** Difficulty level */
  difficulty: Difficulty;

  /** Success rate percentage */
  successRate: number;

  /** Primary pattern */
  pattern: CodingPattern;

  /** Secondary patterns (optional) */
  relatedPatterns?: CodingPattern[];

  /** Is visualization implemented? */
  hasVisualization: boolean;

  /** Route to visualization */
  route?: string;

  /** Short description */
  description?: string;

  /** Key concepts */
  concepts?: string[];
}

/**
 * Pattern metadata
 */
export interface PatternInfo {
  id: CodingPattern;
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  useCase: string;
  icon: string;
  color: string;
}

/**
 * Pattern metadata mapping
 */
export const PATTERN_INFO: Record<CodingPattern, PatternInfo> = {
  [CodingPattern.TWO_POINTERS]: {
    id: CodingPattern.TWO_POINTERS,
    name: 'Two Pointers',
    description: 'Use two pointers to iterate through data from different ends or speeds',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    useCase: 'Sorted arrays, pairs, palindromes',
    icon: '👈👉',
    color: '#3b82f6',
  },
  [CodingPattern.SLIDING_WINDOW]: {
    id: CodingPattern.SLIDING_WINDOW,
    name: 'Sliding Window',
    description: 'Maintain a window of elements and slide it through the array',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    useCase: 'Subarray problems, longest/shortest sequences',
    icon: '🪟',
    color: '#10b981',
  },
  [CodingPattern.FAST_SLOW_POINTERS]: {
    id: CodingPattern.FAST_SLOW_POINTERS,
    name: 'Fast & Slow Pointers',
    description: 'Two pointers moving at different speeds to detect cycles',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    useCase: 'Linked list cycles, middle element',
    icon: '🐇🐢',
    color: '#8b5cf6',
  },
  [CodingPattern.MERGE_INTERVALS]: {
    id: CodingPattern.MERGE_INTERVALS,
    name: 'Merge Intervals',
    description: 'Merge overlapping intervals',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    useCase: 'Scheduling, overlapping ranges',
    icon: '📊',
    color: '#f59e0b',
  },
  [CodingPattern.CYCLIC_SORT]: {
    id: CodingPattern.CYCLIC_SORT,
    name: 'Cyclic Sort',
    description: 'Place numbers in correct positions in cyclic manner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    useCase: 'Finding missing/duplicate numbers in range',
    icon: '🔄',
    color: '#06b6d4',
  },
  [CodingPattern.IN_PLACE_REVERSAL]: {
    id: CodingPattern.IN_PLACE_REVERSAL,
    name: 'In-place Reversal',
    description: 'Reverse linked list or array in place',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    useCase: 'Reverse linked list, rotate arrays',
    icon: '↩️',
    color: '#ec4899',
  },
  [CodingPattern.TREE_BFS]: {
    id: CodingPattern.TREE_BFS,
    name: 'Tree BFS',
    description: 'Level-order traversal using queue',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    useCase: 'Level order traversal, minimum depth',
    icon: '🌳',
    color: '#22c55e',
  },
  [CodingPattern.TREE_DFS]: {
    id: CodingPattern.TREE_DFS,
    name: 'Tree DFS',
    description: 'Depth-first traversal recursively',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    useCase: 'Path problems, tree validation',
    icon: '🌲',
    color: '#14b8a6',
  },
  [CodingPattern.TWO_HEAPS]: {
    id: CodingPattern.TWO_HEAPS,
    name: 'Two Heaps',
    description: 'Use min-heap and max-heap to track median',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    useCase: 'Median finding, sliding window median',
    icon: '⚖️',
    color: '#f97316',
  },
  [CodingPattern.SUBSETS]: {
    id: CodingPattern.SUBSETS,
    name: 'Subsets',
    description: 'Generate all combinations using BFS',
    timeComplexity: 'O(2^n)',
    spaceComplexity: 'O(2^n)',
    useCase: 'Permutations, combinations, subsets',
    icon: '🎲',
    color: '#a855f7',
  },
  [CodingPattern.MODIFIED_BINARY_SEARCH]: {
    id: CodingPattern.MODIFIED_BINARY_SEARCH,
    name: 'Modified Binary Search',
    description: 'Binary search on sorted/rotated arrays',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    useCase: 'Search in rotated array, find boundaries',
    icon: '🔍',
    color: '#6366f1',
  },
  [CodingPattern.TOP_K_ELEMENTS]: {
    id: CodingPattern.TOP_K_ELEMENTS,
    name: 'Top K Elements',
    description: 'Use heap to find top K elements',
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(k)',
    useCase: 'Top K frequent, Kth largest',
    icon: '🏆',
    color: '#eab308',
  },
  [CodingPattern.K_WAY_MERGE]: {
    id: CodingPattern.K_WAY_MERGE,
    name: 'K-way Merge',
    description: 'Merge K sorted lists using heap',
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(k)',
    useCase: 'Merge sorted lists/arrays',
    icon: '🔀',
    color: '#84cc16',
  },
  [CodingPattern.TOPOLOGICAL_SORT]: {
    id: CodingPattern.TOPOLOGICAL_SORT,
    name: 'Topological Sort',
    description: 'Order tasks based on dependencies',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    useCase: 'Task scheduling, course prerequisites',
    icon: '📋',
    color: '#0ea5e9',
  },
  [CodingPattern.DYNAMIC_PROGRAMMING]: {
    id: CodingPattern.DYNAMIC_PROGRAMMING,
    name: 'Dynamic Programming',
    description: 'Break down into subproblems and cache results',
    timeComplexity: 'Varies',
    spaceComplexity: 'Varies',
    useCase: 'Optimization problems, counting',
    icon: '💎',
    color: '#d946ef',
  },
  [CodingPattern.BACKTRACKING]: {
    id: CodingPattern.BACKTRACKING,
    name: 'Backtracking',
    description: 'Build solution incrementally and backtrack on failure',
    timeComplexity: 'Exponential',
    spaceComplexity: 'O(n)',
    useCase: 'N-Queens, Sudoku, word search',
    icon: '↩️',
    color: '#f43f5e',
  },
  [CodingPattern.GRAPH]: {
    id: CodingPattern.GRAPH,
    name: 'Graph',
    description: 'Traverse graphs using BFS/DFS',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    useCase: 'Connected components, shortest path',
    icon: '🕸️',
    color: '#64748b',
  },
};
