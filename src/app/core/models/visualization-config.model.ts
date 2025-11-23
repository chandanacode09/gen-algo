/**
 * Configuration for visualization appearance and behavior
 */
export interface VisualizationConfig {
  /** Animation speed in milliseconds per step */
  animationSpeed: number;

  /** Color scheme for different states */
  colors: {
    default: string;
    comparing: string;
    swapping: string;
    sorted: string;
    pivot: string;
    current: string;
    visiting: string;
  };

  /** Array size limits */
  arraySize: {
    min: number;
    max: number;
    default: number;
  };

  /** Whether sound effects are enabled */
  soundEnabled: boolean;

  /** Whether to show code highlighting */
  showCode: boolean;

  /** Whether to show statistics */
  showStats: boolean;
}

/**
 * Default visualization configuration
 */
export const DEFAULT_VISUALIZATION_CONFIG: VisualizationConfig = {
  animationSpeed: 500,
  colors: {
    default: '#4F46E5',
    comparing: '#FDE047',
    swapping: '#EF4444',
    sorted: '#10B981',
    pivot: '#FB923C',
    current: '#7C3AED',
    visiting: '#06B6D4'
  },
  arraySize: {
    min: 5,
    max: 100,
    default: 30
  },
  soundEnabled: false,
  showCode: true,
  showStats: true
};
