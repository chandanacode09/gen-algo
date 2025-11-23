import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, interval, Subscription } from 'rxjs';
import { takeWhile, takeUntil } from 'rxjs/operators';
import { VisualizationStateService } from './visualization-state.service';
import { PlaybackState } from '../models';

/**
 * Service to control animation playback
 */
@Injectable({
  providedIn: 'root'
})
export class AnimationService implements OnDestroy {
  private animationSpeedSubject = new BehaviorSubject<number>(500);
  public animationSpeed$: Observable<number> = this.animationSpeedSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  public isPlaying$: Observable<boolean> = this.isPlayingSubject.asObservable();

  private playbackSubscription?: Subscription;
  private destroy$ = new Subject<void>();

  constructor(private visualizationStateService: VisualizationStateService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stop();
  }

  /**
   * Start playing the animation
   */
  play(): void {
    if (this.isPlayingSubject.value) {
      return;
    }

    const currentState = this.visualizationStateService.getCurrentState();

    // If completed, reset first
    if (currentState.playbackState === PlaybackState.COMPLETED) {
      this.visualizationStateService.reset();
    }

    this.isPlayingSubject.next(true);
    this.visualizationStateService.setPlaybackState(PlaybackState.PLAYING);

    const speed = this.animationSpeedSubject.value;
    this.playbackSubscription = interval(speed)
      .pipe(
        takeWhile(() => {
          const hasNext = this.visualizationStateService.nextStep();
          if (!hasNext) {
            this.stop();
            this.visualizationStateService.setPlaybackState(PlaybackState.COMPLETED);
          }
          return hasNext;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  /**
   * Pause the animation
   */
  pause(): void {
    this.stop();
    this.visualizationStateService.setPlaybackState(PlaybackState.PAUSED);
  }

  /**
   * Stop the animation
   */
  stop(): void {
    if (this.playbackSubscription) {
      this.playbackSubscription.unsubscribe();
      this.playbackSubscription = undefined;
    }
    this.isPlayingSubject.next(false);
  }

  /**
   * Reset to beginning
   */
  reset(): void {
    this.stop();
    this.visualizationStateService.reset();
  }

  /**
   * Step forward one step
   */
  stepForward(): void {
    this.stop();
    const hasNext = this.visualizationStateService.nextStep();
    if (!hasNext) {
      this.visualizationStateService.setPlaybackState(PlaybackState.COMPLETED);
    } else {
      this.visualizationStateService.setPlaybackState(PlaybackState.PAUSED);
    }
  }

  /**
   * Step backward one step
   */
  stepBackward(): void {
    this.stop();
    this.visualizationStateService.previousStep();
    this.visualizationStateService.setPlaybackState(PlaybackState.PAUSED);
  }

  /**
   * Set animation speed
   */
  setSpeed(speed: number): void {
    this.animationSpeedSubject.next(speed);

    // If currently playing, restart with new speed
    if (this.isPlayingSubject.value) {
      this.stop();
      this.play();
    }
  }

  /**
   * Get current animation speed
   */
  getSpeed(): number {
    return this.animationSpeedSubject.value;
  }

  /**
   * Jump to specific step
   */
  goToStep(stepIndex: number): void {
    this.stop();
    this.visualizationStateService.goToStep(stepIndex);
    this.visualizationStateService.setPlaybackState(PlaybackState.PAUSED);
  }
}
