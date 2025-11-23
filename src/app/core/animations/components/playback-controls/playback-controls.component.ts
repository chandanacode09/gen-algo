import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaybackState } from '../../services/animation-engine.service';

/**
 * Playback Controls Component
 * Standard controls for animation playback (play, pause, step, reset)
 */
@Component({
  selector: 'app-playback-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="playback-controls">
      <!-- Reset to start -->
      <button
        class="control-btn"
        (click)="onReset()"
        [disabled]="isAtStart"
        title="Reset to beginning"
        aria-label="Reset to beginning">
        ⏮️
      </button>

      <!-- Step backward -->
      <button
        class="control-btn"
        (click)="onStepBackward()"
        [disabled]="isAtStart"
        title="Previous step"
        aria-label="Previous step">
        ⏪
      </button>

      <!-- Play/Pause -->
      <button
        *ngIf="!isPlaying"
        class="control-btn primary"
        (click)="onPlay()"
        [disabled]="isAtEnd"
        title="Play animation"
        aria-label="Play animation">
        ▶️
      </button>

      <button
        *ngIf="isPlaying"
        class="control-btn primary"
        (click)="onPause()"
        title="Pause animation"
        aria-label="Pause animation">
        ⏸️
      </button>

      <!-- Step forward -->
      <button
        class="control-btn"
        (click)="onStepForward()"
        [disabled]="isAtEnd"
        title="Next step"
        aria-label="Next step">
        ⏩
      </button>

      <!-- Step counter -->
      <div class="step-counter" *ngIf="showStepCounter">
        <span class="current-step">{{ currentStep + 1 }}</span>
        <span class="separator">/</span>
        <span class="total-steps">{{ totalSteps }}</span>
      </div>

      <!-- Speed control -->
      <div class="speed-control" *ngIf="showSpeedControl">
        <label for="speed-select" class="speed-label">Speed:</label>
        <select
          id="speed-select"
          class="speed-select"
          [value]="speed"
          (change)="onSpeedChange($event)">
          <option value="0.25">0.25x</option>
          <option value="0.5">0.5x</option>
          <option value="1">1x</option>
          <option value="2">2x</option>
          <option value="4">4x</option>
        </select>
      </div>
    </div>
  `,
  styleUrls: ['./playback-controls.component.scss'],
})
export class PlaybackControlsComponent {
  /** Current step index */
  @Input() currentStep: number = 0;

  /** Total number of steps */
  @Input() totalSteps: number = 0;

  /** Is animation playing? */
  @Input() isPlaying: boolean = false;

  /** Playback state */
  @Input() playbackState: PlaybackState = PlaybackState.IDLE;

  /** Current speed multiplier */
  @Input() speed: number = 1.0;

  /** Show step counter? */
  @Input() showStepCounter: boolean = true;

  /** Show speed control? */
  @Input() showSpeedControl: boolean = true;

  /** Play event */
  @Output() play = new EventEmitter<void>();

  /** Pause event */
  @Output() pause = new EventEmitter<void>();

  /** Step forward event */
  @Output() stepForward = new EventEmitter<void>();

  /** Step backward event */
  @Output() stepBackward = new EventEmitter<void>();

  /** Reset event */
  @Output() reset = new EventEmitter<void>();

  /** Speed change event */
  @Output() speedChange = new EventEmitter<number>();

  /**
   * Check if at start
   */
  get isAtStart(): boolean {
    return this.currentStep <= 0;
  }

  /**
   * Check if at end
   */
  get isAtEnd(): boolean {
    return this.currentStep >= this.totalSteps - 1;
  }

  onPlay(): void {
    this.play.emit();
  }

  onPause(): void {
    this.pause.emit();
  }

  onStepForward(): void {
    this.stepForward.emit();
  }

  onStepBackward(): void {
    this.stepBackward.emit();
  }

  onReset(): void {
    this.reset.emit();
  }

  onSpeedChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newSpeed = parseFloat(select.value);
    this.speedChange.emit(newSpeed);
  }
}
