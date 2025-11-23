import { Injectable } from '@angular/core';
import { BaseSortingAlgorithm } from '../../../core/services/algorithm-executor.service';
import {
  AlgorithmStep,
  AlgorithmMetadata,
  AlgorithmCategory,
  OperationType
} from '../../../core/models';

/**
 * Merge Sort Algorithm Implementation
 */
@Injectable({
  providedIn: 'root'
})
export class MergeSortService extends BaseSortingAlgorithm {
  private steps: AlgorithmStep[] = [];

  getMetadata(): AlgorithmMetadata {
    return {
      id: 'merge-sort',
      name: 'Merge Sort',
      category: AlgorithmCategory.SORTING,
      description: 'An efficient divide-and-conquer sorting algorithm that divides the array into halves, sorts them, and then merges them back together.',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(n)',
      isStable: true,
      isInPlace: false,
      difficulty: 3,
      pseudocode: [
        'function mergeSort(arr, left, right):',
        '  if left < right:',
        '    mid = (left + right) / 2',
        '    mergeSort(arr, left, mid)',
        '    mergeSort(arr, mid + 1, right)',
        '    merge(arr, left, mid, right)',
        '',
        'function merge(arr, left, mid, right):',
        '  create temporary arrays L and R',
        '  merge L and R back into arr[left..right]'
      ]
    };
  }

  execute(input: number[]): AlgorithmStep[] {
    if (!this.validateInput(input)) {
      throw new Error('Invalid input for Merge Sort');
    }

    this.steps = [];
    const arr = this.copyArray(input);

    this.steps.push({
      operationType: OperationType.HIGHLIGHT,
      indices: [],
      array: this.copyArray(arr),
      description: 'Starting Merge Sort',
      codeLine: 0
    });

    this.mergeSortRecursive(arr, 0, arr.length - 1);

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

    this.steps.push({
      operationType: OperationType.HIGHLIGHT,
      indices: [],
      array: this.copyArray(arr),
      description: 'Merge Sort completed!',
      codeLine: -1
    });

    return this.steps;
  }

  private mergeSortRecursive(arr: number[], left: number, right: number): void {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      this.steps.push({
        operationType: OperationType.SPLIT,
        indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        array: this.copyArray(arr),
        description: `Splitting array from ${left} to ${right} at position ${mid}`,
        codeLine: 2,
        metadata: { range: { start: left, end: right } }
      });

      this.mergeSortRecursive(arr, left, mid);
      this.mergeSortRecursive(arr, mid + 1, right);
      this.merge(arr, left, mid, right);
    }
  }

  private merge(arr: number[], left: number, mid: number, right: number): void {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    this.steps.push({
      operationType: OperationType.MERGE,
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      array: this.copyArray(arr),
      description: `Merging subarrays [${left}..${mid}] and [${mid + 1}..${right}]`,
      codeLine: 5,
      metadata: { range: { start: left, end: right } }
    });

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      this.steps.push({
        operationType: OperationType.COMPARE,
        indices: [left + i, mid + 1 + j],
        array: this.copyArray(arr),
        description: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
        codeLine: 9
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }

      this.steps.push({
        operationType: OperationType.SET,
        indices: [k],
        array: this.copyArray(arr),
        description: `Placing ${arr[k]} at position ${k}`,
        codeLine: 9
      });

      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];

      this.steps.push({
        operationType: OperationType.SET,
        indices: [k],
        array: this.copyArray(arr),
        description: `Copying remaining element ${arr[k]} from left array`,
        codeLine: 9
      });

      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];

      this.steps.push({
        operationType: OperationType.SET,
        indices: [k],
        array: this.copyArray(arr),
        description: `Copying remaining element ${arr[k]} from right array`,
        codeLine: 9
      });

      j++;
      k++;
    }
  }
}
