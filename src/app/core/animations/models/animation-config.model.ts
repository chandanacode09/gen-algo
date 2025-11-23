import { ElementState, EasingFunction } from './animation-types.model';

/**
 * Global animation configuration
 */
export interface AnimationConfig {
  /** Default duration for animations (ms) */
  defaultDuration: number;
  /** Default delay between steps (ms) */
  defaultDelay: number;
  /** Default easing function */
  defaultEasing: EasingFunction;
  /** Speed multiplier (1.0 = normal, 0.5 = slow, 2.0 = fast) */
  speedMultiplier: number;
  /** Auto-play on load? */
  autoPlay: boolean;
}

/**
 * Visual theme configuration for element states
 */
export interface StateColorConfig {
  [ElementState.DEFAULT]: string;
  [ElementState.CURRENT]: string;
  [ElementState.COMPARING]: string;
  [ElementState.CANDIDATE]: string;
  [ElementState.VALID]: string;
  [ElementState.INVALID]: string;
  [ElementState.VISITED]: string;
  [ElementState.RESULT]: string;
  [ElementState.POINTER_LEFT]: string;
  [ElementState.POINTER_RIGHT]: string;
  [ElementState.IN_WINDOW]: string;
  [ElementState.PIVOT]: string;
  [ElementState.SORTED]: string;
}

/**
 * Default animation configuration
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  defaultDuration: 500,
  defaultDelay: 0,
  defaultEasing: EasingFunction.EASE_IN_OUT,
  speedMultiplier: 1.0,
  autoPlay: false,
};

/**
 * Default light theme colors for element states
 */
export const LIGHT_THEME_COLORS: StateColorConfig = {
  [ElementState.DEFAULT]: '#6b7280',           // Gray
  [ElementState.CURRENT]: '#3b82f6',           // Blue
  [ElementState.COMPARING]: '#f59e0b',         // Orange
  [ElementState.CANDIDATE]: '#a855f7',         // Purple
  [ElementState.VALID]: '#10b981',             // Green
  [ElementState.INVALID]: '#ef4444',           // Red
  [ElementState.VISITED]: '#d1d5db',           // Light gray
  [ElementState.RESULT]: '#22c55e',            // Bright green
  [ElementState.POINTER_LEFT]: '#3b82f6',      // Blue
  [ElementState.POINTER_RIGHT]: '#ef4444',     // Red
  [ElementState.IN_WINDOW]: '#93c5fd',         // Light blue
  [ElementState.PIVOT]: '#f97316',             // Orange
  [ElementState.SORTED]: '#4ade80',            // Light green
};

/**
 * Default dark theme colors for element states
 */
export const DARK_THEME_COLORS: StateColorConfig = {
  [ElementState.DEFAULT]: '#9ca3af',           // Light gray
  [ElementState.CURRENT]: '#60a5fa',           // Light blue
  [ElementState.COMPARING]: '#fbbf24',         // Light orange
  [ElementState.CANDIDATE]: '#c084fc',         // Light purple
  [ElementState.VALID]: '#34d399',             // Light green
  [ElementState.INVALID]: '#f87171',           // Light red
  [ElementState.VISITED]: '#4b5563',           // Dark gray
  [ElementState.RESULT]: '#4ade80',            // Bright green
  [ElementState.POINTER_LEFT]: '#60a5fa',      // Light blue
  [ElementState.POINTER_RIGHT]: '#f87171',     // Light red
  [ElementState.IN_WINDOW]: '#60a5fa',         // Light blue (with opacity)
  [ElementState.PIVOT]: '#fb923c',             // Light orange
  [ElementState.SORTED]: '#86efac',            // Very light green
};

/**
 * Timing presets
 */
export const ANIMATION_SPEED_PRESETS = {
  VERY_SLOW: 0.25,
  SLOW: 0.5,
  NORMAL: 1.0,
  FAST: 2.0,
  VERY_FAST: 4.0,
};
