import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AlgorithmStep,
  VisualizationState,
  PlaybackState,
  AlgorithmStatistics,
  OperationType
} from '../models';

/**
 * Service to manage the current visualization state
 */
@Injectable({
  providedIn: 'root'
})
export class VisualizationStateService {
  private readonly initialState: VisualizationState = {
    array: [],
    playbackState: PlaybackState.IDLE,
    steps: [],
    currentStepIndex: -1,
    statistics: {
      comparisons: 0,
      swaps: 0,
      arrayAccesses: 0,
      elapsedTime: 0,
      currentStep: 0,
      totalSteps: 0
    },
    highlightedIndices: new Set(),
    sortedIndices: new Set()
  };

  private stateSubject = new BehaviorSubject<VisualizationState>(this.initialState);
  public state$: Observable<VisualizationState> = this.stateSubject.asObservable();

  /**
   * Initialize the visualization with an array and steps
   */
  initialize(array: number[], steps: AlgorithmStep[]): void {
    const statistics = this.calculateStatistics(steps);
    const newState: VisualizationState = {
      array: [...array],
      playbackState: PlaybackState.IDLE,
      steps,
      currentStepIndex: -1,
      statistics: {
        ...statistics,
        currentStep: 0,
        elapsedTime: 0
      },
      highlightedIndices: new Set(),
      sortedIndices: new Set()
    };
    this.stateSubject.next(newState);
  }

  /**
   * Move to the next step
   */
  nextStep(): boolean {
    const currentState = this.stateSubject.value;
    if (currentState.currentStepIndex >= currentState.steps.length - 1) {
      this.setPlaybackState(PlaybackState.COMPLETED);
      return false;
    }

    const nextIndex = currentState.currentStepIndex + 1;
    const step = currentState.steps[nextIndex];
    this.applyStep(step, nextIndex);
    return true;
  }

  /**
   * Move to the previous step
   */
  previousStep(): boolean {
    const currentState = this.stateSubject.value;
    if (currentState.currentStepIndex <= 0) {
      return false;
    }

    const prevIndex = currentState.currentStepIndex - 1;
    const step = currentState.steps[prevIndex];
    this.applyStep(step, prevIndex);
    return true;
  }

  /**
   * Jump to a specific step
   */
  goToStep(stepIndex: number): void {
    const currentState = this.stateSubject.value;
    if (stepIndex < 0 || stepIndex >= currentState.steps.length) {
      return;
    }

    const step = currentState.steps[stepIndex];
    this.applyStep(step, stepIndex);
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      array: currentState.steps.length > 0 ? [...currentState.steps[0].array] : [],
      currentStepIndex: -1,
      playbackState: PlaybackState.IDLE,
      highlightedIndices: new Set(),
      sortedIndices: new Set(),
      statistics: {
        ...currentState.statistics,
        currentStep: 0,
        elapsedTime: 0
      }
    });
  }

  /**
   * Set playback state
   */
  setPlaybackState(state: PlaybackState): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      playbackState: state
    });
  }

  /**
   * Get current state
   */
  getCurrentState(): VisualizationState {
    return this.stateSubject.value;
  }

  /**
   * Clear all state
   */
  clear(): void {
    this.stateSubject.next(this.initialState);
  }

  /**
   * Apply a step to the current state
   */
  private applyStep(step: AlgorithmStep, stepIndex: number): void {
    const currentState = this.stateSubject.value;

    const highlightedIndices = new Set(step.indices);
    const sortedIndices = new Set(currentState.sortedIndices);

    // Update sorted indices if this is a mark_sorted operation
    if (step.operationType === OperationType.MARK_SORTED) {
      step.indices.forEach(idx => sortedIndices.add(idx));
    }

    // Calculate elapsed time based on step index
    const statistics: AlgorithmStatistics = {
      ...currentState.statistics,
      currentStep: stepIndex + 1,
      elapsedTime: stepIndex * 100 // Approximate
    };

    this.stateSubject.next({
      ...currentState,
      array: [...step.array],
      currentStepIndex: stepIndex,
      highlightedIndices,
      sortedIndices,
      statistics
    });
  }

  /**
   * Calculate statistics from steps
   */
  private calculateStatistics(steps: AlgorithmStep[]): AlgorithmStatistics {
    let comparisons = 0;
    let swaps = 0;
    let arrayAccesses = 0;

    steps.forEach(step => {
      switch (step.operationType) {
        case OperationType.COMPARE:
          comparisons++;
          arrayAccesses += step.indices.length;
          break;
        case OperationType.SWAP:
          swaps++;
          arrayAccesses += step.indices.length * 2;
          break;
        case OperationType.SET:
          arrayAccesses++;
          break;
      }
    });

    return {
      comparisons,
      swaps,
      arrayAccesses,
      elapsedTime: 0,
      currentStep: 0,
      totalSteps: steps.length
    };
  }
}
