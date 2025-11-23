# Animation Framework

A standardized, composable animation system for algorithm visualization.

## Overview

This framework provides:
- **Reusable animation primitives** - Atomic operations like highlight, swap, compare
- **Composable templates** - Pre-built patterns for common scenarios
- **Centralized engine** - Single service to manage playback
- **Type-safe** - Full TypeScript support
- **Theme-aware** - Works with light/dark modes

## Quick Start

### 1. Import the Framework

```typescript
import {
  AnimationEngineService,
  AnimationType,
  ElementState,
  highlight,
  compare,
  swap,
  createPointer,
  movePointer,
  initializeTwoPointers,
  compareTwoPointerElements,
} from '@core/animations';
```

### 2. Create Animation Steps

Using **builders** (recommended):

```typescript
import { highlight, compare, swap, ElementState, ComparisonOp } from '@core/animations';

const steps = [
  highlight([0, 1], ElementState.COMPARING, 'Select elements to compare'),
  compare([0, 1], ComparisonOp.GREATER_THAN, 'Compare values'),
  swap(0, 1, 'Swap if out of order'),
];
```

Using **templates** for common patterns:

```typescript
import {
  initializeTwoPointers,
  compareTwoPointerElements,
  foundTwoPointerSolution,
} from '@core/animations';

const steps = [
  ...initializeTwoPointers(0, arr.length - 1),
  ...compareTwoPointerElements(0, arr.length - 1, ComparisonOp.SUM),
  ...foundTwoPointerSolution(0, arr.length - 1),
];
```

### 3. Load and Play Animations

```typescript
import { AnimationEngineService } from '@core/animations';

export class MyComponent {
  constructor(private animationEngine: AnimationEngineService) {}

  visualize() {
    // Load the steps
    this.animationEngine.loadSteps(steps);

    // Subscribe to step changes
    this.animationEngine.stepExecuted$.subscribe(({ step, index }) => {
      console.log(`Executing step ${index}:`, step.description);
      // Apply visual changes based on step type
    });

    // Play the animation
    this.animationEngine.play();
  }

  // Control playback
  pause() { this.animationEngine.pause(); }
  stepForward() { this.animationEngine.stepForward(); }
  stepBackward() { this.animationEngine.stepBackward(); }
}
```

## Animation Primitives

### Highlighting

```typescript
// Highlight elements
highlight([0, 1, 2], ElementState.CURRENT, 'Processing these elements')

// Mark as visited
highlight([5], ElementState.VISITED, 'Already processed')

// Mark as result
highlight([3, 7], ElementState.RESULT, 'Found the answer!')
```

### Pointers

```typescript
// Create pointers
createPointer(PointerType.LEFT, 0, 'Initialize left pointer', {
  label: 'L',
  color: '#3b82f6'
})

// Move pointers
movePointer(PointerType.LEFT, 5, 'Move left pointer forward')

// Remove pointers
removePointer(PointerType.LEFT, 'Clean up')
```

### Sliding Window

```typescript
// Create window
createWindow(0, 3, 'Initial window of size 3')

// Expand window
expandWindow('Grow window', { newEnd: 5 })

// Shrink window
shrinkWindow('Shrink window', { newStart: 2 })

// Slide window
slideWindow(1, 4, 'Slide window forward')
```

### Comparisons

```typescript
compare([0, 1], ComparisonOp.LESS_THAN, 'Is arr[0] < arr[1]?')
compare([2, 5], ComparisonOp.SUM, 'Sum of elements', { showValue: true })
compare([3], ComparisonOp.EQUAL, 'Check if equal to target', { result: true })
```

### Swapping & Movement

```typescript
swap(0, 5, 'Swap first and last elements')
move(3, 7, 'Move element from index 3 to 7')
```

### Effects

```typescript
pulse([0, 1], 'Draw attention', { cycles: 2 })
flash([5], 'Quick highlight', { color: '#22c55e' })
```

## Animation Templates

### Two Pointers

```typescript
import {
  initializeTwoPointers,
  compareTwoPointerElements,
  movePointersInward,
  foundTwoPointerSolution,
} from '@core/animations';

const twoSumAnimation = [
  ...initializeTwoPointers(0, arr.length - 1),
  ...compareTwoPointerElements(left, right, ComparisonOp.SUM, sum, true),
  ...movePointersInward(left + 1, right - 1),
  ...foundTwoPointerSolution(left, right),
];
```

### Sliding Window

```typescript
import {
  initializeSlidingWindow,
  expandWindowRight,
  shrinkWindowLeft,
  slideWindowForward,
} from '@core/animations';

const slidingWindowAnimation = [
  ...initializeSlidingWindow(0, k - 1, k),
  ...expandWindowRight(currentEnd, currentEnd + 1),
  ...shrinkWindowLeft(currentStart, currentStart + 1),
  ...slideWindowForward(oldStart, oldEnd, newStart, newEnd),
];
```

### Binary Search

```typescript
import { binarySearchStep } from '@core/animations';

const steps = [
  ...binarySearchStep(left, right, mid, target, arr[mid]),
];
```

## Element States

Available states with semantic colors:

