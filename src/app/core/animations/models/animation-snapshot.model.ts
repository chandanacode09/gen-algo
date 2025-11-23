import { AnimationVisualState } from '../services/animation-state-manager.service';

/**
 * Snapshot of animation state at a specific step
 * Enables time travel (undo/redo) with full state restoration
 */
export interface AnimationSnapshot {
  /** Step index in the sequence */
  stepIndex: number;

  /** Actual data values (e.g., array contents) */
  dataState: any[];

  /** Visual state (element colors, pointers, windows) */
  visualState: AnimationVisualState;

  /** Timestamp when snapshot was created */
  timestamp: number;

  /** Optional metadata */
  metadata?: {
    description?: string;
    [key: string]: any;
  };
}

/**
 * Snapshot manager for storing and retrieving animation states
 */
export class SnapshotManager {
  private snapshots: AnimationSnapshot[] = [];
  private maxSnapshots: number = 1000; // Prevent memory overflow

  /**
   * Create and store a snapshot
   */
  createSnapshot(
    stepIndex: number,
    dataState: any[],
    visualState: AnimationVisualState,
    metadata?: any
  ): AnimationSnapshot {
    const snapshot: AnimationSnapshot = {
      stepIndex,
      dataState: [...dataState], // Deep copy
      visualState: this.deepCopyVisualState(visualState),
      timestamp: Date.now(),
      metadata,
    };

    this.snapshots.push(snapshot);

    // Trim old snapshots if exceeding max
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }

    return snapshot;
  }

  /**
   * Get snapshot at specific step index
   */
  getSnapshot(stepIndex: number): AnimationSnapshot | null {
    return (
      this.snapshots.find((s) => s.stepIndex === stepIndex) || null
    );
  }

  /**
   * Get closest snapshot at or before step index
   */
  getClosestSnapshot(stepIndex: number): AnimationSnapshot | null {
    // Find the latest snapshot that's <= stepIndex
    let closest: AnimationSnapshot | null = null;

    for (const snapshot of this.snapshots) {
      if (snapshot.stepIndex <= stepIndex) {
        if (!closest || snapshot.stepIndex > closest.stepIndex) {
          closest = snapshot;
        }
      }
    }

    return closest;
  }

  /**
   * Get all snapshots
   */
  getAllSnapshots(): AnimationSnapshot[] {
    return [...this.snapshots];
  }

  /**
   * Clear all snapshots
   */
  clear(): void {
    this.snapshots = [];
  }

  /**
   * Clear snapshots after a specific index
   */
  clearAfter(stepIndex: number): void {
    this.snapshots = this.snapshots.filter(
      (s) => s.stepIndex <= stepIndex
    );
  }

  /**
   * Get number of stored snapshots
   */
  getCount(): number {
    return this.snapshots.length;
  }

  /**
   * Set maximum number of snapshots to store
   */
  setMaxSnapshots(max: number): void {
    this.maxSnapshots = max;

    // Trim if needed
    if (this.snapshots.length > max) {
      this.snapshots = this.snapshots.slice(-max);
    }
  }

  /**
   * Export snapshots to JSON
   */
  export(): string {
    return JSON.stringify(this.snapshots, this.replacer);
  }

  /**
   * Import snapshots from JSON
   */
  import(json: string): void {
    try {
      const imported = JSON.parse(json, this.reviver);
      if (Array.isArray(imported)) {
        this.snapshots = imported;
      }
    } catch (error) {
      console.error('Failed to import snapshots:', error);
    }
  }

  /**
   * Deep copy visual state to prevent mutations
   */
  private deepCopyVisualState(
    state: AnimationVisualState
  ): AnimationVisualState {
    return {
      elementStates: new Map(state.elementStates),
      pointers: new Map(
        Array.from(state.pointers.entries()).map(([key, value]) => [
          key,
          { ...value },
        ])
      ),
      window: state.window ? { ...state.window } : null,
      highlightedIndices: new Set(state.highlightedIndices),
    };
  }

  /**
   * Custom replacer for JSON.stringify to handle Maps and Sets
   */
  private replacer(key: string, value: any): any {
    if (value instanceof Map) {
      return {
        __type: 'Map',
        data: Array.from(value.entries()),
      };
    }
    if (value instanceof Set) {
      return {
        __type: 'Set',
        data: Array.from(value),
      };
    }
    return value;
  }

  /**
   * Custom reviver for JSON.parse to restore Maps and Sets
   */
  private reviver(key: string, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.__type === 'Map') {
        return new Map(value.data);
      }
      if (value.__type === 'Set') {
        return new Set(value.data);
      }
    }
    return value;
  }
}
