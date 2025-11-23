import { Injectable } from '@angular/core';
import { BaseSortingAlgorithm } from '../../../core/services/algorithm-executor.service';
import {
  AlgorithmStep,
  AlgorithmMetadata,
  AlgorithmCategory,
  OperationType
} from '../../../core/models';

import { INSERTION_SORT_PYTHON, INSERTION_SORT_JAVA } from './code-implementations';
/**
 * Insertion Sort Algorithm Implementation
 */
@Injectable({
  providedIn: 'root'
})
export class InsertionSortService extends BaseSortingAlgorithm {
  getMetadata(): AlgorithmMetadata {
    return {
      id: 'insertion-sort',
      name: 'Insertion Sort',
      category: AlgorithmCategory.SORTING,
      description: 'A simple sorting algorithm that builds the final sorted array one item at a time, inserting each element into its proper position.',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      isStable: true,
      isInPlace: true,
      difficulty: 2,
      pseudocode: [
        'for i = 1 to n:',
        '  key = arr[i]',
        '  j = i - 1',
        '  while j >= 0 and arr[j] > key:',
        '    arr[j + 1] = arr[j]',
        '    j = j - 1',
        '  arr[j + 1] = key'
      ]
    };
  }

  execute(input: number[]): AlgorithmStep[] {
    if (!this.validateInput(input)) {
      throw new Error('Invalid input for Insertion Sort');
    }

    const steps: AlgorithmStep[] = [];
    const arr = this.copyArray(input);
    const n = arr.length;

    steps.push({
      operationType: OperationType.HIGHLIGHT,
      indices: [],
      array: this.copyArray(arr),
      description: 'Starting Insertion Sort',
      codeLine: 0
    });

    // First element is already "sorted"
    steps.push({
      operationType: OperationType.MARK_SORTED,
      indices: [0],
      array: this.copyArray(arr),
      description: `First element ${arr[0]} is trivially sorted`,
      codeLine: -1
    });

    for (let i = 1; i < n; i++) {
      const key = arr[i];

      steps.push({
        operationType: OperationType.HIGHLIGHT,
        indices: [i],
        array: this.copyArray(arr),
        description: `Inserting ${key} into sorted portion`,
        codeLine: 1
      });

      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        steps.push({
          operationType: OperationType.COMPARE,
          indices: [j, i],
          array: this.copyArray(arr),
          description: `Comparing ${arr[j]} with ${key}`,
          codeLine: 3
        });

        arr[j + 1] = arr[j];

        steps.push({
          operationType: OperationType.SET,
          indices: [j + 1],
          array: this.copyArray(arr),
          description: `Shifting ${arr[j + 1]} to the right`,
          codeLine: 4
        });

        j--;
      }

      arr[j + 1] = key;

      steps.push({
        operationType: OperationType.SET,
        indices: [j + 1],
        array: this.copyArray(arr),
        description: `Placing ${key} at index ${j + 1}`,
        codeLine: 6
      });

      // Mark all elements up to i as sorted
      steps.push({
        operationType: OperationType.MARK_SORTED,
        indices: [i],
        array: this.copyArray(arr),
        description: `Elements 0 to ${i} are now sorted`,
        codeLine: -1
      });
    }

    steps.push({
      operationType: OperationType.HIGHLIGHT,
      indices: [],
      array: this.copyArray(arr),
      description: 'Insertion Sort completed!',
      codeLine: -1
    });

    return steps;
  }
}
