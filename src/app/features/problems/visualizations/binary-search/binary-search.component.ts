import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

// Animation framework imports
import {
  AnimationEngineService,
  AnimationStateManager,
  AnimationValidatorService,
  SnapshotManager,
  AnimationStep,
  ElementState,
  PointerType,
  ComparisonOp,
  createPointer,
  movePointer,
  highlight,
  compare,
  pulse,
  message,
  ArrayItemComponent,
  PointerComponent,
  PlaybackControlsComponent,
  PlaybackState,
} from '../../../../core/animations';

/**
 * Binary Search Visualization
 * Classic searching algorithm - O(log n)
 *
 * Searches for a target value in a sorted array by repeatedly
 * dividing the search interval in half.
 */
@Component({
  selector: 'app-binary-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ArrayItemComponent,
    PointerComponent,
    PlaybackControlsComponent,
  ],
  templateUrl: './binary-search.component.html',
  styleUrls: ['./binary-search.component.scss'],
})
export class BinarySearchComponent implements OnInit, OnDestroy {
  // Input data
  array: number[] = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  target: number = 13;
  customInput: string = '1, 3, 5, 7, 9, 11, 13, 15, 17, 19';

  // Animation state
  currentStep: AnimationStep | null = null;
  currentStepIndex: number = -1;
  totalSteps: number = 0;
  isPlaying: boolean = false;
  playbackState: PlaybackState = PlaybackState.IDLE;

  // Visual state from state manager
  elementStates: Map<number, ElementState> = new Map();
  pointers: Map<string, any> = new Map();

  // Result
  result: number | null = null;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Snapshot manager
  private snapshotManager = new SnapshotManager();

  constructor(
    private animationEngine: AnimationEngineService,
    private stateManager: AnimationStateManager,
    private validator: AnimationValidatorService
  ) {}

