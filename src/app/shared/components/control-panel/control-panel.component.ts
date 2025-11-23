import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AnimationService } from '../../../core/services/animation.service';
import { VisualizationStateService } from '../../../core/services/visualization-state.service';
import { AudioFeedbackService } from '../../../core/services/audio-feedback.service';
import { PlaybackState } from '../../../core/models';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss'
})
export class ControlPanelComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isPlaying = false;
  playbackState = PlaybackState.IDLE;
  PlaybackState = PlaybackState;
  animationSpeed = 500;
  soundEnabled = false;

  constructor(
    private animationService: AnimationService,
    private visualizationStateService: VisualizationStateService,
    private audioService: AudioFeedbackService
  ) {}

  ngOnInit(): void {
    this.animationService.isPlaying$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isPlaying => {
        this.isPlaying = isPlaying;
      });

    this.visualizationStateService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.playbackState = state.playbackState;
      });

    this.animationService.animationSpeed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(speed => {
        this.animationSpeed = speed;
      });

    this.audioService.enabled$
      .pipe(takeUntil(this.destroy$))
      .subscribe(enabled => {
        this.soundEnabled = enabled;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPlay(): void {
    this.animationService.play();
  }

  onPause(): void {
    this.animationService.pause();
  }

  onReset(): void {
    this.animationService.reset();
  }

  onStepForward(): void {
    this.animationService.stepForward();
  }

  onStepBackward(): void {
    this.animationService.stepBackward();
  }

  onSpeedChange(speed: number): void {
    this.animationService.setSpeed(speed);
  }

  onSoundToggle(): void {
    this.audioService.setEnabled(!this.soundEnabled);
  }

  get canPlay(): boolean {
    return this.playbackState !== PlaybackState.PLAYING;
  }

  get canPause(): boolean {
    return this.playbackState === PlaybackState.PLAYING;
  }

  get canReset(): boolean {
    return this.playbackState !== PlaybackState.IDLE;
  }
}
