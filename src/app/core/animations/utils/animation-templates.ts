/**
 * Animation templates
 * Pre-built animation sequences for common patterns
 */

import {
  AnimationStep,
  ElementState,
  PointerType,
  ComparisonOp,
} from '../models';
import {
  highlight,
  unhighlight,
  compare,
  swap,
  pulse,
  movePointer,
  createPointer,
  removePointer,
  createWindow,
  expandWindow,
  shrinkWindow,
  slideWindow,
  parallel,
} from './animation-builders';

/**
 * Template: Initialize two pointers (left and right)
 */
export function initializeTwoPointers(
  leftIndex: number,
  rightIndex: number
): AnimationStep[] {
  return [
    createPointer(
      PointerType.LEFT,
      leftIndex,
      'Initialize left pointer at start',
      { label: 'L', color: '#3b82f6' }
    ),
    createPointer(
      PointerType.RIGHT,
      rightIndex,
      'Initialize right pointer at end',
      { label: 'R', color: '#ef4444' }
    ),
    parallel(
      highlight(
        [leftIndex],
        ElementState.POINTER_LEFT,
        'Highlight left pointer position'
      )
    ),
    highlight(
      [rightIndex],
      ElementState.POINTER_RIGHT,
      'Highlight right pointer position'
    ),
  ];
}

/**
 * Template: Compare two elements with pointers
 */
export function compareTwoPointerElements(
  leftIndex: number,
  rightIndex: number,
  operation: ComparisonOp,
  result?: any,
  showValue: boolean = true
): AnimationStep[] {
  return [
    parallel(
      highlight(
        [leftIndex, rightIndex],
        ElementState.COMPARING,
        'Compare elements'
      )
    ),
    compare([leftIndex, rightIndex], operation, 'Comparing values', {
      showValue,
      result,
      duration: 600,
    }),
  ];
}

/**
 * Template: Move two pointers toward each other
 */
export function movePointersInward(
  newLeftIndex: number,
  newRightIndex: number
): AnimationStep[] {
  return [
    parallel(
      movePointer(
        PointerType.LEFT,
        newLeftIndex,
        'Move left pointer forward'
      )
    ),
    movePointer(PointerType.RIGHT, newRightIndex, 'Move right pointer backward'),
    parallel(
      highlight(
        [newLeftIndex],
        ElementState.POINTER_LEFT,
        'Update left highlight'
      )
    ),
    highlight(
      [newRightIndex],
      ElementState.POINTER_RIGHT,
      'Update right highlight'
    ),
  ];
}

/**
 * Template: Found solution with two pointers
 */
export function foundTwoPointerSolution(
  leftIndex: number,
  rightIndex: number
): AnimationStep[] {
  return [
    parallel(pulse([leftIndex, rightIndex], 'Solution found!', { cycles: 2 })),
    highlight([leftIndex, rightIndex], ElementState.RESULT, 'Mark as result'),
  ];
}

/**
 * Template: Initialize sliding window
 */
export function initializeSlidingWindow(
  start: number,
  end: number,
  windowSize?: number
): AnimationStep[] {
  const desc = windowSize
    ? `Create sliding window of size ${windowSize}`
    : `Create sliding window from ${start} to ${end}`;

  return [
    createWindow(start, end, desc),
    highlight(
      Array.from({ length: end - start + 1 }, (_, i) => start + i),
      ElementState.IN_WINDOW,
      'Highlight window elements'
    ),
  ];
}

/**
 * Template: Expand sliding window to the right
 */
export function expandWindowRight(
  currentEnd: number,
  newEnd: number
): AnimationStep[] {
  return [
    expandWindow(`Expand window to index ${newEnd}`, { newEnd }),
    highlight(
      [newEnd],
      ElementState.IN_WINDOW,
      'Include new element in window'
    ),
  ];
}

/**
 * Template: Shrink sliding window from the left
 */
export function shrinkWindowLeft(
  currentStart: number,
  newStart: number
): AnimationStep[] {
  return [
    highlight([currentStart], ElementState.VISITED, 'Remove from window'),
    shrinkWindow(`Shrink window from index ${newStart}`, { newStart }),
  ];
}

/**
 * Template: Slide window forward
 */
export function slideWindowForward(
  oldStart: number,
  oldEnd: number,
  newStart: number,
  newEnd: number
): AnimationStep[] {
  return [
    parallel(
      highlight([oldStart], ElementState.VISITED, 'Element leaves window')
    ),
    slideWindow(newStart, newEnd, `Slide window forward`),
    highlight([newEnd], ElementState.IN_WINDOW, 'New element enters window'),
  ];
}

/**
 * Template: Swap two elements with visual feedback
 */
export function swapWithHighlight(
  i: number,
  j: number,
  reason?: string
): AnimationStep[] {
  const desc = reason || `Swap positions ${i} and ${j}`;
  return [
    highlight([i, j], ElementState.COMPARING, 'Select elements to swap'),
    swap(i, j, desc, { duration: 700 }),
    unhighlight([i, j], 'Reset after swap'),
  ];
}

/**
 * Template: Mark element as visited/processed
 */
export function markVisited(index: number): AnimationStep[] {
  return [
    highlight([index], ElementState.VISITED, `Mark position ${index} as visited`),
  ];
}

/**
 * Template: Mark element as part of result
 */
export function markAsResult(indices: number[]): AnimationStep[] {
  return [
    pulse(indices, 'Found result!', { cycles: 1 }),
    highlight(indices, ElementState.RESULT, 'Mark as part of solution'),
  ];
}

/**
 * Template: Binary search iteration
 */
export function binarySearchStep(
  left: number,
  right: number,
  mid: number,
  target: number,
  midValue: number
): AnimationStep[] {
  const comparison =
    midValue === target
      ? ComparisonOp.EQUAL
      : midValue < target
      ? ComparisonOp.LESS_THAN
      : ComparisonOp.GREATER_THAN;

  return [
    highlight([left, right], ElementState.CANDIDATE, 'Current search range'),
    highlight([mid], ElementState.CURRENT, `Check middle element (${mid})`),
    compare([mid], comparison, `Compare ${midValue} with target ${target}`, {
      showValue: true,
    }),
  ];
}

/**
 * Template: Partition step for quicksort
 */
export function partitionStep(
  pivotIndex: number,
  compareIndex: number,
  shouldSwap: boolean,
  swapIndex?: number
): AnimationStep[] {
  const steps: AnimationStep[] = [
    highlight([pivotIndex], ElementState.PIVOT, 'Pivot element'),
    highlight([compareIndex], ElementState.COMPARING, 'Compare with pivot'),
  ];

  if (shouldSwap && swapIndex !== undefined) {
    steps.push(
      swap(compareIndex, swapIndex, 'Swap smaller element to left partition')
    );
  }

  return steps;
}

/**
 * Template: Complete animation with cleanup
 */
export function completionSequence(resultIndices?: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];

  if (resultIndices && resultIndices.length > 0) {
    steps.push(
      pulse(resultIndices, 'Algorithm complete!', { cycles: 2, duration: 800 })
    );
    steps.push(
      highlight(resultIndices, ElementState.RESULT, 'Final result highlighted')
    );
  }

  return steps;
}
