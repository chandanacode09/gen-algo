/**
 * Core animation primitives for algorithm visualization
 * These are atomic operations that can be composed together
 */
export enum AnimationType {
  // Visual highlighting
  HIGHLIGHT = 'HIGHLIGHT',
  UNHIGHLIGHT = 'UNHIGHLIGHT',

  // Comparison operations
  COMPARE = 'COMPARE',

  // Movement and position
  SWAP = 'SWAP',
  MOVE = 'MOVE',
  SHIFT = 'SHIFT',

  // Attention and emphasis
  PULSE = 'PULSE',
  FLASH = 'FLASH',
  GLOW = 'GLOW',

  // Visibility
  FADE_IN = 'FADE_IN',
  FADE_OUT = 'FADE_OUT',

  // Pointers and indicators
  POINTER_MOVE = 'POINTER_MOVE',
  POINTER_CREATE = 'POINTER_CREATE',
  POINTER_REMOVE = 'POINTER_REMOVE',

  // Sliding window
  WINDOW_CREATE = 'WINDOW_CREATE',
  WINDOW_EXPAND = 'WINDOW_EXPAND',
  WINDOW_SHRINK = 'WINDOW_SHRINK',
  WINDOW_SLIDE = 'WINDOW_SLIDE',
  WINDOW_REMOVE = 'WINDOW_REMOVE',

  // State changes
  MARK_VISITED = 'MARK_VISITED',
  MARK_CURRENT = 'MARK_CURRENT',
  MARK_RESULT = 'MARK_RESULT',
  MARK_INVALID = 'MARK_INVALID',
  MARK_CANDIDATE = 'MARK_CANDIDATE',

  // Graph/Tree specific
  DRAW_EDGE = 'DRAW_EDGE',
  REMOVE_EDGE = 'REMOVE_EDGE',
  HIGHLIGHT_PATH = 'HIGHLIGHT_PATH',

  // Value changes
  UPDATE_VALUE = 'UPDATE_VALUE',

  // Composite actions
  PAUSE = 'PAUSE',
  MESSAGE = 'MESSAGE',
}

/**
 * Semantic states for visual elements
 * Each state maps to specific colors/styles
 */
export enum ElementState {
  DEFAULT = 'DEFAULT',           // Neutral state (gray)
  CURRENT = 'CURRENT',           // Active processing (primary blue)
  COMPARING = 'COMPARING',       // In comparison (yellow/orange)
  CANDIDATE = 'CANDIDATE',       // Potential answer (purple)
  VALID = 'VALID',               // Meets criteria (green)
  INVALID = 'INVALID',           // Doesn't meet criteria (red)
  VISITED = 'VISITED',           // Already processed (light gray)
  RESULT = 'RESULT',             // Part of final answer (bright green)
  POINTER_LEFT = 'POINTER_LEFT', // Left pointer (blue)
  POINTER_RIGHT = 'POINTER_RIGHT', // Right pointer (red)
  IN_WINDOW = 'IN_WINDOW',       // Inside sliding window (light blue)
  PIVOT = 'PIVOT',               // Pivot element (orange)
  SORTED = 'SORTED',             // Sorted position (green)
}

/**
 * Pointer/indicator types
 */
export enum PointerType {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  FAST = 'FAST',
  SLOW = 'SLOW',
  START = 'START',
  END = 'END',
  CURRENT = 'CURRENT',
  PIVOT = 'PIVOT',
  CUSTOM = 'CUSTOM',
}

/**
 * Comparison operations
 */
export enum ComparisonOp {
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN = 'GREATER_THAN',
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL',
  LESS_OR_EQUAL = 'LESS_OR_EQUAL',
  GREATER_OR_EQUAL = 'GREATER_OR_EQUAL',
  SUM = 'SUM',
  DIFFERENCE = 'DIFFERENCE',
}

/**
 * Easing functions for smooth animations
 */
export enum EasingFunction {
  LINEAR = 'linear',
  EASE_IN = 'ease-in',
  EASE_OUT = 'ease-out',
  EASE_IN_OUT = 'ease-in-out',
  EASE_IN_CUBIC = 'cubic-bezier(0.32, 0, 0.67, 0)',
  EASE_OUT_CUBIC = 'cubic-bezier(0.33, 1, 0.68, 1)',
  EASE_IN_OUT_CUBIC = 'cubic-bezier(0.65, 0, 0.35, 1)',
  BOUNCE = 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  ELASTIC = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}
