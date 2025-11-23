import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AnimationStep,
  AnimationType,
  ElementState,
  PointerType,
  HighlightStep,
  PointerMoveStep,
  PointerCreateStep,
  PointerRemoveStep,
  WindowCreateStep,
  WindowExpandStep,
  WindowShrinkStep,
  WindowSlideStep,
  SwapStep,
  UpdateValueStep,
} from '../models';

/**
 * Pointer state
 */
export interface PointerState {
  id: string;
  position: number;
  label?: string;
  color?: string;
  type: PointerType | string;
}

/**
 * Window state
 */
export interface WindowState {
  start: number;
  end: number;
}

/**
 * Complete animation visual state
 */
export interface AnimationVisualState {
  elementStates: Map<number, ElementState>;
  pointers: Map<string, PointerState>;
  window: WindowState | null;
  highlightedIndices: Set<number>;
}

/**
 * Animation State Manager
 * Tracks the current visual state of all elements during animation
 */
@Injectable({
  providedIn: 'root',
})
export class AnimationStateManager {
  // Current visual state
  private elementStates = new Map<number, ElementState>();
  private pointers = new Map<string, PointerState>();
  private window: WindowState | null = null;
  private highlightedIndices = new Set<number>();

  // Observables for state changes
  private elementStatesSubject = new BehaviorSubject<Map<number, ElementState>>(
    new Map()
  );
  private pointersSubject = new BehaviorSubject<Map<string, PointerState>>(
    new Map()
  );
  private windowSubject = new BehaviorSubject<WindowState | null>(null);

  public elementStates$: Observable<Map<number, ElementState>> =
    this.elementStatesSubject.asObservable();
  public pointers$: Observable<Map<string, PointerState>> =
    this.pointersSubject.asObservable();
  public window$: Observable<WindowState | null> =
    this.windowSubject.asObservable();

  constructor() {}

  /**
   * Apply an animation step to update visual state
   */
  applyStep(step: AnimationStep, arrayLength: number): void {
    switch (step.type) {
      case AnimationType.HIGHLIGHT:
        this.applyHighlight(step as HighlightStep);
        break;

      case AnimationType.UNHIGHLIGHT:
        this.applyUnhighlight(step.indices);
        break;

      case AnimationType.POINTER_CREATE:
        this.createPointer(step as PointerCreateStep);
        break;

      case AnimationType.POINTER_MOVE:
        this.movePointer(step as PointerMoveStep);
        break;

      case AnimationType.POINTER_REMOVE:
        this.removePointer(step as PointerRemoveStep);
        break;

      case AnimationType.WINDOW_CREATE:
        this.createWindow(step as WindowCreateStep);
        break;

      case AnimationType.WINDOW_EXPAND:
        this.expandWindow(step as WindowExpandStep);
        break;

      case AnimationType.WINDOW_SHRINK:
        this.shrinkWindow(step as WindowShrinkStep);
        break;

      case AnimationType.WINDOW_SLIDE:
        this.slideWindow(step as WindowSlideStep);
        break;

      case AnimationType.WINDOW_REMOVE:
        this.removeWindow();
        break;

      case AnimationType.MARK_VISITED:
      case AnimationType.MARK_CURRENT:
      case AnimationType.MARK_RESULT:
      case AnimationType.MARK_INVALID:
      case AnimationType.MARK_CANDIDATE:
        this.applyMark(step);
        break;

      default:
        // Other animation types don't affect persistent state
        break;
    }

    // Emit updated state
    this.emitStateChanges();
  }

  /**
   * Get current state for a specific element
   */
  getElementState(index: number): ElementState {
    return this.elementStates.get(index) || ElementState.DEFAULT;
  }

  /**
   * Get all element states
   */
  getAllElementStates(): Map<number, ElementState> {
    return new Map(this.elementStates);
  }

  /**
   * Get pointer position
   */
  getPointerPosition(pointerId: string): number | null {
    return this.pointers.get(pointerId)?.position ?? null;
  }

  /**
   * Get all pointers
   */
  getAllPointers(): Map<string, PointerState> {
    return new Map(this.pointers);
  }

  /**
   * Get window bounds
   */
  getWindowBounds(): WindowState | null {
    return this.window ? { ...this.window } : null;
  }

  /**
   * Check if index is in window
   */
  isInWindow(index: number): boolean {
    if (!this.window) return false;
    return index >= this.window.start && index <= this.window.end;
  }

  /**
   * Check if index is highlighted
   */
  isHighlighted(index: number): boolean {
    return this.highlightedIndices.has(index);
  }

  /**
   * Get complete visual state snapshot
   */
  getVisualState(): AnimationVisualState {
    return {
      elementStates: new Map(this.elementStates),
      pointers: new Map(this.pointers),
      window: this.window ? { ...this.window } : null,
      highlightedIndices: new Set(this.highlightedIndices),
    };
  }

  /**
   * Restore visual state from snapshot
   */
  restoreVisualState(state: AnimationVisualState): void {
    this.elementStates = new Map(state.elementStates);
    this.pointers = new Map(state.pointers);
    this.window = state.window ? { ...state.window } : null;
    this.highlightedIndices = new Set(state.highlightedIndices);
    this.emitStateChanges();
  }

  /**
   * Reset all state
   */
  reset(): void {
    this.elementStates.clear();
    this.pointers.clear();
    this.window = null;
    this.highlightedIndices.clear();
    this.emitStateChanges();
  }

