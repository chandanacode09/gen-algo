import { Injectable } from '@angular/core';
import { BaseSortingAlgorithm } from '../../../core/services/algorithm-executor.service';
import {
  AlgorithmStep,
  AlgorithmMetadata,
  AlgorithmCategory,
  OperationType
} from '../../../core/models';

/**
 * Bubble Sort Algorithm Implementation
 */
@Injectable({
  providedIn: 'root'
})
export class BubbleSortService extends BaseSortingAlgorithm {
  getMetadata(): AlgorithmMetadata {
    return {
      id: 'bubble-sort',
      name: 'Bubble Sort',
      category: AlgorithmCategory.SORTING,
      description: 'A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      isStable: true,
      isInPlace: true,
      difficulty: 1,
      pseudocode: [
        'for i = 0 to n-1:',
        '  for j = 0 to n-i-2:',
        '    if arr[j] > arr[j+1]:',
        '      swap arr[j] and arr[j+1]',
        '  mark arr[n-i-1] as sorted'
      ]
    };
  }

  execute(input: number[]): AlgorithmStep[] {
    if (!this.validateInput(input)) {
      throw new Error('Invalid input for Bubble Sort');
    }

    const steps: AlgorithmStep[] = [];
    const arr = this.copyArray(input);
    const n = arr.length;

    // Initial state
    steps.push({
      operationType: OperationType.HIGHLIGHT,
      indices: [],
      array: this.copyArray(arr),
      description: 'Starting Bubble Sort',
      codeLine: 0
    });

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        // Compare adjacent elements
        steps.push({
          operationType: OperationType.COMPARE,
          indices: [j, j + 1],
          array: this.copyArray(arr),
          description: `Comparing ${arr[j]} and ${arr[j + 1]}`,
          codeLine: 2
        });

        if (arr[j] > arr[j + 1]) {
          // Swap elements
          this.swap(arr, j, j + 1);
          swapped = true;

          steps.push({
            operationType: OperationType.SWAP,
            indices: [j, j + 1],
            array: this.copyArray(arr),
            description: `Swapping ${arr[j + 1]} and ${arr[j]}`,
            codeLine: 3
          });
        }
      }

      // Mark the last element as sorted
      steps.push({
        operationType: OperationType.MARK_SORTED,
        indices: [n - i - 1],
        array: this.copyArray(arr),
        description: `Element ${arr[n - i - 1]} is now in its final position`,
        codeLine: 4
      });

      // Early termination if no swaps occurred
      if (!swapped) {
        // Mark remaining elements as sorted
        for (let k = 0; k < n - i - 1; k++) {
          steps.push({
            operationType: OperationType.MARK_SORTED,
            indices: [k],
            array: this.copyArray(arr),
            description: `Array is sorted. Marking element ${arr[k]} as sorted`,
            codeLine: 4
          });
        }
        break;
      }
    }

    // Final step
    steps.push({
      operationType: OperationType.HIGHLIGHT,
      indices: [],
      array: this.copyArray(arr),
      description: 'Bubble Sort completed!',
      codeLine: -1
    });

    return steps;
  }
}