- `DEFAULT` - Neutral gray
- `CURRENT` - Active processing (blue)
- `COMPARING` - In comparison (orange)
- `CANDIDATE` - Potential answer (purple)
- `VALID` - Meets criteria (green)
- `INVALID` - Doesn't meet criteria (red)
- `VISITED` - Already processed (light gray)
- `RESULT` - Part of solution (bright green)
- `POINTER_LEFT` - Left pointer (blue)
- `POINTER_RIGHT` - Right pointer (red)
- `IN_WINDOW` - Inside sliding window (light blue)
- `PIVOT` - Pivot element (orange)
- `SORTED` - In sorted position (green)

## CSS Classes

Apply animation classes to elements:

```html
<!-- State classes -->
<div class="anim-state anim-state-current">Current Element</div>
<div class="anim-state anim-state-result">Result Element</div>

<!-- Animation classes -->
<div class="anim-pulse">Pulsing Element</div>
<div class="anim-flash">Flashing Element</div>
<div class="anim-glow">Glowing Element</div>

<!-- Transition classes -->
<div class="anim-transition-bounce">Bouncy Transition</div>
<div class="anim-transition-elastic">Elastic Transition</div>
```

## Configuration

```typescript
animationEngine.updateConfig({
  defaultDuration: 600,
  defaultDelay: 100,
  speedMultiplier: 2.0, // 2x speed
  autoPlay: true,
});
```

Speed presets:
- `VERY_SLOW: 0.25`
- `SLOW: 0.5`
- `NORMAL: 1.0`
- `FAST: 2.0`
- `VERY_FAST: 4.0`

## Complete Example: Two Sum

```typescript
import {
  AnimationEngineService,
  ElementState,
  ComparisonOp,
  createPointer,
  highlight,
  compare,
  movePointer,
  pulse,
} from '@core/animations';

function generateTwoSumAnimation(arr: number[], target: number) {
  const steps = [];
  let left = 0;
  let right = arr.length - 1;

  // Initialize pointers
  steps.push(
    createPointer('left', left, 'Start left pointer', { label: 'L' }),
    createPointer('right', right, 'Start right pointer', { label: 'R' }),
    highlight([left], ElementState.POINTER_LEFT, 'Highlight left'),
    highlight([right], ElementState.POINTER_RIGHT, 'Highlight right')
  );

  // Algorithm logic
  while (left < right) {
    const sum = arr[left] + arr[right];

    steps.push(
      compare([left, right], ComparisonOp.SUM, `Sum: ${sum}`, {
        showValue: true,
        result: sum,
      })
    );

    if (sum === target) {
      steps.push(...pulse([left, right], 'Found solution!', { cycles: 2 }));
      steps.push(highlight([left, right], ElementState.RESULT, 'Solution'));
      break;
    } else if (sum < target) {
      left++;
      steps.push(movePointer('left', left, 'Move left pointer right'));
      steps.push(highlight([left], ElementState.POINTER_LEFT, 'Update highlight'));
    } else {
      right--;
      steps.push(movePointer('right', right, 'Move right pointer left'));
      steps.push(highlight([right], ElementState.POINTER_RIGHT, 'Update highlight'));
    }
  }

  return steps;
}

// Usage in component
const steps = generateTwoSumAnimation([1, 3, 5, 7, 9], 12);
this.animationEngine.loadSteps(steps);
this.animationEngine.play();
```

## Architecture

```
core/animations/
├── models/
│   ├── animation-types.model.ts    # Enums and types
│   ├── animation-step.model.ts     # Step interfaces (with code sync)
│   ├── animation-config.model.ts   # Configuration
│   └── animation-snapshot.model.ts # Snapshot system
├── services/
│   ├── animation-engine.service.ts       # Playback engine
│   ├── animation-state-manager.service.ts # State tracking
│   └── animation-validator.service.ts     # Validation
├── components/
│   ├── array-item/                # Array element component
│   ├── pointer/                   # Pointer indicator
│   ├── window-overlay/            # Sliding window overlay
│   └── playback-controls/         # Play/pause/step controls
├── utils/
│   ├── animation-builders.ts      # Factory functions
│   └── animation-templates.ts     # Pre-built patterns
├── styles/
│   └── animations.scss            # CSS animations
└── index.ts                       # Public API
```

## Phase 1 Complete ✅

**New Additions:**
- ✅ **AnimationStateManager** - Tracks visual state of all elements
- ✅ **SnapshotManager** - Full undo/redo with data restoration
- ✅ **AnimationValidator** - Validates sequences before execution
- ✅ **Code Sync** - Link animations to code lines with explanations
- ✅ **Base Components** - ArrayItem, Pointer, Window, PlaybackControls

## Best Practices

1. **Use builders over raw objects** - More readable and type-safe
2. **Use templates for common patterns** - Consistent animations
3. **Set meaningful descriptions** - Helps with debugging
4. **Validate sequences** - Catch errors early with AnimationValidator
5. **Mark parallel steps** - Improve performance
6. **Configure speed** - Let users control playback speed
7. **Subscribe to state changes** - React to visual state updates
8. **Create snapshots** - Enable time travel debugging

## Next Steps

- Create pattern-specific composers for each of the 14 LeetCode patterns
- Build algorithm visualizations using base components
- Add code highlighting synchronized with animations
