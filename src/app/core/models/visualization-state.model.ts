import { AlgorithmStep } from './algorithm-step.model';

/**
 * Playback state
 */
export enum PlaybackState {
  IDLE = 'idle',
  PLAYING = 'playing',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

/**
 * Statistics for algorithm execution
 */
export interface AlgorithmStatistics {
  /** Number of comparisons made */
  comparisons: number;

  /** Number of swaps/writes made */
  swaps: number;

  /** Number of array accesses */
  arrayAccesses: number;

  /** Elapsed time in milliseconds */
  elapsedTime: number;

  /** Current step number */
  currentStep: number;

  /** Total number of steps */
  totalSteps: number;
}

/**
 * Current state of the visualization
 */
export interface VisualizationState {
  /** Current array being visualized */
  array: number[];

  /** Current playback state */
  playbackState: PlaybackState;

  /** History of all steps */
  steps: AlgorithmStep[];

  /** Current step index */
  currentStepIndex: number;

  /** Statistics */
  statistics: AlgorithmStatistics;

  /** Currently highlighted indices */
  highlightedIndices: Set<number>;

  /** Sorted indices */
  sortedIndices: Set<number>;
}
