import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service to provide audio feedback during visualization
 */
@Injectable({
  providedIn: 'root'
})
export class AudioFeedbackService {
  private audioContext?: AudioContext;
  private enabledSubject = new BehaviorSubject<boolean>(false);
  public enabled$: Observable<boolean> = this.enabledSubject.asObservable();

  constructor() {
    // Initialize AudioContext lazily to avoid autoplay issues
  }

  /**
   * Enable or disable audio feedback
   */
  setEnabled(enabled: boolean): void {
    this.enabledSubject.next(enabled);

    if (enabled && !this.audioContext) {
      this.initializeAudioContext();
    }
  }

  /**
   * Check if audio is enabled
   */
  isEnabled(): boolean {
    return this.enabledSubject.value;
  }

  /**
   * Play comparison sound
   * Pitch is based on the values being compared
   */
  playCompareSound(value1: number, value2: number): void {
    if (!this.isEnabled() || !this.audioContext) {
      return;
    }

    const avgValue = (value1 + value2) / 2;
    const frequency = 200 + avgValue * 5; // Map value to frequency
    this.playTone(frequency, 0.05, 0.1);
  }

  /**
   * Play swap sound
   */
  playSwapSound(): void {
    if (!this.isEnabled() || !this.audioContext) {
      return;
    }

    this.playSweep(300, 200, 0.1, 0.15);
  }

  /**
   * Play completion melody
   */
  playCompletionSound(): void {
    if (!this.isEnabled() || !this.audioContext) {
      return;
    }

    const notes = [262, 330, 392, 523]; // C, E, G, C (one octave higher)
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, 0.1);
      }, index * 150);
    });
  }

  /**
   * Play a tone at a specific frequency
   */
  private playTone(frequency: number, duration: number, volume: number = 0.1): void {
    if (!this.audioContext) {
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  /**
   * Play a frequency sweep
   */
  private playSweep(startFreq: number, endFreq: number, duration: number, volume: number = 0.1): void {
    if (!this.audioContext) {
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  /**
   * Initialize audio context
   */
  private initializeAudioContext(): void {
    try {
      this.audioContext = new AudioContext();
    } catch (e) {
      console.warn('Web Audio API is not supported in this browser', e);
    }
  }
}
