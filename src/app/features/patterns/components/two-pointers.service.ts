import { Injectable } from '@angular/core';
import { PatternStep } from '../models/pattern.model';

@Injectable({
  providedIn: 'root'
})
export class TwoPointersService {

  /**
   * Find pair with target sum in sorted array
   */
  findPairWithSum(arr: number[], target: number): PatternStep[] {
    const steps: PatternStep[] = [];
    let left = 0;
    let right = arr.length - 1;

    // Initial state
    steps.push({
      description: `🎯 Looking for two numbers that add up to ${target}`,
      array: [...arr],
      pointers: [
        { index: left, name: 'left', color: '#10B981' },
        { index: right, name: 'right', color: '#EF4444' }
      ],
      targetSum: target
    });

    while (left < right) {
      const sum = arr[left] + arr[right];

      steps.push({
        description: `Checking: ${arr[left]} + ${arr[right]} = ${sum}`,
        array: [...arr],
        pointers: [
          { index: left, name: 'left', color: '#10B981' },
          { index: right, name: 'right', color: '#EF4444' }
        ],
        currentSum: sum,
        targetSum: target,
        highlight: [left, right]
      });

      if (sum === target) {
        steps.push({
          description: `🎉 Found it! ${arr[left]} + ${arr[right]} = ${target}`,
          array: [...arr],
          pointers: [
            { index: left, name: 'left', color: '#10B981' },
            { index: right, name: 'right', color: '#EF4444' }
          ],
          result: [arr[left], arr[right]],
          highlight: [left, right]
        });
        return steps;
      } else if (sum < target) {
        left++;
        steps.push({
          description: `Sum too small (${sum} < ${target}), move left pointer →`,
          array: [...arr],
          pointers: [
            { index: left, name: 'left', color: '#10B981' },
            { index: right, name: 'right', color: '#EF4444' }
          ],
          currentSum: sum,
          targetSum: target
        });
      } else {
        right--;
        steps.push({
          description: `Sum too large (${sum} > ${target}), move right pointer ←`,
          array: [...arr],
          pointers: [
            { index: left, name: 'left', color: '#10B981' },
            { index: right, name: 'right', color: '#EF4444' }
          ],
          currentSum: sum,
          targetSum: target
        });
      }
    }

    steps.push({
      description: '❌ No pair found that adds up to target',
      array: [...arr],
      pointers: [],
      result: null
    });

    return steps;
  }

  /**
   * Check if array is palindrome
   */
  isPalindrome(arr: number[]): PatternStep[] {
    const steps: PatternStep[] = [];
    let left = 0;
    let right = arr.length - 1;

    steps.push({
      description: '🔍 Checking if array is a palindrome',
      array: [...arr],
      pointers: [
        { index: left, name: 'left', color: '#10B981' },
        { index: right, name: 'right', color: '#EF4444' }
      ]
    });

    while (left < right) {
      steps.push({
        description: `Comparing ${arr[left]} and ${arr[right]}`,
        array: [...arr],
        pointers: [
          { index: left, name: 'left', color: '#10B981' },
          { index: right, name: 'right', color: '#EF4444' }
        ],
        highlight: [left, right]
      });

      if (arr[left] !== arr[right]) {
        steps.push({
          description: `❌ Not a palindrome! ${arr[left]} ≠ ${arr[right]}`,
          array: [...arr],
          pointers: [
            { index: left, name: 'left', color: '#10B981' },
            { index: right, name: 'right', color: '#EF4444' }
          ],
          result: false,
          highlight: [left, right]
        });
        return steps;
      }

      left++;
      right--;

      if (left < right) {
        steps.push({
          description: 'Match! Moving pointers inward →←',
          array: [...arr],
          pointers: [
            { index: left, name: 'left', color: '#10B981' },
            { index: right, name: 'right', color: '#EF4444' }
          ]
        });
      }
    }

    steps.push({
      description: '✅ It\'s a palindrome!',
      array: [...arr],
      pointers: [],
      result: true
    });

    return steps;
  }
}
