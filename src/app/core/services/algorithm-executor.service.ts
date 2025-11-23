import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlgorithmStep, AlgorithmMetadata } from '../models';

/**
 * Abstract base class for algorithm executors
 */
@Injectable()
export abstract class AlgorithmExecutorService {
  /**
   * Get metadata about the algorithm
   */
  abstract getMetadata(): AlgorithmMetadata;

  /**
   * Execute the algorithm and return steps
   * @param input Input data for the algorithm
   * @returns Array of algorithm steps
   */
  abstract execute(input: any): AlgorithmStep[];

  /**
   * Generate initial data for the algorithm
   * @param size Size of the data set
   * @param type Type of data to generate (random, sorted, reversed, etc.)
   */
  abstract generateData(size: number, type: string): any;

  /**
   * Validate input data
   * @param input Input data to validate
   */
  abstract validateInput(input: any): boolean;
}

/**
 * Base implementation with common utilities
 */
@Injectable()
export abstract class BaseSortingAlgorithm extends AlgorithmExecutorService {
  /**
   * Generate array data
   */
  generateData(size: number, type: string = 'random'): number[] {
    switch (type) {
      case 'random':
        return this.generateRandomArray(size);
      case 'sorted':
        return this.generateSortedArray(size);
      case 'reversed':
        return this.generateReversedArray(size);
      case 'nearly-sorted':
        return this.generateNearlySortedArray(size);
      default:
        return this.generateRandomArray(size);
    }
  }

  /**
   * Validate input array
   */
  validateInput(input: number[]): boolean {
    return Array.isArray(input) && input.length > 0 && input.every(n => typeof n === 'number');
  }

  /**
   * Generate random array
   */
  protected generateRandomArray(size: number): number[] {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
  }

  /**
   * Generate sorted array
   */
  protected generateSortedArray(size: number): number[] {
    return Array.from({ length: size }, (_, i) => i + 1);
  }

  /**
   * Generate reversed array
   */
  protected generateReversedArray(size: number): number[] {
    return Array.from({ length: size }, (_, i) => size - i);
  }

  /**
   * Generate nearly sorted array (90% sorted)
   */
  protected generateNearlySortedArray(size: number): number[] {
    const arr = this.generateSortedArray(size);
    const swapCount = Math.floor(size * 0.1);

    for (let i = 0; i < swapCount; i++) {
      const idx1 = Math.floor(Math.random() * size);
      const idx2 = Math.floor(Math.random() * size);
      [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
    }

    return arr;
  }

  /**
   * Helper to create a copy of array
   */
  protected copyArray(arr: number[]): number[] {
    return [...arr];
  }

  /**
   * Helper to swap elements (for step recording)
   */
  protected swap(arr: number[], i: number, j: number): void {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