  /**
   * Clear element states only
   */
  clearElementStates(): void {
    this.elementStates.clear();
    this.highlightedIndices.clear();
    this.elementStatesSubject.next(new Map(this.elementStates));
  }

  // ========================================
  // Private Helper Methods
  // ========================================

  private applyHighlight(step: HighlightStep): void {
    step.indices.forEach((index) => {
      this.elementStates.set(index, step.state);
      this.highlightedIndices.add(index);
    });
  }

  private applyUnhighlight(indices: number[]): void {
    indices.forEach((index) => {
      this.elementStates.set(index, ElementState.DEFAULT);
      this.highlightedIndices.delete(index);
    });
  }

  private createPointer(step: PointerCreateStep): void {
    const pointerId =
      typeof step.pointer === 'string' ? step.pointer : step.pointer.toString();

    this.pointers.set(pointerId, {
      id: pointerId,
      position: step.atIndex,
      label: step.label,
      color: step.color,
      type: step.pointer,
    });
  }

  private movePointer(step: PointerMoveStep): void {
    const pointerId =
      typeof step.pointer === 'string' ? step.pointer : step.pointer.toString();

    const existing = this.pointers.get(pointerId);
    if (existing) {
      this.pointers.set(pointerId, {
        ...existing,
        position: step.toIndex,
        label: step.label || existing.label,
      });
    }
  }

  private removePointer(step: PointerRemoveStep): void {
    const pointerId =
      typeof step.pointer === 'string' ? step.pointer : step.pointer.toString();

    this.pointers.delete(pointerId);
  }

  private createWindow(step: WindowCreateStep): void {
    this.window = {
      start: step.start,
      end: step.end,
    };

    // Auto-highlight elements in window
    for (let i = step.start; i <= step.end; i++) {
      if (!this.elementStates.has(i)) {
        this.elementStates.set(i, ElementState.IN_WINDOW);
      }
    }
  }

  private expandWindow(step: WindowExpandStep): void {
    if (!this.window) return;

    const oldStart = this.window.start;
    const oldEnd = this.window.end;

    if (step.newStart !== undefined) {
      this.window.start = step.newStart;
    }
    if (step.newEnd !== undefined) {
      this.window.end = step.newEnd;
    }

    // Highlight new elements
    if (step.newEnd !== undefined && step.newEnd > oldEnd) {
      for (let i = oldEnd + 1; i <= step.newEnd; i++) {
        this.elementStates.set(i, ElementState.IN_WINDOW);
      }
    }
    if (step.newStart !== undefined && step.newStart < oldStart) {
      for (let i = step.newStart; i < oldStart; i++) {
        this.elementStates.set(i, ElementState.IN_WINDOW);
      }
    }
  }

  private shrinkWindow(step: WindowShrinkStep): void {
    if (!this.window) return;

    const oldStart = this.window.start;
    const oldEnd = this.window.end;

    if (step.newStart !== undefined) {
      // Remove highlight from elements leaving window
      for (let i = oldStart; i < step.newStart; i++) {
        this.elementStates.set(i, ElementState.VISITED);
      }
      this.window.start = step.newStart;
    }

    if (step.newEnd !== undefined) {
      // Remove highlight from elements leaving window
      for (let i = step.newEnd + 1; i <= oldEnd; i++) {
        this.elementStates.set(i, ElementState.VISITED);
      }
      this.window.end = step.newEnd;
    }
  }

  private slideWindow(step: WindowSlideStep): void {
    if (this.window) {
      const oldStart = this.window.start;
      const oldEnd = this.window.end;

      // Mark old elements as visited
      for (let i = oldStart; i < step.newStart; i++) {
        this.elementStates.set(i, ElementState.VISITED);
      }

      // Mark new elements as in window
      for (let i = oldEnd + 1; i <= step.newEnd; i++) {
        this.elementStates.set(i, ElementState.IN_WINDOW);
      }
    }

    this.window = {
      start: step.newStart,
      end: step.newEnd,
    };
  }

  private removeWindow(): void {
    if (this.window) {
      // Clear window highlighting
      for (let i = this.window.start; i <= this.window.end; i++) {
        if (this.elementStates.get(i) === ElementState.IN_WINDOW) {
          this.elementStates.set(i, ElementState.DEFAULT);
        }
      }
    }
    this.window = null;
  }

  private applyMark(step: AnimationStep): void {
    const stateMap: Record<AnimationType, ElementState> = {
      [AnimationType.MARK_VISITED]: ElementState.VISITED,
      [AnimationType.MARK_CURRENT]: ElementState.CURRENT,
      [AnimationType.MARK_RESULT]: ElementState.RESULT,
      [AnimationType.MARK_INVALID]: ElementState.INVALID,
      [AnimationType.MARK_CANDIDATE]: ElementState.CANDIDATE,
    };

    const state = stateMap[step.type as AnimationType];
    if (state && 'indices' in step) {
      (step as any).indices.forEach((index: number) => {
        this.elementStates.set(index, state);
        this.highlightedIndices.add(index);
      });
    }
  }

  private emitStateChanges(): void {
    this.elementStatesSubject.next(new Map(this.elementStates));
    this.pointersSubject.next(new Map(this.pointers));
    this.windowSubject.next(this.window ? { ...this.window } : null);
  }

  /**
   * Cleanup on destroy
   */
  destroy(): void {
    this.reset();
    this.elementStatesSubject.complete();
    this.pointersSubject.complete();
    this.windowSubject.complete();
  }
}
