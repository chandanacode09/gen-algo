import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { VisualizationStateService } from '../../../core/services/visualization-state.service';
import { AnimationService } from '../../../core/services/animation.service';
import { AudioFeedbackService } from '../../../core/services/audio-feedback.service';
import { AlgorithmMetadata, DEFAULT_VISUALIZATION_CONFIG } from '../../../core/models';
import { ControlPanelComponent } from '../../../shared/components/control-panel/control-panel.component';
import { StatisticsPanelComponent } from '../../../shared/components/statistics-panel/statistics-panel.component';
import { CodeViewerComponent } from '../../../shared/components/code-viewer/code-viewer.component';
import { BubbleSortService } from '../algorithms/bubble-sort.service';
import { QuickSortService } from '../algorithms/quick-sort.service';
import { SelectionSortService } from '../algorithms/selection-sort.service';
import { InsertionSortService } from '../algorithms/insertion-sort.service';
import { MergeSortService } from '../algorithms/merge-sort.service';
import { HeapSortService } from '../algorithms/heap-sort.service';

interface BarState {
  value: number;
  state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';
}

@Component({
  selector: 'app-sorting-visualizer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ControlPanelComponent,
    StatisticsPanelComponent,
    CodeViewerComponent
  ],
  templateUrl: './sorting-visualizer.component.html',
  styleUrl: './sorting-visualizer.component.scss'
})
export class SortingVisualizerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  bars: BarState[] = [];
  config = DEFAULT_VISUALIZATION_CONFIG;
  selectedAlgorithm = 'bubble-sort';
  arraySize = 30;
  dataType = 'random';
  algorithmMetadata?: AlgorithmMetadata;
  showCodePanel = true;
  showStatsPanel = true;

  algorithms = [
    { id: 'bubble-sort', name: 'Bubble Sort', service: this.bubbleSortService },
    { id: 'quick-sort', name: 'Quick Sort', service: this.quickSortService },
    { id: 'selection-sort', name: 'Selection Sort', service: this.selectionSortService },
    { id: 'insertion-sort', name: 'Insertion Sort', service: this.insertionSortService },
    { id: 'merge-sort', name: 'Merge Sort', service: this.mergeSortService },
    { id: 'heap-sort', name: 'Heap Sort', service: this.heapSortService }
  ];

  constructor(
    private visualizationStateService: VisualizationStateService,
    private animationService: AnimationService,
    private audioService: AudioFeedbackService,
    private bubbleSortService: BubbleSortService,
    private quickSortService: QuickSortService,
    private selectionSortService: SelectionSortService,
    private insertionSortService: InsertionSortService,
    private mergeSortService: MergeSortService,
    private heapSortService: HeapSortService
  ) {}

  ngOnInit(): void {
    this.visualizationStateService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.updateBars(state.array, state.highlightedIndices, state.sortedIndices);
      });

    this.generateArray();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generateArray(): void {
    const algorithm = this.algorithms.find(a => a.id === this.selectedAlgorithm);
    if (!algorithm) return;

    const array = algorithm.service.generateData(this.arraySize, this.dataType);
    this.algorithmMetadata = algorithm.service.getMetadata();
    const steps = algorithm.service.execute(array);
    this.visualizationStateService.initialize(array, steps);
    this.animationService.reset();
  }

  onAlgorithmChange(): void {
    this.generateArray();
  }

  onArraySizeChange(): void {
    this.generateArray();
  }

  onDataTypeChange(): void {
    this.generateArray();
  }

  toggleCodePanel(): void {
    this.showCodePanel = !this.showCodePanel;
  }

  toggleStatsPanel(): void {
    this.showStatsPanel = !this.showStatsPanel;
  }

  private updateBars(
    array: number[],
    highlightedIndices: Set<number>,
    sortedIndices: Set<number>
  ): void {
    const state = this.visualizationStateService.getCurrentState();
    const currentStep = state.steps[state.currentStepIndex];

    this.bars = array.map((value, index) => {
      let barState: BarState['state'] = 'default';

      if (sortedIndices.has(index)) {
        barState = 'sorted';
      } else if (currentStep?.metadata?.pivot === index) {
        barState = 'pivot';
      } else if (highlightedIndices.has(index)) {
        barState = currentStep?.operationType === 'swap' ? 'swapping' : 'comparing';
      }

      return { value, state: barState };
    });
  }

  getBarHeight(value: number): number {
    const maxValue = Math.max(...this.bars.map(b => b.value), 1);
    return (value / maxValue) * 100;
  }

  getBarColor(state: string): string {
    switch (state) {
      case 'comparing':
        return this.config.colors.comparing;
      case 'swapping':
        return this.config.colors.swapping;
      case 'sorted':
        return this.config.colors.sorted;
      case 'pivot':
        return this.config.colors.pivot;
      default:
        return this.config.colors.default;
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
