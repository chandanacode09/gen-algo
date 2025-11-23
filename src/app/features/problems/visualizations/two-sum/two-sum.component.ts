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
 * Two Sum Problem Visualization
 * LeetCode #1 - Easy - Two Pointers Pattern
 *
 * Given an array of integers and a target, find two numbers that add up to the target.
 * Returns indices of the two numbers.
 */
@Component({
  selector: 'app-two-sum',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ArrayItemComponent,
    PointerComponent,
    PlaybackControlsComponent,
  ],
  templateUrl: './two-sum.component.html',
  styleUrls: ['./two-sum.component.scss'],
})
export class TwoSumComponent implements OnInit, OnDestroy {
  // Input data
  array: number[] = [2, 7, 11, 15];
  target: number = 9;
  customInput: string = '2, 7, 11, 15';

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
  result: [number, number] | null = null;

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
    this.stateManager.reset();
  }

  /**
   * Parse custom input
   */
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
   * Generate animation steps for Two Sum algorithm
   */
  generateAnimationSteps(): AnimationStep[] {
    const steps: AnimationStep[] = [];
    const arr = [...this.array];
    let foundSolution = false;
    let solutionIndices: [number, number] | null = null;

    // Introduction
    steps.push(
      message(
        `Let's find two numbers that add up to ${this.target}!`,
        'Introduction',
        {
          duration: 1000,
          codeLineNumber: 1,
          codeSnippet: `function twoSum(arr, target) {`,
          codeLanguage: 'javascript',
          explanation: 'We\'ll use the Two Pointers pattern on this sorted array.',
          hint: 'Two pointers work great when the array is sorted!',
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
          codeLineNumber: 1,
          codeSnippet: 'let left = 0;',
          codeLanguage: 'javascript',
          explanation: 'Start with left pointer at the beginning',
        }
      )
    );

    // Create right pointer in parallel
    const rightPointerStep = createPointer(
      PointerType.RIGHT,
      arr.length - 1,
      'Place right pointer at end',
      {
        label: 'R',
        color: '#ef4444',
        codeLineNumber: 2,
        codeSnippet: 'let right = arr.length - 1;',
        codeLanguage: 'javascript',
        explanation: 'And right pointer at the end',
      }
    );
    rightPointerStep.parallel = true;  // Execute in parallel with previous step
    steps.push(rightPointerStep);

    // Highlight left pointer position
    steps.push(
      highlight(
        [0],
        ElementState.POINTER_LEFT,
        'Highlight left pointer position',
        {
          codeLineNumber: 1,
          codeSnippet: 'let left = 0;',
          codeLanguage: 'javascript',
          explanation: 'Starting position highlighted',
        }
      )
    );

    // Highlight right pointer position in parallel
    const rightHighlightStep = highlight(
      [arr.length - 1],
      ElementState.POINTER_RIGHT,
      'Highlight right pointer position',
      {
        codeLineNumber: 2,
        codeSnippet: 'let right = arr.length - 1;',
        codeLanguage: 'javascript',
        explanation: 'Ending position highlighted',
      }
    );
    rightHighlightStep.parallel = true;  // Execute in parallel with previous step
    steps.push(rightHighlightStep);

    // Algorithm loop
    let left = 0;
    let right = arr.length - 1;
    let iterations = 0;
    const maxIterations = 20; // Safety limit

    while (left < right && iterations < maxIterations) {
      iterations++;
      const sum = arr[left] + arr[right];

      // Show comparison
      steps.push(
        compare(
          [left, right],
          ComparisonOp.SUM,
          `Calculate sum: ${arr[left]} + ${arr[right]} = ${sum}`,
          {
            showValue: true,
            result: sum,
            codeLineNumber: 5,
            codeSnippet: `const sum = arr[left] + arr[right]; // ${sum}`,
            codeLanguage: 'javascript',
            explanation: `Let's check if ${arr[left]} + ${arr[right]} equals our target of ${this.target}`,
          }
        )
      );

      if (sum === this.target) {
        // Found solution!
        foundSolution = true;
        solutionIndices = [left, right];

        steps.push(
          pulse(
            [left, right],
            `Found it! ${arr[left]} + ${arr[right]} = ${this.target}`,
            {
              cycles: 2,
              duration: 800,
              codeLineNumber: 7,
              codeSnippet: `return [left, right]; // [${left}, ${right}]`,
              codeLanguage: 'javascript',
              explanation: `Bingo! We found two numbers that add up to ${this.target}!`,
              hint: 'The answer is the indices, not the values',
            }
          )
        );

        steps.push(
          highlight(
            [left, right],
            ElementState.RESULT,
            'Mark solution elements',
            {
              codeLineNumber: 7,
              codeSnippet: `return [left, right]; // [${left}, ${right}]`,
              codeLanguage: 'javascript',
              explanation: 'Solution found!',
            }
          )
        );

        break;
      } else if (sum < this.target) {
        // Sum too small, move left pointer right
        steps.push(
          message(
            `${sum} < ${this.target}, need larger sum`,
            'Sum is too small',
            {
              messageType: 'info',
              codeLineNumber: 8,
              codeSnippet: `if (sum < target) {`,
              codeLanguage: 'javascript',
              explanation: `Since ${sum} is less than ${this.target}, we need a bigger number. Let's move the left pointer right!`,
              hint: 'Moving left pointer right increases the sum',
            }
          )
        );

        // Clear old highlighting
        steps.push(
          highlight([left], ElementState.VISITED, 'Mark as visited', {
            codeLineNumber: 10,
            codeSnippet: 'left++;',
            codeLanguage: 'javascript',
            explanation: 'Marking visited element',
          })
        );

        left++;

        if (left < right) {
          steps.push(
            movePointer(
              PointerType.LEFT,
              left,
              `Move left pointer to index ${left}`,
              {
                codeLineNumber: 10,
                codeSnippet: 'left++;',
                codeLanguage: 'javascript',
              }
            )
          );

          steps.push(
            highlight([left], ElementState.POINTER_LEFT, 'Highlight new position', {
              codeLineNumber: 10,
              codeSnippet: 'left++;',
              codeLanguage: 'javascript',
              explanation: 'New left position highlighted',
            })
          );
        }
      } else {
        // Sum too large, move right pointer left
        steps.push(
          message(
            `${sum} > ${this.target}, need smaller sum`,
            'Sum is too large',
            {
              messageType: 'info',
              codeLineNumber: 11,
              codeSnippet: `} else if (sum > target) {`,
              codeLanguage: 'javascript',
              explanation: `Since ${sum} is greater than ${this.target}, we need a smaller number. Let's move the right pointer left!`,
              hint: 'Moving right pointer left decreases the sum',
            }
          )
        );

        // Clear old highlighting
        steps.push(
          highlight([right], ElementState.VISITED, 'Mark as visited', {
            codeLineNumber: 12,
            codeSnippet: 'right--;',
            codeLanguage: 'javascript',
            explanation: 'Marking visited element',
          })
        );

        right--;

        if (left < right) {
          steps.push(
            movePointer(
              PointerType.RIGHT,
              right,
              `Move right pointer to index ${right}`,
              {
                codeLineNumber: 12,
                codeSnippet: 'right--;',
                codeLanguage: 'javascript',
              }
            )
          );

          steps.push(
            highlight([right], ElementState.POINTER_RIGHT, 'Highlight new position', {
              codeLineNumber: 12,
              codeSnippet: 'right--;',
              codeLanguage: 'javascript',
              explanation: 'New right position highlighted',
            })
          );
        }
      }
    }

    if (!foundSolution) {
      steps.push(
        message(
          'No solution found',
          'No two numbers add up to target',
          {
            messageType: 'warning',
            codeLineNumber: 14,
            codeSnippet: 'return []; // No solution',
            codeLanguage: 'javascript',
            explanation: 'We checked all possible pairs but couldn\'t find a solution.',
          }
        )
      );
    }

    this.result = solutionIndices;
    return steps;
  }

  /**
   * Visualize the algorithm
   */
  visualize(): void {
    // Reset state
    this.animationEngine.stop();
    this.stateManager.reset();
    this.snapshotManager.clear();
    this.result = null;

    // Generate steps
    const steps = this.generateAnimationSteps();

    // Validate
    const validation = this.validator.validateSteps(steps, this.array.length);
    if (!validation.valid) {
      console.error('Animation validation failed:', validation.errors);
      return;
    }

    if (validation.warnings.length > 0) {
      console.warn('Animation warnings:', validation.warnings);
    }

    // Load and play
    this.animationEngine.loadSteps(steps);
    this.totalSteps = steps.length;
    this.animationEngine.play();
  }

  /**
   * Playback controls
   */
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
    return this.stateManager.getElementState(index);
  }

  /**
   * Get pointer position as percentage for display
   * Calculates position to align with flexbox-centered array items
   */
  getPointerLeftPercent(pointerId: string): number {
    const pointer = this.pointers.get(pointerId);
    if (!pointer || this.array.length === 0) return 0;

    const itemCount = this.array.length;
    const itemWidth = 60; // px - from CSS
    const gap = 16; // px - 1rem gap between items

    // Container width (from CSS .array-container)
    const containerWidth = 1070; // px

    // Calculate spacing between item centers (itemWidth + gap)
    const itemSpacing = itemWidth + gap; // 76px

    // Total spread width (first to last item center)
    const totalSpread = (itemCount - 1) * itemSpacing; // e.g., 3 * 76 = 228px

    // Center point of the container (where items are centered)
    const containerPadding = 16; // px - 1rem horizontal padding
    const containerCenter = containerWidth / 2; // 535px

    // First item's center position (working backwards from center)
    // Flexbox centers in content box, so we need to account for padding
    const firstItemCenter = containerCenter - (totalSpread / 2) + containerPadding; // 535 - 114 + 16 = 437px

    // This item's center position
    const itemCenter = firstItemCenter + (pointer.position * itemSpacing);

    // Convert to percentage
    return (itemCenter / containerWidth) * 100;
  }

  /**
   * Check if pointer exists
   */
  hasPointer(pointerId: string): boolean {
    return this.pointers.has(pointerId);
  }
}
