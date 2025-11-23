import { Injectable } from '@angular/core';
import { PatternStep } from '../models/pattern.model';

@Injectable({
  providedIn: 'root'
})
export class SlidingWindowService {

  /**
   * Find maximum sum of k consecutive elements
   */
  maxSumSubarray(arr: number[], k: number): PatternStep[] {
    const steps: PatternStep[] = [];

    if (arr.length < k) {
      steps.push({
        description: `❌ Array too small! Need at least ${k} elements`,
        array: [...arr],
        result: null
      });
      return steps;
    }

    // Initial window
    let windowSum = 0;
    for (let i = 0; i < k; i++) {
      windowSum += arr[i];
    }

    steps.push({
      description: `📏 Creating window of size ${k}`,
      array: [...arr],
      windowStart: 0,
      windowEnd: k - 1,
      currentSum: windowSum,
      highlight: Array.from({ length: k }, (_, i) => i)
    });

    let maxSum = windowSum;
    let maxStart = 0;

    // Slide the window
    for (let i = k; i < arr.length; i++) {
      const removed = arr[i - k];
      const added = arr[i];

      windowSum = windowSum - removed + added;

      steps.push({
        description: `Sliding: Remove ${removed}, Add ${added}. Sum = ${windowSum}`,
        array: [...arr],
        windowStart: i - k + 1,
        windowEnd: i,
        currentSum: windowSum,
        highlight: Array.from({ length: k }, (_, idx) => i - k + 1 + idx)
      });

      if (windowSum > maxSum) {
        maxSum = windowSum;
        maxStart = i - k + 1;

        steps.push({
          description: `🎉 New maximum found! Sum = ${maxSum}`,
          array: [...arr],
          windowStart: maxStart,
          windowEnd: i,
          currentSum: maxSum,
          highlight: Array.from({ length: k }, (_, idx) => maxStart + idx)
        });
      }
    }

    steps.push({
      description: `✅ Maximum sum is ${maxSum}`,
      array: [...arr],
      windowStart: maxStart,
      windowEnd: maxStart + k - 1,
      currentSum: maxSum,
      result: maxSum,
      highlight: Array.from({ length: k }, (_, idx) => maxStart + idx)
    });

    return steps;
  }

  /**
   * Find smallest subarray with sum >= target
   */
  minSubarrayLength(arr: number[], target: number): PatternStep[] {
    const steps: PatternStep[] = [];
    let windowStart = 0;
    let windowSum = 0;
    let minLength = Infinity;
    let minStart = 0;

    steps.push({
      description: `🎯 Finding smallest subarray with sum ≥ ${target}`,
      array: [...arr],
      windowStart: 0,
      windowEnd: 0,
      targetSum: target,
      currentSum: 0
    });

    for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {
      windowSum += arr[windowEnd];

      steps.push({
        description: `Expanding window: Add ${arr[windowEnd]}. Sum = ${windowSum}`,
        array: [...arr],
        windowStart,
        windowEnd,
        currentSum: windowSum,
        targetSum: target,
        highlight: Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i)
      });

      while (windowSum >= target && windowStart <= windowEnd) {
        const currentLength = windowEnd - windowStart + 1;

        if (currentLength < minLength) {
          minLength = currentLength;
          minStart = windowStart;

          steps.push({
            description: `🎉 New minimum length: ${minLength}. Sum = ${windowSum}`,
            array: [...arr],
            windowStart,
            windowEnd,
            currentSum: windowSum,
            targetSum: target,
            highlight: Array.from({ length: currentLength }, (_, i) => windowStart + i)
          });
        }

        windowSum -= arr[windowStart];
        windowStart++;

        if (windowStart <= windowEnd) {
          steps.push({
            description: `Shrinking window: Remove ${arr[windowStart - 1]}. Sum = ${windowSum}`,
            array: [...arr],
            windowStart,
            windowEnd,
            currentSum: windowSum,
            targetSum: target,
            highlight: Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i)
          });
        }
      }
    }

    if (minLength === Infinity) {
      steps.push({
        description: '❌ No subarray found with sum ≥ target',
        array: [...arr],
        result: 0
      });
    } else {
      steps.push({
        description: `✅ Minimum length is ${minLength}`,
        array: [...arr],
        windowStart: minStart,
        windowEnd: minStart + minLength - 1,
        result: minLength,
        highlight: Array.from({ length: minLength }, (_, i) => minStart + i)
      });
    }

    return steps;
  }
}
