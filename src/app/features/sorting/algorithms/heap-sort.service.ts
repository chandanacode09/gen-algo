import { Injectable } from '@angular/core';
import { BaseSortingAlgorithm } from '../../../core/services/algorithm-executor.service';
import {
  AlgorithmStep,
  AlgorithmMetadata,
  AlgorithmCategory,
  OperationType
} from '../../../core/models';

/**
 * Heap Sort Algorithm Implementation
 */
@Injectable({
  providedIn: 'root'
})
export class HeapSortService extends BaseSortingAlgorithm {
  private steps: AlgorithmStep[] = [];

  getMetadata(): AlgorithmMetadata {
    return {
      id: 'heap-sort',
      name: 'Heap Sort',
      category: AlgorithmCategory.SORTING,
      description: 'An efficient comparison-based sorting algorithm that uses a binary heap data structure to sort elements.',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(1)',
      isStable: false,
      isInPlace: true,
      difficulty: 4,
      pseudocode: [
        'function heapSort(arr):',
        '  buildMaxHeap(arr)',
        '  for i = n-1 down to 1:',
        '    swap arr[0] and arr[i]',
        '    heapify(arr, 0, i)',
        '',
        'function heapify(arr, i, size):',
        '  largest = i',
        '  left = 2 * i + 1',
        '  right = 2 * i + 2',
        '  if left < size and arr[left] > arr[largest]:',
        '    largest = left',
        '  if right < size and arr[right] > arr[largest]:',
        '    largest = right',
        '  if largest != i:',
        '    swap arr[i] and arr[largest]',
        '    heapify(arr, largest, size)'
      ]
    };
  }

  execute(input: number[]): AlgorithmStep[] {
    if (!this.validateInput(input)) {
      throw new Error('Invalid input for Heap Sort');
    }

    this.steps = [];
    const arr = this.copyArray(input);
    const n = arr.length;

    this.steps.push({
      operationType: OperationType.HIGHLIGHT,
      indices: [],
      array: this.copyArray(arr),
      description: 'Starting Heap Sort',
      codeLine: 0
    });

    // Build max heap
    this.steps.push({
      operationType: OperationType.HIGHLIGHT,
      indices: [],
      array: this.copyArray(arr),
      description: 'Building max heap',
      codeLine: 1
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapify(arr, n, i);
    }

    this.steps.push({
      operationType: OperationType.HIGHLIGHT,
      indices: [],
      array: this.copyArray(arr),
      description: 'Max heap built. Starting extraction phase',
      codeLine: 2
    });

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      // Move current root to end
      this.swap(arr, 0, i);

      this.steps.push({
        operationType: OperationType.SWAP,
        indices: [0, i],
        array: this.copyArray(arr),
        description: `Moving max element ${arr[i]} to position ${i}`,
        codeLine: 3
      });

      this.steps.push({
        operationType: OperationType.MARK_SORTED,
        indices: [i],
        array: this.copyArray(arr),
        description: `Element ${arr[i]} is now in its final position`,
        codeLine: -1
      });

      // Heapify the reduced heap
      this.heapify(arr, i, 0);
    }

    this.steps.push({
      operationType: OperationType.MARK_SORTED,
      indices: [0],
      array: this.copyArray(arr),
      description: `Element ${arr[0]} is now in its final position`,
      codeLine: -1
    });

    this.steps.push({
      operationType: OperationType.HIGHLIGHT,
      indices: [],
      array: this.copyArray(arr),
      description: 'Heap Sort completed!',
      codeLine: -1
    });

    return this.steps;
  }

  private heapify(arr: number[], heapSize: number, rootIndex: number): void {
    let largest = rootIndex;
    const left = 2 * rootIndex + 1;
    const right = 2 * rootIndex + 2;

    // Compare with left child
    if (left < heapSize) {
      this.steps.push({
        operationType: OperationType.COMPARE,
        indices: [left, largest],
        array: this.copyArray(arr),
        description: `Comparing left child ${arr[left]} with ${arr[largest]}`,
        codeLine: 10
      });

      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    // Compare with right child
    if (right < heapSize) {
      this.steps.push({
        operationType: OperationType.COMPARE,
        indices: [right, largest],
        array: this.copyArray(arr),
        description: `Comparing right child ${arr[right]} with ${arr[largest]}`,
        codeLine: 12
      });

      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    // If largest is not root, swap and continue heapifying
    if (largest !== rootIndex) {
      this.swap(arr, rootIndex, largest);

      this.steps.push({
        operationType: OperationType.SWAP,
        indices: [rootIndex, largest],
        array: this.copyArray(arr),
        description: `Swapping ${arr[rootIndex]} with ${arr[largest]} to maintain heap property`,
        codeLine: 15
      });

      this.heapify(arr, heapSize, largest);
    }
  }
}
