# Algorithm Visualization Library

A modular, extensible algorithm visualization library built with Angular 17+ that helps users understand how various algorithms work through interactive visualizations and animations.

![Angular](https://img.shields.io/badge/Angular-17+-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **6 Sorting Algorithms** with smooth animations
  - Bubble Sort
  - Selection Sort
  - Insertion Sort
  - Quick Sort
  - Merge Sort
  - Heap Sort

- **Interactive Controls**
  - Play/Pause/Reset functionality
  - Step forward/backward through algorithm execution
  - Adjustable animation speed (50ms - 2000ms)
  - Optional audio feedback

- **Educational Features**
  - Real-time pseudocode highlighting
  - Live statistics (comparisons, swaps, array accesses)
  - Algorithm complexity information
  - Multiple input data types (random, sorted, reversed, nearly-sorted)

- **Modern UI/UX**
  - Dark and light theme support
  - Responsive design (desktop, tablet, mobile)
  - Smooth animations using Angular Animations API
  - Clean, modern interface with Material Design principles

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gen-algo
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:4200
```

## Usage

### Basic Controls

1. **Select an Algorithm**: Choose from the dropdown menu
2. **Configure Array**: Set size (5-100) and data type
3. **Generate Array**: Click "Generate New Array" to create a new dataset
4. **Visualize**: Click Play to watch the algorithm in action
5. **Control Playback**:
   - ▶️ Play: Start animation
   - ⏸ Pause: Pause animation
   - ⏮ Step Back: Go to previous step
   - ⏭ Step Forward: Go to next step
   - ⏹ Reset: Reset to initial state
6. **Adjust Speed**: Use the speed slider to control animation speed
7. **Toggle Theme**: Click the 🌙/☀️ button to switch between dark and light modes

### Viewing Statistics

The statistics panel shows:
- Algorithm name and complexity information
- Real-time comparison and swap counts
- Array access count
- Current step and progress

### Reading Pseudocode

The code viewer displays the algorithm's pseudocode with:
- Line-by-line highlighting as the algorithm executes
- Color-coded lines matching the current operation

## Architecture

### Project Structure

```
src/app/
├── core/                          # Core functionality
│   ├── models/                    # Data models and interfaces
│   │   ├── algorithm-step.model.ts
│   │   ├── visualization-config.model.ts
│   │   ├── algorithm-metadata.model.ts
│   │   └── visualization-state.model.ts
│   └── services/                  # Core services
│       ├── animation.service.ts          # Controls playback
│       ├── algorithm-executor.service.ts # Base algorithm class
│       ├── visualization-state.service.ts # State management
│       └── audio-feedback.service.ts     # Sound effects
│
├── shared/                        # Shared components
│   ├── components/
│   │   ├── control-panel/        # Playback controls
│   │   ├── code-viewer/          # Pseudocode display
│   │   └── statistics-panel/     # Stats display
│   └── animations/               # Angular animations
│
├── features/                     # Feature modules
│   ├── sorting/                  # Sorting algorithms (Phase 1 - Complete)
│   │   ├── algorithms/
│   │   │   ├── bubble-sort.service.ts
│   │   │   ├── quick-sort.service.ts
│   │   │   ├── selection-sort.service.ts
│   │   │   ├── insertion-sort.service.ts
│   │   │   ├── merge-sort.service.ts
│   │   │   └── heap-sort.service.ts
│   │   └── sorting-visualizer/
│   │
│   ├── pathfinding/             # Pathfinding (Phase 2 - Structure Only)
│   └── tree-algorithms/         # Tree algorithms (Phase 3 - Structure Only)
```

### Key Design Patterns

#### Service Layer Architecture

All algorithms extend the `BaseSortingAlgorithm` class:

```typescript
export abstract class AlgorithmExecutorService {
  abstract getMetadata(): AlgorithmMetadata;
  abstract execute(input: any): AlgorithmStep[];
  abstract generateData(size: number, type: string): any;
  abstract validateInput(input: any): boolean;
}
```

#### State Management

Uses RxJS `BehaviorSubject` for reactive state management:

```typescript
// In VisualizationStateService
private stateSubject = new BehaviorSubject<VisualizationState>(initialState);
public state$: Observable<VisualizationState> = this.stateSubject.asObservable();
```

Components subscribe to state changes and update accordingly.

#### Algorithm Step Model

Each algorithm generates an array of steps:

```typescript
interface AlgorithmStep {
  operationType: OperationType;  // COMPARE, SWAP, SET, etc.
  indices: number[];             // Affected array indices
  array: number[];               // Array state after step
  description: string;           // Human-readable description
  codeLine?: number;             // Line in pseudocode
}
```

## Adding New Algorithms

### 1. Create Algorithm Service

Create a new file in the appropriate feature module:

```typescript
import { Injectable } from '@angular/core';
import { BaseSortingAlgorithm } from '../../../core/services/algorithm-executor.service';
import { AlgorithmStep, AlgorithmMetadata, OperationType } from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class MyNewSortService extends BaseSortingAlgorithm {
  getMetadata(): AlgorithmMetadata {
    return {
      id: 'my-new-sort',
      name: 'My New Sort',
      category: AlgorithmCategory.SORTING,
      description: 'Description here',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n log n)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      isStable: true,
      isInPlace: true,
      pseudocode: [
        'line 1 of pseudocode',
        'line 2 of pseudocode'
      ]
    };
  }

  execute(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const arr = this.copyArray(input);

    // Implement your algorithm here
    // Push steps as you go

    return steps;
  }
}
```

### 2. Register in Visualizer

Add to the algorithms array in `sorting-visualizer.component.ts`:

```typescript
algorithms = [
  // ... existing algorithms
  { id: 'my-new-sort', name: 'My New Sort', service: this.myNewSortService }
];
```

### 3. Inject Service

Add to constructor:

```typescript
constructor(
  // ... existing services
  private myNewSortService: MyNewSortService
) {}
```

## Customization

### Colors

Edit color schemes in `src/app/core/models/visualization-config.model.ts`:

```typescript
export const DEFAULT_VISUALIZATION_CONFIG: VisualizationConfig = {
  colors: {
    default: '#4F46E5',    // Default bar color
    comparing: '#FDE047',  // Comparison color
    swapping: '#EF4444',   // Swap color
    sorted: '#10B981',     // Sorted color
    pivot: '#FB923C'       // Pivot color
  },
  // ...
};
```

### Themes

Modify CSS variables in `src/styles.scss`:

```scss
.light-theme {
  --primary-color: #4F46E5;
  // ... other variables
}

.dark-theme {
  --primary-color: #6366F1;
  // ... other variables
}
```

## Performance Considerations

- Uses `trackBy` functions in `*ngFor` loops for efficient rendering
- `OnPush` change detection strategy where possible
- Debounced speed slider changes
- CSS transitions for smooth animations
- Lazy loading ready for algorithm modules

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements (Not Yet Implemented)

### Phase 2: Pathfinding Algorithms
- Breadth-First Search (BFS)
- Depth-First Search (DFS)
- Dijkstra's Algorithm
- A* Algorithm

### Phase 3: Tree Algorithms
- Tree Traversals (In-order, Pre-order, Post-order)
- Binary Search Tree operations
- Tree Balancing visualizations

### Planned Features
- Comparison mode (side-by-side algorithms)
- Algorithm race mode
- Tutorial/guided mode
- Custom input arrays
- Export animations as GIF
- Share visualizations via URL

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Code Quality

This project uses:
- TypeScript strict mode
- Angular best practices
- JSDoc documentation for services
- OnPush change detection where applicable

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Angular](https://angular.io/)
- Styled with custom CSS and CSS Variables
- Animations powered by Angular Animations API
- Audio feedback using Web Audio API

## Contact

For questions or feedback, please open an issue on GitHub.