  ngOnInit(): void {
    // Subscribe to animation engine events
    this.subscriptions.push(
      this.animationEngine.currentStepIndex$.subscribe((index) => {
        const isBackward = index < this.currentStepIndex;
        this.currentStepIndex = index;

        // Restore from snapshot when stepping backward
        if (isBackward) {
          const snapshot = this.snapshotManager.getSnapshot(index);
          if (snapshot) {
            this.stateManager.restoreVisualState(snapshot.visualState);
          }
        }
      }),

      this.animationEngine.currentStep$.subscribe((step) => {
        this.currentStep = step;
        if (step) {
          this.stateManager.applyStep(step, this.array.length);

          // Create snapshot for time travel
          this.snapshotManager.createSnapshot(
            this.currentStepIndex,
            [...this.array],
            this.stateManager.getVisualState()
          );
        }
      }),

      this.animationEngine.playbackState$.subscribe((state) => {
        this.playbackState = state;
        this.isPlaying = state === PlaybackState.PLAYING;
      }),

      this.stateManager.elementStates$.subscribe((states) => {
        this.elementStates = states;
      }),

      this.stateManager.pointers$.subscribe((pointers) => {
        this.pointers = pointers;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.animationEngine.stop();
  }

  parseInput(): void {
    try {
      const nums = this.customInput
        .split(',')
        .map((s) => parseInt(s.trim()))
        .filter((n) => !isNaN(n));

      if (nums.length >= 2) {
        this.array = nums;
      }
    } catch (error) {
      console.error('Invalid input');
    }
  }

  /**
   * Generate animation steps for Binary Search algorithm
   */
  generateAnimationSteps(): AnimationStep[] {
    const steps: AnimationStep[] = [];
    const arr = [...this.array];
    let foundIndex: number | null = null;

    // Introduction
    steps.push(
      message(
        `Let's search for ${this.target} using Binary Search!`,
        'Introduction',
        {
          duration: 1000,
          codeLineNumber: 1,
          codeSnippet: `def binary_search(arr, target):`,
          codeLanguage: 'python',
          explanation: 'Binary Search works on sorted arrays by repeatedly halving the search space.',
          hint: 'Time complexity: O(log n) - very efficient!',
        }
      )
    );

    // Create left pointer
    steps.push(
      createPointer(
        PointerType.LEFT,
        0,
        'Place left pointer at start',
        {
          label: 'L',
          color: '#3b82f6',
          codeLineNumber: 2,
          codeSnippet: 'left = 0',
          codeLanguage: 'python',
          explanation: 'Start with left boundary at the beginning',
        }
      )
    );

    // Create right pointer
    const rightPointerStep = createPointer(
      PointerType.RIGHT,
      arr.length - 1,
      'Place right pointer at end',
      {
        label: 'R',
        color: '#ef4444',
        codeLineNumber: 3,
        codeSnippet: 'right = len(arr) - 1',
        codeLanguage: 'python',
        explanation: 'Right boundary at the end',
      }
    );
    rightPointerStep.parallel = true;
    steps.push(rightPointerStep);

    // Binary search loop
    let left = 0;
    let right = arr.length - 1;
    let iterations = 0;
    const maxIterations = 20;

    while (left <= right && iterations < maxIterations) {
      iterations++;
      const mid = Math.floor((left + right) / 2);

      // Calculate and show mid pointer
      steps.push(
        createPointer(
          'MID' as PointerType,
          mid,
          `Calculate mid point: (${left} + ${right}) / 2 = ${mid}`,
          {
            label: 'M',
            color: '#10b981',
            codeLineNumber: 5,
            codeSnippet: `mid = (left + right) // 2  # ${mid}`,
            codeLanguage: 'python',
            explanation: `Mid point is at index ${mid}, value ${arr[mid]}`,
          }
        )
      );

      // Highlight mid element
      steps.push(
        highlight(
          [mid],
          ElementState.CURRENT,
          `Check element at mid: ${arr[mid]}`,
          {
            codeLineNumber: 6,
            codeSnippet: `if arr[mid] == target:`,
            codeLanguage: 'python',
            explanation: `Comparing ${arr[mid]} with target ${this.target}`,
          }
        )
      );

      if (arr[mid] === this.target) {
        // Found!
        foundIndex = mid;

        steps.push(
          pulse(
            [mid],
            `Found ${this.target} at index ${mid}!`,
            {
              cycles: 2,
              duration: 800,
              codeLineNumber: 7,
              codeSnippet: `return mid  # ${mid}`,
              codeLanguage: 'python',
              explanation: `Success! Found ${this.target} at index ${mid}`,
              hint: 'Binary search is very efficient for sorted arrays',
            }
          )
        );

        steps.push(
          highlight(
            [mid],
            ElementState.RESULT,
            'Mark found element',
            {
              codeLineNumber: 7,
              codeSnippet: `return mid  # ${mid}`,
              codeLanguage: 'python',
              explanation: 'Target found!',
            }
          )
        );

        break;
      } else if (arr[mid] < this.target) {
        // Search right half
        steps.push(
          message(
            `${arr[mid]} < ${this.target}, search right half`,
            'Move search to right',
            {
              messageType: 'info',
              codeLineNumber: 8,
              codeSnippet: `elif arr[mid] < target:`,
              codeLanguage: 'python',
              explanation: `${arr[mid]} is less than ${this.target}, so target must be in the right half`,
              hint: 'Eliminate the left half including mid',
            }
          )
        );

        // Mark left half as eliminated
        for (let i = left; i <= mid; i++) {
          steps.push(
            highlight(
              [i],
              ElementState.VISITED,
              'Mark as eliminated',
              {
                codeLineNumber: 9,
                codeSnippet: 'left = mid + 1',
                codeLanguage: 'python',
                explanation: 'Eliminating left half',
              }
            )
          );
        }

        left = mid + 1;

        // Move left pointer
        if (left <= right) {
          steps.push(
            movePointer(
              PointerType.LEFT,
              left,
              `Move left to ${left}`,
              {
                codeLineNumber: 9,
                codeSnippet: 'left = mid + 1',
                codeLanguage: 'python',
                explanation: `New search space: [${left}, ${right}]`,
              }
            )
          );
        }
      } else {
        // Search left half
        steps.push(
          message(
            `${arr[mid]} > ${this.target}, search left half`,
            'Move search to left',
            {
              messageType: 'info',
              codeLineNumber: 10,
              codeSnippet: `else:  # arr[mid] > target`,
              codeLanguage: 'python',
              explanation: `${arr[mid]} is greater than ${this.target}, so target must be in the left half`,
              hint: 'Eliminate the right half including mid',
            }
          )
        );

        // Mark right half as eliminated
        for (let i = mid; i <= right; i++) {
          steps.push(
            highlight(
              [i],
              ElementState.VISITED,
              'Mark as eliminated',
              {
                codeLineNumber: 11,
                codeSnippet: 'right = mid - 1',
                codeLanguage: 'python',
                explanation: 'Eliminating right half',
              }
            )
          );
        }

        right = mid - 1;

        // Move right pointer
        if (left <= right) {
          steps.push(
            movePointer(
              PointerType.RIGHT,
              right,
              `Move right to ${right}`,
              {
                codeLineNumber: 11,
                codeSnippet: 'right = mid - 1',
                codeLanguage: 'python',
                explanation: `New search space: [${left}, ${right}]`,
              }
            )
          );
        }
      }
    }

    if (foundIndex === null) {
      steps.push(
        message(
          `${this.target} not found in array`,
          'Not found',
          {
            messageType: 'error',
            codeLineNumber: 12,
            codeSnippet: 'return -1  # Not found',
            codeLanguage: 'python',
            explanation: `${this.target} doesn't exist in this array`,
          }
        )
      );
    }

    return steps;
  }

  visualize(): void {
    this.result = null;
    this.snapshotManager.clear();

    const steps = this.generateAnimationSteps();
    this.totalSteps = steps.length;

    this.animationEngine.loadSteps(steps);
    this.animationEngine.play();
  }

  play(): void {
    this.animationEngine.play();
  }

  pause(): void {
    this.animationEngine.pause();
  }

  stepForward(): void {
    this.animationEngine.stepForward();
  }

  stepBackward(): void {
    this.animationEngine.stepBackward();
  }

  reset(): void {
    this.animationEngine.reset();
    this.stateManager.reset();
  }

  changeSpeed(speed: number): void {
    this.animationEngine.updateConfig({ speedMultiplier: speed });
  }

  /**
   * Get element state for display
   */
  getElementState(index: number): ElementState {
    return this.elementStates.get(index) || ElementState.DEFAULT;
  }

  /**
   * Check if pointer exists
   */
  hasPointer(pointerId: string): boolean {
    return this.pointers.has(pointerId);
  }

  /**
   * Get pointer left position as percentage
   */
  getPointerLeftPercent(pointerId: string): number {
    const pointer = this.pointers.get(pointerId);
    if (!pointer || this.array.length === 0) return 0;

    const itemCount = this.array.length;
    const itemWidth = 60; // px
    const gap = 16; // px
    const containerPadding = 16; // px
    const containerWidth = 1070; // px

    const itemSpacing = itemWidth + gap; // 76px
    const totalSpread = (itemCount - 1) * itemSpacing;
    const containerCenter = containerWidth / 2;

    const firstItemCenter = containerCenter - (totalSpread / 2) + containerPadding;
    const itemCenter = firstItemCenter + (pointer.position * itemSpacing);

    return (itemCenter / containerWidth) * 100;
  }
}
