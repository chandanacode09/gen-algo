import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { VisualizationStateService } from '../../../core/services/visualization-state.service';
import { AlgorithmMetadata } from '../../../core/models';

@Component({
  selector: 'app-code-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-viewer.component.html',
  styleUrl: './code-viewer.component.scss'
})
export class CodeViewerComponent implements OnInit, OnDestroy {
  @Input() algorithmMetadata?: AlgorithmMetadata;

  private destroy$ = new Subject<void>();
  currentLine = -1;

  constructor(private visualizationStateService: VisualizationStateService) {}

  ngOnInit(): void {
    this.visualizationStateService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state.currentStepIndex >= 0 && state.steps[state.currentStepIndex]) {
          this.currentLine = state.steps[state.currentStepIndex].codeLine ?? -1;
        } else {
          this.currentLine = -1;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isHighlighted(index: number): boolean {
    return this.currentLine === index;
  }
}
