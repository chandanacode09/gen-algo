import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  AnimationStep,
  AnimationSequence,
  AnimationConfig,
  DEFAULT_ANIMATION_CONFIG,
  AnimationType,
} from '../models';

/**
 * Playback state
 */
export enum PlaybackState {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

/**
 * Central animation engine service
 * Manages animation playback, state, and execution
 */
@Injectable({
  providedIn: 'root',
})
export class AnimationEngineService {
  // Configuration
  private config: AnimationConfig = { ...DEFAULT_ANIMATION_CONFIG };

  // Current animation sequence
  private sequence: AnimationSequence | null = null;
  private steps: AnimationStep[] = [];

  // Playback state
  private currentStepIndexSubject = new BehaviorSubject<number>(-1);
  private playbackStateSubject = new BehaviorSubject<PlaybackState>(
    PlaybackState.IDLE
  );
  private currentStepSubject = new BehaviorSubject<AnimationStep | null>(null);

  // Step execution event
  private stepExecutedSubject = new Subject<{
    step: AnimationStep;
    index: number;
  }>();

  // Animation timer
  private playTimer: any = null;

  // Observables
  public currentStepIndex$: Observable<number> =
    this.currentStepIndexSubject.asObservable();
  public playbackState$: Observable<PlaybackState> =
    this.playbackStateSubject.asObservable();
  public currentStep$: Observable<AnimationStep | null> =
    this.currentStepSubject.asObservable();
  public stepExecuted$: Observable<{ step: AnimationStep; index: number }> =
    this.stepExecutedSubject.asObservable();

  constructor() {}

  /**
   * Load an animation sequence
   */
  loadSequence(sequence: AnimationSequence): void {
    this.stop();
    this.sequence = sequence;
    this.steps = sequence.steps;
    this.currentStepIndexSubject.next(-1);
    this.playbackStateSubject.next(PlaybackState.IDLE);
    this.currentStepSubject.next(null);
  }

  /**
   * Load steps directly
   */
  loadSteps(steps: AnimationStep[]): void {
    this.stop();
    this.steps = steps;
    this.sequence = {
      name: 'Custom Sequence',
      steps,
    };
    this.currentStepIndexSubject.next(-1);
    this.playbackStateSubject.next(PlaybackState.IDLE);
    this.currentStepSubject.next(null);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AnimationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): AnimationConfig {
    return { ...this.config };
  }

  /**
   * Play the animation sequence
   */
  play(): void {
    if (this.steps.length === 0) return;

    const currentIndex = this.currentStepIndexSubject.value;

    // If at the end, restart
    if (currentIndex >= this.steps.length - 1) {
      this.reset();
    }

    this.playbackStateSubject.next(PlaybackState.PLAYING);
    this.playNextStep();
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (this.playTimer) {
      clearTimeout(this.playTimer);
      this.playTimer = null;
    }
    this.playbackStateSubject.next(PlaybackState.PAUSED);
  }

  /**
   * Stop and reset
   */
  stop(): void {
    if (this.playTimer) {
      clearTimeout(this.playTimer);
      this.playTimer = null;
    }
    this.playbackStateSubject.next(PlaybackState.IDLE);
  }

  /**
   * Reset to beginning
   */
  reset(): void {
    this.stop();
    this.currentStepIndexSubject.next(-1);
    this.currentStepSubject.next(null);
    this.playbackStateSubject.next(PlaybackState.IDLE);
  }

  /**
   * Step forward one step
   */
  stepForward(): void {
    const currentIndex = this.currentStepIndexSubject.value;
    if (currentIndex < this.steps.length - 1) {
      this.goToStep(currentIndex + 1);
    }
  }

  /**
   * Step backward one step
   */
  stepBackward(): void {
    const currentIndex = this.currentStepIndexSubject.value;
    if (currentIndex > 0) {
      this.goToStep(currentIndex - 1);
    }
  }

  /**
   * Jump to specific step
   */
  goToStep(index: number): void {
    if (index < 0 || index >= this.steps.length) return;

    this.pause();
    this.currentStepIndexSubject.next(index);
    const step = this.steps[index];
    this.currentStepSubject.next(step);
    this.stepExecutedSubject.next({ step, index });
  }

  /**
   * Get current step index
   */
  getCurrentStepIndex(): number {
    return this.currentStepIndexSubject.value;
  }

  /**
   * Get total number of steps
   */
  getTotalSteps(): number {
    return this.steps.length;
  }

  /**
   * Get current step
   */
  getCurrentStep(): AnimationStep | null {
    const index = this.currentStepIndexSubject.value;
    if (index >= 0 && index < this.steps.length) {
      return this.steps[index];
    }
    return null;
  }

  /**
   * Check if playing
   */
  isPlaying(): boolean {
    return this.playbackStateSubject.value === PlaybackState.PLAYING;
  }

  /**
   * Check if at end
   */
  isAtEnd(): boolean {
    return this.currentStepIndexSubject.value >= this.steps.length - 1;
  }

  /**
   * Check if at start
   */
  isAtStart(): boolean {
    return this.currentStepIndexSubject.value <= 0;
  }

  /**
   * Play next step in sequence
   */
  private playNextStep(): void {
    const currentIndex = this.currentStepIndexSubject.value;
    const nextIndex = currentIndex + 1;

    if (nextIndex >= this.steps.length) {
      this.playbackStateSubject.next(PlaybackState.COMPLETED);
      return;
    }

    const step = this.steps[nextIndex];
    this.currentStepIndexSubject.next(nextIndex);
    this.currentStepSubject.next(step);
    this.stepExecutedSubject.next({ step, index: nextIndex });

    // Calculate delay for next step
    const duration =
      (step.duration || this.config.defaultDuration) /
      this.config.speedMultiplier;
    const delay =
      (step.delay || this.config.defaultDelay) / this.config.speedMultiplier;

    // If step is parallel, play next immediately
    if (step.parallel) {
      this.playNextStep();
    } else {
      // Schedule next step
      this.playTimer = setTimeout(() => {
        if (this.playbackStateSubject.value === PlaybackState.PLAYING) {
          this.playNextStep();
        }
      }, duration + delay);
    }
  }

  /**
   * Clear all state and cleanup
   */
  destroy(): void {
    this.stop();
    this.steps = [];
    this.sequence = null;
    this.currentStepIndexSubject.complete();
    this.playbackStateSubject.complete();
    this.currentStepSubject.complete();
    this.stepExecutedSubject.complete();
  }
}
