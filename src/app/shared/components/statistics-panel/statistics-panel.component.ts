import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { VisualizationStateService } from '../../../core/services/visualization-state.service';
import { AlgorithmStatistics, AlgorithmMetadata } from '../../../core/models';

@Component({
  selector: 'app-statistics-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics-panel.component.html',
  styleUrl: './statistics-panel.component.scss'
})
export class StatisticsPanelComponent implements OnInit, OnDestroy {
  @Input() algorithmMetadata?: AlgorithmMetadata;

  private destroy$ = new Subject<void>();

  statistics: AlgorithmStatistics = {
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0,
    elapsedTime: 0,
    currentStep: 0,
    totalSteps: 0
  };

  constructor(private visualizationStateService: VisualizationStateService) {}

  ngOnInit(): void {
    this.visualizationStateService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.statistics = state.statistics;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get progress(): number {
    if (this.statistics.totalSteps === 0) {
      return 0;
    }
    return Math.round((this.statistics.currentStep / this.statistics.totalSteps) * 100);
  }
}
