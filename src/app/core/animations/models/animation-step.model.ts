import {
  AnimationType,
  ElementState,
  PointerType,
  ComparisonOp,
  EasingFunction,
} from './animation-types.model';

/**
 * Base animation step interface
 * All animation steps extend from this
 */
export interface BaseAnimationStep {
  /** Type of animation to perform */
  type: AnimationType;

  /** Human-readable description of what's happening */
  description: string;

  /** Duration in milliseconds (default: 500ms) */
  duration?: number;

  /** Delay before starting in milliseconds (default: 0ms) */
  delay?: number;

  /** Easing function (default: ease-in-out) */
  easing?: EasingFunction;

  /** Should this run in parallel with the next step? */
  parallel?: boolean;

  /** Code synchronization - line number being executed */
  codeLineNumber?: number;

  /** Code snippet to display */
  codeSnippet?: string;

  /** Programming language for syntax highlighting */
  codeLanguage?: 'typescript' | 'javascript' | 'python' | 'java' | 'cpp' | 'pseudocode';

  /** Human-friendly explanation (for personality) */
  explanation?: string;

  /** Hints or tips related to this step */
  hint?: string;

  /** Optional metadata for debugging/tracking */
  metadata?: Record<string, any>;
}

/**
 * Highlight one or more elements
 */
export interface HighlightStep extends BaseAnimationStep {
  type: AnimationType.HIGHLIGHT;
  /** Array indices to highlight */
  indices: number[];
  /** State to apply (determines color) */
  state: ElementState;
}

/**
 * Remove highlighting from elements
 */
export interface UnhighlightStep extends BaseAnimationStep {
  type: AnimationType.UNHIGHLIGHT;
  /** Array indices to unhighlight */
  indices: number[];
}

/**
 * Compare two or more elements
 */
export interface CompareStep extends BaseAnimationStep {
  type: AnimationType.COMPARE;
  /** Indices being compared */
  indices: number[];
  /** Type of comparison */
  operation: ComparisonOp;
  /** Show the computed value? (e.g., sum, difference) */
  showValue?: boolean;
  /** Result of comparison (for display) */
  result?: any;
}

/**
 * Swap two elements
 */
export interface SwapStep extends BaseAnimationStep {
  type: AnimationType.SWAP;
  /** Indices of elements to swap */
  indices: [number, number];
}

/**
 * Move element from one position to another
 */
export interface MoveStep extends BaseAnimationStep {
  type: AnimationType.MOVE;
  /** Index of element to move */
  fromIndex: number;
  /** Destination index */
  toIndex: number;
}

/**
 * Pulse animation for emphasis
 */
export interface PulseStep extends BaseAnimationStep {
  type: AnimationType.PULSE;
  /** Indices to pulse */
  indices: number[];
  /** Number of pulse cycles (default: 1) */
  cycles?: number;
}

/**
 * Flash animation for quick attention
 */
export interface FlashStep extends BaseAnimationStep {
  type: AnimationType.FLASH;
  /** Indices to flash */
  indices: number[];
  /** Flash color */
  color?: string;
}

/**
 * Move a pointer to a new position
 */
export interface PointerMoveStep extends BaseAnimationStep {
  type: AnimationType.POINTER_MOVE;
  /** Which pointer to move */
  pointer: PointerType | string;
  /** Destination index */
  toIndex: number;
  /** Optional label for the pointer */
  label?: string;
}

/**
 * Create a new pointer
 */
export interface PointerCreateStep extends BaseAnimationStep {
  type: AnimationType.POINTER_CREATE;
  /** Pointer identifier */
  pointer: PointerType | string;
  /** Initial position */
  atIndex: number;
  /** Label to display */
  label?: string;
  /** Color for this pointer */
  color?: string;
}

/**
 * Remove a pointer
 */
export interface PointerRemoveStep extends BaseAnimationStep {
  type: AnimationType.POINTER_REMOVE;
  /** Pointer to remove */
  pointer: PointerType | string;
}

/**
 * Create a sliding window
 */
export interface WindowCreateStep extends BaseAnimationStep {
  type: AnimationType.WINDOW_CREATE;
  /** Window start index */
  start: number;
  /** Window end index (inclusive) */
  end: number;
}

/**
 * Expand sliding window
 */
export interface WindowExpandStep extends BaseAnimationStep {
  type: AnimationType.WINDOW_EXPAND;
  /** New start index */
  newStart?: number;
  /** New end index */
  newEnd?: number;
}

/**
 * Shrink sliding window
 */
export interface WindowShrinkStep extends BaseAnimationStep {
  type: AnimationType.WINDOW_SHRINK;
  /** New start index */
  newStart?: number;
  /** New end index */
  newEnd?: number;
}

/**
 * Slide window to new position
 */
export interface WindowSlideStep extends BaseAnimationStep {
  type: AnimationType.WINDOW_SLIDE;
  /** New start index */
  newStart: number;
  /** New end index */
  newEnd: number;
}

/**
 * Update element value
 */
export interface UpdateValueStep extends BaseAnimationStep {
  type: AnimationType.UPDATE_VALUE;
  /** Index of element to update */
  index: number;
  /** New value */
  newValue: any;
  /** Show calculation? */
  showCalculation?: boolean;
}

/**
 * Pause with optional message
 */
export interface PauseStep extends BaseAnimationStep {
  type: AnimationType.PAUSE;
  /** Message to display during pause */
  message?: string;
}

/**
 * Display a message
 */
export interface MessageStep extends BaseAnimationStep {
  type: AnimationType.MESSAGE;
  /** Message text */
  message: string;
  /** Message type (info, success, warning, error) */
  messageType?: 'info' | 'success' | 'warning' | 'error';
}

/**
 * Union type of all possible animation steps
 */
export type AnimationStep =
  | HighlightStep
  | UnhighlightStep
  | CompareStep
  | SwapStep
  | MoveStep
  | PulseStep
  | FlashStep
  | PointerMoveStep
  | PointerCreateStep
  | PointerRemoveStep
  | WindowCreateStep
  | WindowExpandStep
  | WindowShrinkStep
  | WindowSlideStep
  | UpdateValueStep
  | PauseStep
  | MessageStep;

/**
 * Animation sequence - a list of steps to execute
 */
export interface AnimationSequence {
  /** Unique identifier */
  id?: string;
  /** Name of the sequence */
  name: string;
  /** Description */
  description?: string;
  /** Steps to execute */
  steps: AnimationStep[];
  /** Initial data state */
  initialData?: any[];
}
