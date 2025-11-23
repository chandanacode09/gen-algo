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
 * Code language type for syntax highlighting
 */
type CodeLanguage = 'typescript' | 'javascript' | 'python' | 'java' | 'cpp' | 'pseudocode';

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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
  }
): PointerRemoveStep {
  return {
    type: AnimationType.POINTER_REMOVE,
    pointer,
    description,
    duration: options?.duration || 300,
    ...options,
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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
  }
): WindowCreateStep {
  return {
    type: AnimationType.WINDOW_CREATE,
    start,
    end,
    description,
    duration: options?.duration || 400,
    ...options,
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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
  }
): WindowSlideStep {
  return {
    type: AnimationType.WINDOW_SLIDE,
    newStart,
    newEnd,
    description,
    duration: options?.duration || 500,
    ...options,
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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
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
  msg?: string,
  description: string = 'Pause',
  options?: {
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
  }
): PauseStep {
  return {
    type: AnimationType.PAUSE,
    description,
    duration,
    message: msg,
    ...options,
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
    codeLineNumber?: number;
    codeSnippet?: string;
    codeLanguage?: CodeLanguage;
    explanation?: string;
    hint?: string;
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
