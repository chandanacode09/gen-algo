import { Injectable } from '@angular/core';
import { BaseSortingAlgorithm } from '../../../core/services/algorithm-executor.service';
import {
  AlgorithmStep,
  AlgorithmMetadata,
  AlgorithmCategory,
  OperationType
} from '../../../core/models';

import { SELECTION_SORT_PYTHON, SELECTION_SORT_JAVA } from './code-implementations';
/**
 * Selection Sort Algorithm Implementation
 */
@Injectable({
  providedIn: 'root'
})
export class SelectionSortService extends BaseSortingAlgorithm {
  getMetadata(): AlgorithmMetadata {
    return {
      id: 'selection-sort',
      name: 'Selection Sort',
      category: AlgorithmCategory.SORTING,
      description: 'A simple comparison-based sorting algorithm that divides the list into sorted and unsorted regions, repeatedly selecting the smallest element from the unsorted region.',
      timeComplexity: {
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      isStable: false,
      isInPlace: true,
      difficulty: 1,
      pseudocode: [
        'for i = 0 to n-1:',
        '  min_index = i',
        '  for j = i+1 to n:',
        '    if arr[j] < arr[min_index]:',
        '      min_index = j',
        '  swap arr[i] and arr[min_index]',
        '  mark arr[i] as sorted'
      ]
    };
  }

  execute(input: number[]): AlgorithmStep[] {
    if (!this.validateInput(input)) {
      throw new Error('Invalid input for Selection Sort');
    }

    const steps: AlgorithmStep[] = [];
    const arr = this.copyArray(input);
    const n = arr.length;

    steps.push({
      operationType: OperationType.HIGHLIGHT,
      indices: [],
      array: this.copyArray(arr),
      description: 'Starting Selection Sort',
      codeLine: 0
    });

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;

      steps.push({
        operationType: OperationType.HIGHLIGHT,
        indices: [i],
        array: this.copyArray(arr),
        description: `Finding minimum element from index ${i} to ${n - 1}`,
        codeLine: 1
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          operationType: OperationType.COMPARE,
          indices: [j, minIndex],
          array: this.copyArray(arr),
          description: `Comparing ${arr[j]} with current minimum ${arr[minIndex]}`,
          codeLine: 3
        });

        if (arr[j] < arr[minIndex]) {
          minIndex = j;

          steps.push({
            operationType: OperationType.HIGHLIGHT,
            indices: [minIndex],
            array: this.copyArray(arr),
            description: `New minimum found: ${arr[minIndex]} at index ${minIndex}`,
            codeLine: 4
          });
        }
      }

      if (minIndex !== i) {
        this.swap(arr, i, minIndex);

        steps.push({
          operationType: OperationType.SWAP,
          indices: [i, minIndex],
          array: this.copyArray(arr),
          description: `Swapping ${arr[i]} with minimum element ${arr[minIndex]}`,
          codeLine: 5
        });
      }

      steps.push({
        operationType: OperationType.MARK_SORTED,
        indices: [i],
        array: this.copyArray(arr),
        description: `Element ${arr[i]} is now in its final position`,
        codeLine: 6
      });
    }

    // Mark last element as sorted
    steps.push({
      operationType: OperationType.MARK_SORTED,
      indices: [n - 1],
      array: this.copyArray(arr),
      description: `Element ${arr[n - 1]} is now in its final position`,
      codeLine: -1
    });

    steps.push({
      operationType: OperationType.HIGHLIGHT,
      indices: [],
      array: this.copyArray(arr),
      description: 'Selection Sort completed!',
      codeLine: -1
    });

    return steps;
  }
}
