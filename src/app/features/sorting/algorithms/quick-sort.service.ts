import { Injectable } from '@angular/core';
import { QUICK_SORT_PYTHON, QUICK_SORT_JAVA } from './code-implementations';
import { BaseSortingAlgorithm } from '../../../core/services/algorithm-executor.service';
import {
  AlgorithmStep,
  AlgorithmMetadata,
  AlgorithmCategory,
  OperationType
} from '../../../core/models';

/**
 * Quick Sort Algorithm Implementation
 */
@Injectable({
  providedIn: 'root'
})
export class QuickSortService extends BaseSortingAlgorithm {
  private steps: AlgorithmStep[] = [];

  getMetadata(): AlgorithmMetadata {
    return {
      id: 'quick-sort',
      name: 'Quick Sort',
      category: AlgorithmCategory.SORTING,
      description: 'An efficient divide-and-conquer sorting algorithm that picks a pivot element and partitions the array around it.',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(log n)',
      isStable: false,
      isInPlace: true,
      difficulty: 3,
      pseudocode: [
        'function quickSort(arr, low, high):',
        '  if low < high:',
        '    pivot_index = partition(arr, low, high)',
        '    quickSort(arr, low, pivot_index - 1)',
        '    quickSort(arr, pivot_index + 1, high)',
        '',
        'function partition(arr, low, high):',
        '  pivot = arr[high]',
        '  i = low - 1',
        '  for j = low to high - 1:',
        '    if arr[j] <= pivot:',
        '      i++',
        '      swap arr[i] and arr[j]',
        '  swap arr[i + 1] and arr[high]',
        '  return i + 1'
      ],
      codeImplementations: {
        pseudocode: [
          'function quickSort(arr, low, high):',
          '  if low < high:',
          '    pivot_index = partition(arr, low, high)',
          '    quickSort(arr, low, pivot_index - 1)',
          '    quickSort(arr, pivot_index + 1, high)',
          '',
          'function partition(arr, low, high):',
          '  pivot = arr[high]',
          '  i = low - 1',
          '  for j = low to high - 1:',
          '    if arr[j] <= pivot:',
          '      i++',
          '      swap arr[i] and arr[j]',
          '  swap arr[i + 1] and arr[high]',
          '  return i + 1'
        ],
        python: QUICK_SORT_PYTHON,
        java: QUICK_SORT_JAVA
      }
    };
  }

  execute(input: number[]): AlgorithmStep[] {
    if (!this.validateInput(input)) {
      throw new Error('Invalid input for Quick Sort');
    }

    this.steps = [];
    const arr = this.copyArray(input);

    // Initial state
    this.steps.push({
      operationType: OperationType.HIGHLIGHT,
      indices: [],
      array: this.copyArray(arr),
      description: 'Starting Quick Sort',
      codeLine: 0
    });

    this.quickSortRecursive(arr, 0, arr.length - 1);

    // Mark all as sorted
    for (let i = 0; i < arr.length; i++) {
      this.steps.push({
        operationType: OperationType.MARK_SORTED,
        indices: [i],
        array: this.copyArray(arr),
        description: `Marking element ${arr[i]} as sorted`,
        codeLine: -1
      });
    }

    // Final step
    this.steps.push({
      operationType: OperationType.HIGHLIGHT,
      indices: [],
      array: this.copyArray(arr),
      description: 'Quick Sort completed!',
      codeLine: -1
    });

    return this.steps;
  }

  private quickSortRecursive(arr: number[], low: number, high: number): void {
    if (low < high) {
      this.steps.push({
        operationType: OperationType.HIGHLIGHT,
        indices: Array.from({ length: high - low + 1 }, (_, i) => low + i),
        array: this.copyArray(arr),
        description: `Sorting subarray from index ${low} to ${high}`,
        codeLine: 1,
        metadata: { range: { start: low, end: high } }
      });

      const pivotIndex = this.partition(arr, low, high);

      // Recursively sort left partition
      this.quickSortRecursive(arr, low, pivotIndex - 1);

      // Recursively sort right partition
      this.quickSortRecursive(arr, pivotIndex + 1, high);
    } else if (low === high) {
      // Single element is already sorted
      this.steps.push({
        operationType: OperationType.MARK_SORTED,
        indices: [low],
        array: this.copyArray(arr),
        description: `Element ${arr[low]} is in its final position`,
        codeLine: -1
      });
    }
  }

  private partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];

    this.steps.push({
      operationType: OperationType.PIVOT,
      indices: [high],
      array: this.copyArray(arr),
      description: `Choosing ${pivot} (index ${high}) as pivot`,
      codeLine: 7,
      metadata: { pivot: high }
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      // Compare with pivot
      this.steps.push({
        operationType: OperationType.COMPARE,
        indices: [j, high],
        array: this.copyArray(arr),
        description: `Comparing ${arr[j]} with pivot ${pivot}`,
        codeLine: 10,
        metadata: { pivot: high }
      });

      if (arr[j] <= pivot) {
        i++;

        if (i !== j) {
          // Swap elements
          this.swap(arr, i, j);

          this.steps.push({
            operationType: OperationType.SWAP,
            indices: [i, j],
            array: this.copyArray(arr),
            description: `Swapping ${arr[i]} and ${arr[j]} (both <= pivot)`,
            codeLine: 12,
            metadata: { pivot: high }
          });
        }
      }
    }

    // Place pivot in its final position
    this.swap(arr, i + 1, high);

    this.steps.push({
      operationType: OperationType.SWAP,
      indices: [i + 1, high],
      array: this.copyArray(arr),
      description: `Placing pivot ${pivot} at index ${i + 1}`,
      codeLine: 13
    });

    this.steps.push({
      operationType: OperationType.MARK_SORTED,
      indices: [i + 1],
      array: this.copyArray(arr),
      description: `Pivot ${pivot} is now in its final position`,
      codeLine: -1
    });

    return i + 1;
  }
}
