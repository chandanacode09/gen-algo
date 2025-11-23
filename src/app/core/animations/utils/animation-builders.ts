/**
 * Animation builder utilities
 * Factory functions to create animation steps easily
 */

import {
  AnimationStep,
  AnimationType,
  ElementState,
  PointerType,
  ComparisonOp,
  EasingFunction,
  HighlightStep,
  UnhighlightStep,
  CompareStep,
  SwapStep,
  MoveStep,
  PulseStep,
  FlashStep,
  PointerMoveStep,
  PointerCreateStep,
  PointerRemoveStep,
  WindowCreateStep,
  WindowExpandStep,
  WindowShrinkStep,
  WindowSlideStep,
  UpdateValueStep,
  PauseStep,
  MessageStep,
} from '../models';

/**
 * Create a highlight step
 */
export function highlight(
  indices: number[],
  state: ElementState,
  description: string,
  options?: {
    duration?: number;
    delay?: number;
    parallel?: boolean;
  }
): HighlightStep {
  return {
    type: AnimationType.HIGHLIGHT,
    indices,
    state,
    description,
    ...options,
  };
}

/**
 * Create an unhighlight step
 */
export function unhighlight(
  indices: number[],
  description: string = 'Reset highlighting',
  options?: {
    duration?: number;
    delay?: number;
    parallel?: boolean;
  }
): UnhighlightStep {
  return {
    type: AnimationType.UNHIGHLIGHT,
    indices,
    description,
    ...options,
  };
}

/**
 * Create a compare step
 */
export function compare(
  indices: number[],
  operation: ComparisonOp,
  description: string,
  options?: {
    showValue?: boolean;
    result?: any;
    duration?: number;
    delay?: number;
  }
): CompareStep {
  return {
    type: AnimationType.COMPARE,
    indices,
    operation,
    description,
    ...options,
  };
}

/**
 * Create a swap step
 */
export function swap(
  i: number,
  j: number,
  description: string = `Swap elements at positions ${i} and ${j}`,
  options?: {
    duration?: number;
    delay?: number;
  }
): SwapStep {
  return {
    type: AnimationType.SWAP,
    indices: [i, j],
    description,
    duration: options?.duration || 600,
    ...options,
  };
}

/**
 * Create a move step
 */
export function move(
  fromIndex: number,
  toIndex: number,
  description: string,
  options?: {
    duration?: number;
    delay?: number;
  }
): MoveStep {
  return {
    type: AnimationType.MOVE,
    fromIndex,
    toIndex,
    description,
    ...options,
  };
}

/**
 * Create a pulse step
 */
export function pulse(
  indices: number[],
  description: string,
  options?: {
    cycles?: number;
    duration?: number;
    delay?: number;
  }
): PulseStep {
  return {
    type: AnimationType.PULSE,
    indices,
    description,
    ...options,
  };
}

/**
 * Create a flash step
 */
export function flash(
  indices: number[],
  description: string,
  options?: {
    color?: string;
    duration?: number;
    delay?: number;
  }
): FlashStep {
  return {
    type: AnimationType.FLASH,
    indices,
    description,
    duration: options?.duration || 300,
    ...options,
  };
}

/**
 * Create a pointer move step
 */
export function movePointer(
  pointer: PointerType | string,
  toIndex: number,
  description: string,
  options?: {
    label?: string;
    duration?: number;
    delay?: number;
  }
): PointerMoveStep {
  return {
    type: AnimationType.POINTER_MOVE,
    pointer,
    toIndex,
    description,
    duration: options?.duration || 400,
    ...options,
  };
}

/**
 * Create a pointer
 */
export function createPointer(
  pointer: PointerType | string,
  atIndex: number,
  description: string,
  options?: {
    label?: string;
    color?: string;
    duration?: number;
  }
): PointerCreateStep {
  return {
    type: AnimationType.POINTER_CREATE,
    pointer,
    atIndex,
    description,
    duration: options?.duration || 300,
    ...options,
  };
}

/**
 * Remove a pointer
 */
export function removePointer(
  pointer: PointerType | string,
  description: string = `Remove ${pointer} pointer`,
  options?: {
    duration?: number;
  }
): PointerRemoveStep {
  return {
    type: AnimationType.POINTER_REMOVE,
    pointer,
    description,
    duration: options?.duration || 300,
  };
}

/**
 * Create a sliding window
 */
export function createWindow(
  start: number,
  end: number,
  description: string,
  options?: {
    duration?: number;
  }
): WindowCreateStep {
  return {
    type: AnimationType.WINDOW_CREATE,
    start,
    end,
    description,
    duration: options?.duration || 400,
  };
}

/**
 * Expand window
 */
export function expandWindow(
  description: string,
  options?: {
    newStart?: number;
    newEnd?: number;
    duration?: number;
  }
): WindowExpandStep {
  return {
    type: AnimationType.WINDOW_EXPAND,
    description,
    duration: options?.duration || 400,
    ...options,
  };
}

/**
 * Shrink window
 */
export function shrinkWindow(
  description: string,
  options?: {
    newStart?: number;
    newEnd?: number;
    duration?: number;
  }
): WindowShrinkStep {
  return {
    type: AnimationType.WINDOW_SHRINK,
    description,
    duration: options?.duration || 400,
    ...options,
  };
}

/**
 * Slide window
 */
export function slideWindow(
  newStart: number,
  newEnd: number,
  description: string,
  options?: {
    duration?: number;
  }
): WindowSlideStep {
  return {
    type: AnimationType.WINDOW_SLIDE,
    newStart,
    newEnd,
    description,
    duration: options?.duration || 500,
  };
}

/**
 * Update value
 */
export function updateValue(
  index: number,
  newValue: any,
  description: string,
  options?: {
    showCalculation?: boolean;
    duration?: number;
  }
): UpdateValueStep {
  return {
    type: AnimationType.UPDATE_VALUE,
    index,
    newValue,
    description,
    ...options,
  };
}

/**
 * Create a pause
 */
export function pause(
  duration: number,
  message?: string,
  description: string = 'Pause'
): PauseStep {
  return {
    type: AnimationType.PAUSE,
    description,
    duration,
    message,
  };
}

/**
 * Display a message
 */
export function message(
  msg: string,
  description: string = msg,
  options?: {
    messageType?: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
  }
): MessageStep {
  return {
    type: AnimationType.MESSAGE,
    message: msg,
    description,
    duration: options?.duration || 1000,
    ...options,
  };
}

/**
 * Helper to mark parallel execution
 */
export function parallel(step: AnimationStep): AnimationStep {
  return { ...step, parallel: true };
}

/**
 * Helper to chain multiple steps
 */
export function sequence(...steps: AnimationStep[]): AnimationStep[] {
  return steps;
}
