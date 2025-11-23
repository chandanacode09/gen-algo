import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatternType, PatternStep, PATTERN_METADATA } from '../models/pattern.model';
import { TwoPointersService } from '../components/two-pointers.service';
import { SlidingWindowService } from '../components/sliding-window.service';

@Component({
  selector: 'app-patterns-visualizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patterns-visualizer.component.html',
  styleUrl: './patterns-visualizer.component.scss'
})
export class PatternsVisualizerComponent implements OnInit {
  selectedPattern: PatternType = PatternType.TWO_POINTERS;
  selectedProblem = 'pair-sum';

  inputArray: string = '1, 3, 5, 7, 9, 11, 13';
  targetValue: number = 14;
  windowSize: number = 3;

  array: number[] = [];
  steps: PatternStep[] = [];
  currentStepIndex = 0;
  isPlaying = false;
  playSpeed = 1000; // ms per step

  PatternType = PatternType;
  PATTERN_METADATA = PATTERN_METADATA;

  get patterns() {
    return Object.values(PATTERN_METADATA);
  }

  get currentStep(): PatternStep | null {
    return this.steps[this.currentStepIndex] || null;
  }

  get currentProblemNeedsTarget(): boolean {
    const problem = this.problemsForPattern.find(p => p.id === this.selectedProblem);
    return problem?.needsTarget || false;
  }

  get currentProblemNeedsWindow(): boolean {
    const problem = this.problemsForPattern.find(p => p.id === this.selectedProblem);
    return problem?.needsWindow || false;
  }

  get problemsForPattern() {
    switch (this.selectedPattern) {
      case PatternType.TWO_POINTERS:
        return [
          { id: 'pair-sum', name: 'Find Pair with Target Sum', needsTarget: true },
          { id: 'palindrome', name: 'Check Palindrome', needsTarget: false }
        ];
      case PatternType.SLIDING_WINDOW:
        return [
          { id: 'max-sum', name: 'Maximum Sum Subarray', needsWindow: true },
          { id: 'min-length', name: 'Minimum Subarray Length', needsTarget: true }
        ];
      default:
        return [];
    }
  }

  constructor(
    private twoPointersService: TwoPointersService,
    private slidingWindowService: SlidingWindowService
  ) {}

  ngOnInit(): void {
    this.parseInput();
  }

  parseInput(): void {
    try {
      this.array = this.inputArray
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n));
    } catch {
      this.array = [];
    }
  }

  onPatternChange(): void {
    this.selectedProblem = this.problemsForPattern[0]?.id || '';
    this.reset();
  }

  visualize(): void {
    this.parseInput();

    if (this.array.length === 0) {
      return;
    }

    this.steps = this.generateSteps();
    this.currentStepIndex = 0;
  }

  generateSteps(): PatternStep[] {
    switch (this.selectedPattern) {
      case PatternType.TWO_POINTERS:
        if (this.selectedProblem === 'pair-sum') {
          return this.twoPointersService.findPairWithSum(this.array, this.targetValue);
        } else {
          return this.twoPointersService.isPalindrome(this.array);
        }

      case PatternType.SLIDING_WINDOW:
        if (this.selectedProblem === 'max-sum') {
          return this.slidingWindowService.maxSumSubarray(this.array, this.windowSize);
        } else {
          return this.slidingWindowService.minSubarrayLength(this.array, this.targetValue);
        }

      default:
        return [];
    }
  }

  play(): void {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.stepForward();
  }

  pause(): void {
    this.isPlaying = false;
  }

  reset(): void {
    this.currentStepIndex = 0;
    this.steps = [];
    this.isPlaying = false;
  }

  stepForward(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;

      if (this.isPlaying) {
        setTimeout(() => this.stepForward(), this.playSpeed);
      }
    } else {
      this.isPlaying = false;
    }
  }

  stepBackward(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
    this.isPlaying = false;
  }

  getArrayItemClass(index: number): string {
    const step = this.currentStep;
    if (!step) return 'array-item';

    const classes = ['array-item'];

    // Check if it's a pointer position
    if (step.pointers) {
      const pointer = step.pointers.find(p => p.index === index);
      if (pointer) {
        classes.push(`pointer-${pointer.name}`);
      }
    }

    // Check if it's in the window
    if (step.windowStart !== undefined && step.windowEnd !== undefined) {
      if (index >= step.windowStart && index <= step.windowEnd) {
        classes.push('in-window');
      }
    }

    // Check if it's highlighted
    if (step.highlight?.includes(index)) {
      classes.push('highlighted');
    }

    return classes.join(' ');
  }

  getPointerLabel(index: number): string | null {
    const step = this.currentStep;
    if (!step?.pointers) return null;

    const pointer = step.pointers.find(p => p.index === index);
    return pointer ? pointer.name : null;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
