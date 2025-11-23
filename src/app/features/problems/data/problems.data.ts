import { Problem, CodingPattern, Difficulty } from '../models/problem.model';

/**
 * Complete list of LeetCode problems organized by pattern
 * Based on the 14 patterns to ace coding interviews
 */
export const LEETCODE_PROBLEMS: Problem[] = [
  // ========================================
  // TWO POINTERS
  // ========================================
  {
    id: 1,
    title: 'Two Sum',
    difficulty: Difficulty.EASY,
    successRate: 56.6,
    pattern: CodingPattern.TWO_POINTERS,
    hasVisualization: true,
    route: '/problems/two-sum',
    description: 'Find two numbers that add up to a target',
    concepts: ['Hash map', 'Two pointers'],
  },
  {
    id: 15,
    title: '3Sum',
    difficulty: Difficulty.MEDIUM,
    successRate: 38.0,
    pattern: CodingPattern.TWO_POINTERS,
    hasVisualization: false,
  },
  {
    id: 11,
    title: 'Container With Most Water',
    difficulty: Difficulty.MEDIUM,
    successRate: 59.0,
    pattern: CodingPattern.TWO_POINTERS,
    hasVisualization: true,
    route: '/problems/container-with-water',
  },
  {
    id: 42,
    title: 'Trapping Rain Water',
    difficulty: Difficulty.HARD,
    successRate: 66.2,
    pattern: CodingPattern.TWO_POINTERS,
    hasVisualization: false,
  },
  {
    id: 125,
    title: 'Valid Palindrome',
    difficulty: Difficulty.EASY,
    successRate: 52.2,
    pattern: CodingPattern.TWO_POINTERS,
    hasVisualization: false,
  },
  {
    id: 167,
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: Difficulty.MEDIUM,
    successRate: 64.1,
    pattern: CodingPattern.TWO_POINTERS,
    hasVisualization: false,
  },

  // ========================================
  // SLIDING WINDOW
  // ========================================
  {
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: Difficulty.MEDIUM,
    successRate: 37.9,
    pattern: CodingPattern.SLIDING_WINDOW,
    hasVisualization: true,
    route: '/problems/longest-substring',
  },
  {
    id: 76,
    title: 'Minimum Window Substring',
    difficulty: Difficulty.HARD,
    successRate: 46.4,
    pattern: CodingPattern.SLIDING_WINDOW,
    hasVisualization: false,
  },
  {
    id: 424,
    title: 'Longest Repeating Character Replacement',
    difficulty: Difficulty.MEDIUM,
    successRate: 58.4,
    pattern: CodingPattern.SLIDING_WINDOW,
    hasVisualization: false,
  },
  {
    id: 567,
    title: 'Permutation in String',
    difficulty: Difficulty.MEDIUM,
    successRate: 48.0,
    pattern: CodingPattern.SLIDING_WINDOW,
    hasVisualization: false,
  },
  {
    id: 239,
    title: 'Sliding Window Maximum',
    difficulty: Difficulty.HARD,
    successRate: 48.1,
    pattern: CodingPattern.SLIDING_WINDOW,
    hasVisualization: false,
  },

  // ========================================
  // FAST & SLOW POINTERS (Linked List)
  // ========================================
  {
    id: 141,
    title: 'Linked List Cycle',
    difficulty: Difficulty.EASY,
    successRate: 53.4,
    pattern: CodingPattern.FAST_SLOW_POINTERS,
    hasVisualization: false,
  },
  {
    id: 143,
    title: 'Reorder List',
    difficulty: Difficulty.MEDIUM,
    successRate: 63.9,
    pattern: CodingPattern.FAST_SLOW_POINTERS,
    hasVisualization: false,
  },
  {
    id: 19,
    title: 'Remove Nth Node From End of List',
    difficulty: Difficulty.MEDIUM,
    successRate: 50.3,
    pattern: CodingPattern.FAST_SLOW_POINTERS,
    hasVisualization: false,
  },

  // ========================================
  // MERGE INTERVALS
  // ========================================
  {
    id: 56,
    title: 'Merge Intervals',
    difficulty: Difficulty.MEDIUM,
    successRate: 50.5,
    pattern: CodingPattern.MERGE_INTERVALS,
    hasVisualization: false,
  },
  {
    id: 57,
    title: 'Insert Interval',
    difficulty: Difficulty.MEDIUM,
    successRate: 44.3,
    pattern: CodingPattern.MERGE_INTERVALS,
    hasVisualization: false,
  },
  {
    id: 252,
    title: 'Meeting Rooms',
    difficulty: Difficulty.EASY,
    successRate: 59.2,
    pattern: CodingPattern.MERGE_INTERVALS,
    hasVisualization: false,
  },
  {
    id: 253,
    title: 'Meeting Rooms II',
    difficulty: Difficulty.MEDIUM,
    successRate: 52.4,
    pattern: CodingPattern.MERGE_INTERVALS,
    hasVisualization: false,
  },
  {
    id: 435,
    title: 'Non-overlapping Intervals',
    difficulty: Difficulty.MEDIUM,
    successRate: 56.3,
    pattern: CodingPattern.MERGE_INTERVALS,
    hasVisualization: false,
  },

  // ========================================
  // CYCLIC SORT
  // ========================================
  {
    id: 268,
    title: 'Missing Number',
    difficulty: Difficulty.EASY,
    successRate: 71.1,
    pattern: CodingPattern.CYCLIC_SORT,
    hasVisualization: false,
  },
  {
    id: 287,
    title: 'Find the Duplicate Number',
    difficulty: Difficulty.MEDIUM,
    successRate: 63.6,
    pattern: CodingPattern.CYCLIC_SORT,
    hasVisualization: false,
  },

  // ========================================
  // IN-PLACE REVERSAL (Linked List)
  // ========================================
  {
    id: 206,
    title: 'Reverse Linked List',
    difficulty: Difficulty.EASY,
    successRate: 79.9,
    pattern: CodingPattern.IN_PLACE_REVERSAL,
    hasVisualization: false,
  },
  {
    id: 25,
    title: 'Reverse Nodes in k-Group',
    difficulty: Difficulty.HARD,
    successRate: 64.6,
    pattern: CodingPattern.IN_PLACE_REVERSAL,
    hasVisualization: false,
  },

  // ========================================
  // TREE BFS
  // ========================================
  {
    id: 102,
    title: 'Binary Tree Level Order Traversal',
    difficulty: Difficulty.MEDIUM,
    successRate: 71.7,
    pattern: CodingPattern.TREE_BFS,
    hasVisualization: false,
  },
  {
    id: 199,
    title: 'Binary Tree Right Side View',
    difficulty: Difficulty.MEDIUM,
    successRate: 68.7,
    pattern: CodingPattern.TREE_BFS,
    hasVisualization: false,
  },

  // ========================================
  // TREE DFS
  // ========================================
  {
    id: 104,
    title: 'Maximum Depth of Binary Tree',
    difficulty: Difficulty.EASY,
    successRate: 77.7,
    pattern: CodingPattern.TREE_DFS,
    hasVisualization: false,
  },
  {
    id: 100,
    title: 'Same Tree',
    difficulty: Difficulty.EASY,
    successRate: 66.1,
    pattern: CodingPattern.TREE_DFS,
    hasVisualization: false,
  },
  {
    id: 226,
    title: 'Invert Binary Tree',
    difficulty: Difficulty.EASY,
    successRate: 79.6,
    pattern: CodingPattern.TREE_DFS,
    hasVisualization: false,
  },
  {
    id: 543,
    title: 'Diameter of Binary Tree',
    difficulty: Difficulty.EASY,
    successRate: 64.6,
    pattern: CodingPattern.TREE_DFS,
    hasVisualization: false,
  },
  {
    id: 110,
    title: 'Balanced Binary Tree',
    difficulty: Difficulty.EASY,
    successRate: 56.5,
    pattern: CodingPattern.TREE_DFS,
    hasVisualization: false,
  },
  {
    id: 572,
    title: 'Subtree of Another Tree',
    difficulty: Difficulty.EASY,
    successRate: 50.8,
    pattern: CodingPattern.TREE_DFS,
    hasVisualization: false,
  },
  {
    id: 98,
    title: 'Validate Binary Search Tree',
    difficulty: Difficulty.MEDIUM,
    successRate: 35.0,
    pattern: CodingPattern.TREE_DFS,
    hasVisualization: false,
  },
  {
    id: 230,
    title: 'Kth Smallest Element in a BST',
    difficulty: Difficulty.MEDIUM,
    successRate: 76.1,
    pattern: CodingPattern.TREE_DFS,
    hasVisualization: false,
  },
  {
    id: 105,
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    difficulty: Difficulty.MEDIUM,
    successRate: 67.9,
    pattern: CodingPattern.TREE_DFS,
    hasVisualization: false,
  },
  {
    id: 124,
    title: 'Binary Tree Maximum Path Sum',
    difficulty: Difficulty.HARD,
    successRate: 41.8,
    pattern: CodingPattern.TREE_DFS,
    hasVisualization: false,
  },
  {
    id: 297,
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: Difficulty.HARD,
    successRate: 59.9,
    pattern: CodingPattern.TREE_DFS,
    hasVisualization: false,
  },
  {
    id: 1448,
    title: 'Count Good Nodes in Binary Tree',
    difficulty: Difficulty.MEDIUM,
    successRate: 73.7,
    pattern: CodingPattern.TREE_DFS,
    hasVisualization: false,
  },
  {
    id: 235,
    title: 'Lowest Common Ancestor of a Binary Search Tree',
    difficulty: Difficulty.MEDIUM,
    successRate: 69.5,
    pattern: CodingPattern.TREE_DFS,
    hasVisualization: false,
  },

  // ========================================
  // TWO HEAPS
  // ========================================
  {
    id: 295,
    title: 'Find Median from Data Stream',
    difficulty: Difficulty.HARD,
    successRate: 53.9,
    pattern: CodingPattern.TWO_HEAPS,
    hasVisualization: false,
  },

  // ========================================
  // SUBSETS / BACKTRACKING
  // ========================================
  {
    id: 78,
    title: 'Subsets',
    difficulty: Difficulty.MEDIUM,
    successRate: 81.7,
    pattern: CodingPattern.SUBSETS,
    hasVisualization: false,
  },
  {
    id: 90,
    title: 'Subsets II',
    difficulty: Difficulty.MEDIUM,
    successRate: 60.4,
    pattern: CodingPattern.SUBSETS,
    hasVisualization: false,
  },
  {
    id: 46,
    title: 'Permutations',
    difficulty: Difficulty.MEDIUM,
    successRate: 81.3,
    pattern: CodingPattern.SUBSETS,
    hasVisualization: false,
  },
  {
    id: 39,
    title: 'Combination Sum',
    difficulty: Difficulty.MEDIUM,
    successRate: 75.6,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 40,
    title: 'Combination Sum II',
    difficulty: Difficulty.MEDIUM,
    successRate: 58.5,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 79,
    title: 'Word Search',
    difficulty: Difficulty.MEDIUM,
    successRate: 46.3,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 131,
    title: 'Palindrome Partitioning',
    difficulty: Difficulty.MEDIUM,
    successRate: 73.2,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 17,
    title: 'Letter Combinations of a Phone Number',
    difficulty: Difficulty.MEDIUM,
    successRate: 64.9,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 22,
    title: 'Generate Parentheses',
    difficulty: Difficulty.MEDIUM,
    successRate: 77.9,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 51,
    title: 'N-Queens',
    difficulty: Difficulty.HARD,
    successRate: 74.3,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },

  // ========================================
  // MODIFIED BINARY SEARCH
  // ========================================
  {
    id: 704,
    title: 'Binary Search',
    difficulty: Difficulty.EASY,
    successRate: 60.2,
    pattern: CodingPattern.MODIFIED_BINARY_SEARCH,
    hasVisualization: false,
  },
  {
    id: 33,
    title: 'Search in Rotated Sorted Array',
    difficulty: Difficulty.MEDIUM,
    successRate: 43.7,
    pattern: CodingPattern.MODIFIED_BINARY_SEARCH,
    hasVisualization: false,
  },
  {
    id: 153,
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: Difficulty.MEDIUM,
    successRate: 53.4,
    pattern: CodingPattern.MODIFIED_BINARY_SEARCH,
    hasVisualization: false,
  },
  {
    id: 4,
    title: 'Median of Two Sorted Arrays',
    difficulty: Difficulty.HARD,
    successRate: 45.2,
    pattern: CodingPattern.MODIFIED_BINARY_SEARCH,
    hasVisualization: false,
  },
  {
    id: 875,
    title: 'Koko Eating Bananas',
    difficulty: Difficulty.MEDIUM,
    successRate: 49.4,
    pattern: CodingPattern.MODIFIED_BINARY_SEARCH,
    hasVisualization: false,
  },
  {
    id: 981,
    title: 'Time Based Key-Value Store',
    difficulty: Difficulty.MEDIUM,
    successRate: 49.6,
    pattern: CodingPattern.MODIFIED_BINARY_SEARCH,
    hasVisualization: false,
  },

  // ========================================
  // TOP K ELEMENTS
  // ========================================
  {
    id: 215,
    title: 'Kth Largest Element in an Array',
    difficulty: Difficulty.MEDIUM,
    successRate: 68.6,
    pattern: CodingPattern.TOP_K_ELEMENTS,
    hasVisualization: false,
  },
  {
    id: 347,
    title: 'Top K Frequent Elements',
    difficulty: Difficulty.MEDIUM,
    successRate: 65.2,
    pattern: CodingPattern.TOP_K_ELEMENTS,
    hasVisualization: false,
  },
  {
    id: 703,
    title: 'Kth Largest Element in a Stream',
    difficulty: Difficulty.EASY,
    successRate: 60.4,
    pattern: CodingPattern.TOP_K_ELEMENTS,
    hasVisualization: false,
  },
  {
    id: 973,
    title: 'K Closest Points to Origin',
    difficulty: Difficulty.MEDIUM,
    successRate: 68.5,
    pattern: CodingPattern.TOP_K_ELEMENTS,
    hasVisualization: false,
  },
  {
    id: 1046,
    title: 'Last Stone Weight',
    difficulty: Difficulty.EASY,
    successRate: 66.2,
    pattern: CodingPattern.TOP_K_ELEMENTS,
    hasVisualization: false,
  },

  // ========================================
  // K-WAY MERGE
  // ========================================
  {
    id: 21,
    title: 'Merge Two Sorted Lists',
    difficulty: Difficulty.EASY,
    successRate: 67.5,
    pattern: CodingPattern.K_WAY_MERGE,
    hasVisualization: false,
  },
  {
    id: 23,
    title: 'Merge k Sorted Lists',
    difficulty: Difficulty.HARD,
    successRate: 58.2,
    pattern: CodingPattern.K_WAY_MERGE,
    hasVisualization: false,
  },

  // ========================================
  // TOPOLOGICAL SORT / GRAPH
  // ========================================
  {
    id: 207,
    title: 'Course Schedule',
    difficulty: Difficulty.MEDIUM,
    successRate: 50.3,
    pattern: CodingPattern.TOPOLOGICAL_SORT,
    hasVisualization: false,
  },
  {
    id: 210,
    title: 'Course Schedule II',
    difficulty: Difficulty.MEDIUM,
    successRate: 54.5,
    pattern: CodingPattern.TOPOLOGICAL_SORT,
    hasVisualization: false,
  },
  {
    id: 269,
    title: 'Alien Dictionary',
    difficulty: Difficulty.HARD,
    successRate: 36.9,
    pattern: CodingPattern.TOPOLOGICAL_SORT,
    hasVisualization: false,
  },
  {
    id: 332,
    title: 'Reconstruct Itinerary',
    difficulty: Difficulty.HARD,
    successRate: 44.0,
    pattern: CodingPattern.TOPOLOGICAL_SORT,
    hasVisualization: false,
  },

  // ========================================
  // GRAPH
  // ========================================
  {
    id: 200,
    title: 'Number of Islands',
    difficulty: Difficulty.MEDIUM,
    successRate: 63.3,
    pattern: CodingPattern.GRAPH,
    hasVisualization: false,
  },
  {
    id: 133,
    title: 'Clone Graph',
    difficulty: Difficulty.MEDIUM,
    successRate: 64.0,
    pattern: CodingPattern.GRAPH,
    hasVisualization: false,
  },
  {
    id: 417,
    title: 'Pacific Atlantic Water Flow',
    difficulty: Difficulty.MEDIUM,
    successRate: 60.2,
    pattern: CodingPattern.GRAPH,
    hasVisualization: false,
  },
  {
    id: 130,
    title: 'Surrounded Regions',
    difficulty: Difficulty.MEDIUM,
    successRate: 44.2,
    pattern: CodingPattern.GRAPH,
    hasVisualization: false,
  },
  {
    id: 994,
    title: 'Rotting Oranges',
    difficulty: Difficulty.MEDIUM,
    successRate: 57.7,
    pattern: CodingPattern.GRAPH,
    hasVisualization: false,
  },
  {
    id: 695,
    title: 'Max Area of Island',
    difficulty: Difficulty.MEDIUM,
    successRate: 73.6,
    pattern: CodingPattern.GRAPH,
    hasVisualization: false,
  },
  {
    id: 127,
    title: 'Word Ladder',
    difficulty: Difficulty.HARD,
    successRate: 44.2,
    pattern: CodingPattern.GRAPH,
    hasVisualization: false,
  },
  {
    id: 261,
    title: 'Graph Valid Tree',
    difficulty: Difficulty.MEDIUM,
    successRate: 49.6,
    pattern: CodingPattern.GRAPH,
    hasVisualization: false,
  },
  {
    id: 323,
    title: 'Number of Connected Components in an Undirected Graph',
    difficulty: Difficulty.MEDIUM,
    successRate: 64.6,
    pattern: CodingPattern.GRAPH,
    hasVisualization: false,
  },
  {
    id: 684,
    title: 'Redundant Connection',
    difficulty: Difficulty.MEDIUM,
    successRate: 67.0,
    pattern: CodingPattern.GRAPH,
    hasVisualization: false,
  },
  {
    id: 743,
    title: 'Network Delay Time',
    difficulty: Difficulty.MEDIUM,
    successRate: 59.0,
    pattern: CodingPattern.GRAPH,
    hasVisualization: false,
  },
  {
    id: 778,
    title: 'Swim in Rising Water',
    difficulty: Difficulty.HARD,
    successRate: 67.3,
    pattern: CodingPattern.GRAPH,
    hasVisualization: false,
  },
  {
    id: 787,
    title: 'Cheapest Flights Within K Stops',
    difficulty: Difficulty.MEDIUM,
    successRate: 41.0,
    pattern: CodingPattern.GRAPH,
    hasVisualization: false,
  },
  {
    id: 1584,
    title: 'Min Cost to Connect All Points',
    difficulty: Difficulty.MEDIUM,
    successRate: 69.9,
    pattern: CodingPattern.GRAPH,
    hasVisualization: false,
  },

  // ========================================
  // DYNAMIC PROGRAMMING
  // ========================================
  {
    id: 70,
    title: 'Climbing Stairs',
    difficulty: Difficulty.EASY,
    successRate: 53.8,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 198,
    title: 'House Robber',
    difficulty: Difficulty.MEDIUM,
    successRate: 52.7,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 213,
    title: 'House Robber II',
    difficulty: Difficulty.MEDIUM,
    successRate: 44.3,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 5,
    title: 'Longest Palindromic Substring',
    difficulty: Difficulty.MEDIUM,
    successRate: 36.8,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 647,
    title: 'Palindromic Substrings',
    difficulty: Difficulty.MEDIUM,
    successRate: 72.3,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 91,
    title: 'Decode Ways',
    difficulty: Difficulty.MEDIUM,
    successRate: 37.3,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 322,
    title: 'Coin Change',
    difficulty: Difficulty.MEDIUM,
    successRate: 47.5,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 518,
    title: 'Coin Change II',
    difficulty: Difficulty.MEDIUM,
    successRate: 60.9,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 152,
    title: 'Maximum Product Subarray',
    difficulty: Difficulty.MEDIUM,
    successRate: 35.6,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 139,
    title: 'Word Break',
    difficulty: Difficulty.MEDIUM,
    successRate: 48.8,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 300,
    title: 'Longest Increasing Subsequence',
    difficulty: Difficulty.MEDIUM,
    successRate: 58.7,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 416,
    title: 'Partition Equal Subset Sum',
    difficulty: Difficulty.MEDIUM,
    successRate: 49.0,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 62,
    title: 'Unique Paths',
    difficulty: Difficulty.MEDIUM,
    successRate: 66.3,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 55,
    title: 'Jump Game',
    difficulty: Difficulty.MEDIUM,
    successRate: 40.1,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 45,
    title: 'Jump Game II',
    difficulty: Difficulty.MEDIUM,
    successRate: 42.1,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 746,
    title: 'Min Cost Climbing Stairs',
    difficulty: Difficulty.EASY,
    successRate: 67.8,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 1143,
    title: 'Longest Common Subsequence',
    difficulty: Difficulty.MEDIUM,
    successRate: 58.6,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 72,
    title: 'Edit Distance',
    difficulty: Difficulty.MEDIUM,
    successRate: 59.7,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 494,
    title: 'Target Sum',
    difficulty: Difficulty.MEDIUM,
    successRate: 51.5,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 97,
    title: 'Interleaving String',
    difficulty: Difficulty.MEDIUM,
    successRate: 43.1,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 115,
    title: 'Distinct Subsequences',
    difficulty: Difficulty.HARD,
    successRate: 51.1,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 312,
    title: 'Burst Balloons',
    difficulty: Difficulty.HARD,
    successRate: 62.5,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 10,
    title: 'Regular Expression Matching',
    difficulty: Difficulty.HARD,
    successRate: 30.0,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 329,
    title: 'Longest Increasing Path in a Matrix',
    difficulty: Difficulty.HARD,
    successRate: 56.0,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 309,
    title: 'Best Time to Buy and Sell Stock with Cooldown',
    difficulty: Difficulty.MEDIUM,
    successRate: 61.3,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 121,
    title: 'Best Time to Buy and Sell Stock',
    difficulty: Difficulty.EASY,
    successRate: 56.0,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 53,
    title: 'Maximum Subarray',
    difficulty: Difficulty.MEDIUM,
    successRate: 52.7,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 128,
    title: 'Longest Consecutive Sequence',
    difficulty: Difficulty.MEDIUM,
    successRate: 47.0,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },

  // Additional problems (miscellaneous/utility)
  {
    id: 20,
    title: 'Valid Parentheses',
    difficulty: Difficulty.EASY,
    successRate: 43.2,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 150,
    title: 'Evaluate Reverse Polish Notation',
    difficulty: Difficulty.MEDIUM,
    successRate: 56.2,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 155,
    title: 'Min Stack',
    difficulty: Difficulty.MEDIUM,
    successRate: 57.3,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 739,
    title: 'Daily Temperatures',
    difficulty: Difficulty.MEDIUM,
    successRate: 67.9,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 853,
    title: 'Car Fleet',
    difficulty: Difficulty.MEDIUM,
    successRate: 54.3,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 84,
    title: 'Largest Rectangle in Histogram',
    difficulty: Difficulty.HARD,
    successRate: 48.7,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 621,
    title: 'Task Scheduler',
    difficulty: Difficulty.MEDIUM,
    successRate: 62.3,
    pattern: CodingPattern.TOP_K_ELEMENTS,
    hasVisualization: false,
  },
  {
    id: 355,
    title: 'Design Twitter',
    difficulty: Difficulty.MEDIUM,
    successRate: 43.7,
    pattern: CodingPattern.TOP_K_ELEMENTS,
    hasVisualization: false,
  },
  {
    id: 763,
    title: 'Partition Labels',
    difficulty: Difficulty.MEDIUM,
    successRate: 81.7,
    pattern: CodingPattern.MERGE_INTERVALS,
    hasVisualization: false,
  },
  {
    id: 846,
    title: 'Hand of Straights',
    difficulty: Difficulty.MEDIUM,
    successRate: 57.6,
    pattern: CodingPattern.MERGE_INTERVALS,
    hasVisualization: false,
  },
  {
    id: 1899,
    title: 'Merge Triplets to Form Target Triplet',
    difficulty: Difficulty.MEDIUM,
    successRate: 68.5,
    pattern: CodingPattern.MERGE_INTERVALS,
    hasVisualization: false,
  },
  {
    id: 1851,
    title: 'Minimum Interval to Include Each Query',
    difficulty: Difficulty.HARD,
    successRate: 53.4,
    pattern: CodingPattern.MERGE_INTERVALS,
    hasVisualization: false,
  },
  {
    id: 678,
    title: 'Valid Parenthesis String',
    difficulty: Difficulty.MEDIUM,
    successRate: 39.6,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 134,
    title: 'Gas Station',
    difficulty: Difficulty.MEDIUM,
    successRate: 47.1,
    pattern: CodingPattern.TWO_POINTERS,
    hasVisualization: false,
  },
  {
    id: 48,
    title: 'Rotate Image',
    difficulty: Difficulty.MEDIUM,
    successRate: 78.9,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 54,
    title: 'Spiral Matrix',
    difficulty: Difficulty.MEDIUM,
    successRate: 55.4,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 73,
    title: 'Set Matrix Zeroes',
    difficulty: Difficulty.MEDIUM,
    successRate: 61.9,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 202,
    title: 'Happy Number',
    difficulty: Difficulty.EASY,
    successRate: 58.9,
    pattern: CodingPattern.FAST_SLOW_POINTERS,
    hasVisualization: false,
  },
  {
    id: 66,
    title: 'Plus One',
    difficulty: Difficulty.EASY,
    successRate: 48.3,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 136,
    title: 'Single Number',
    difficulty: Difficulty.EASY,
    successRate: 76.9,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 190,
    title: 'Reverse Bits',
    difficulty: Difficulty.EASY,
    successRate: 65.0,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 191,
    title: 'Number of 1 Bits',
    difficulty: Difficulty.EASY,
    successRate: 75.7,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 217,
    title: 'Contains Duplicate',
    difficulty: Difficulty.EASY,
    successRate: 63.8,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 242,
    title: 'Valid Anagram',
    difficulty: Difficulty.EASY,
    successRate: 67.4,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 49,
    title: 'Group Anagrams',
    difficulty: Difficulty.MEDIUM,
    successRate: 71.7,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 238,
    title: 'Product of Array Except Self',
    difficulty: Difficulty.MEDIUM,
    successRate: 68.3,
    pattern: CodingPattern.TWO_POINTERS,
    hasVisualization: false,
  },
  {
    id: 36,
    title: 'Valid Sudoku',
    difficulty: Difficulty.MEDIUM,
    successRate: 63.8,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 271,
    title: 'Encode and Decode Strings',
    difficulty: Difficulty.MEDIUM,
    successRate: 50.7,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 74,
    title: 'Search a 2D Matrix',
    difficulty: Difficulty.MEDIUM,
    successRate: 53.1,
    pattern: CodingPattern.MODIFIED_BINARY_SEARCH,
    hasVisualization: false,
  },
  {
    id: 208,
    title: 'Implement Trie (Prefix Tree)',
    difficulty: Difficulty.MEDIUM,
    successRate: 68.8,
    pattern: CodingPattern.TREE_DFS,
    hasVisualization: false,
  },
  {
    id: 211,
    title: 'Design Add and Search Words Data Structure',
    difficulty: Difficulty.MEDIUM,
    successRate: 47.8,
    pattern: CodingPattern.TREE_DFS,
    hasVisualization: false,
  },
  {
    id: 212,
    title: 'Word Search II',
    difficulty: Difficulty.HARD,
    successRate: 37.8,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 146,
    title: 'LRU Cache',
    difficulty: Difficulty.MEDIUM,
    successRate: 46.3,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 138,
    title: 'Copy List with Random Pointer',
    difficulty: Difficulty.MEDIUM,
    successRate: 61.8,
    pattern: CodingPattern.FAST_SLOW_POINTERS,
    hasVisualization: false,
  },
  {
    id: 2,
    title: 'Add Two Numbers',
    difficulty: Difficulty.MEDIUM,
    successRate: 47.3,
    pattern: CodingPattern.FAST_SLOW_POINTERS,
    hasVisualization: false,
  },
  {
    id: 7,
    title: 'Reverse Integer',
    difficulty: Difficulty.MEDIUM,
    successRate: 31.1,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 43,
    title: 'Multiply Strings',
    difficulty: Difficulty.MEDIUM,
    successRate: 43.1,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 50,
    title: 'Pow(x, n)',
    difficulty: Difficulty.MEDIUM,
    successRate: 37.9,
    pattern: CodingPattern.MODIFIED_BINARY_SEARCH,
    hasVisualization: false,
  },
  {
    id: 286,
    title: 'Walls and Gates',
    difficulty: Difficulty.MEDIUM,
    successRate: 63.4,
    pattern: CodingPattern.GRAPH,
    hasVisualization: false,
  },
  {
    id: 338,
    title: 'Counting Bits',
    difficulty: Difficulty.EASY,
    successRate: 80.2,
    pattern: CodingPattern.DYNAMIC_PROGRAMMING,
    hasVisualization: false,
  },
  {
    id: 371,
    title: 'Sum of Two Integers',
    difficulty: Difficulty.MEDIUM,
    successRate: 54.6,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
  {
    id: 2013,
    title: 'Detect Squares',
    difficulty: Difficulty.MEDIUM,
    successRate: 52.0,
    pattern: CodingPattern.BACKTRACKING,
    hasVisualization: false,
  },
];

/**
 * Get problems by pattern
 */
export function getProblemsByPattern(pattern: CodingPattern): Problem[] {
  return LEETCODE_PROBLEMS.filter((p) => p.pattern === pattern);
}

/**
 * Get problems by difficulty
 */
export function getProblemsByDifficulty(difficulty: Difficulty): Problem[] {
  return LEETCODE_PROBLEMS.filter((p) => p.difficulty === difficulty);
}

/**
 * Get problems with visualization
 */
export function getVisualizableProblems(): Problem[] {
  return LEETCODE_PROBLEMS.filter((p) => p.hasVisualization);
}

/**
 * Get problem by ID
 */
export function getProblemById(id: number): Problem | undefined {
  return LEETCODE_PROBLEMS.find((p) => p.id === id);
}

/**
 * Get difficulty stats
 */
export function getDifficultyStats(): Record<Difficulty, number> {
  return {
    [Difficulty.EASY]: LEETCODE_PROBLEMS.filter((p) => p.difficulty === Difficulty.EASY).length,
    [Difficulty.MEDIUM]: LEETCODE_PROBLEMS.filter((p) => p.difficulty === Difficulty.MEDIUM).length,
    [Difficulty.HARD]: LEETCODE_PROBLEMS.filter((p) => p.difficulty === Difficulty.HARD).length,
  };
}

/**
 * Get pattern stats
 */
export function getPatternStats(): Record<CodingPattern, number> {
  const stats: any = {};
  Object.values(CodingPattern).forEach((pattern) => {
    stats[pattern] = LEETCODE_PROBLEMS.filter((p) => p.pattern === pattern).length;
  });
  return stats;
}
