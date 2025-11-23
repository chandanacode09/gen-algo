import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { VisualizationStateService } from '../../../core/services/visualization-state.service';
import { AlgorithmMetadata } from '../../../core/models';

type Language = 'pseudocode' | 'python' | 'java' | 'javascript';

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
  selectedLanguage: Language = 'pseudocode';

  availableLanguages: { id: Language; name: string; icon: string }[] = [
    { id: 'pseudocode', name: 'Pseudocode', icon: '📝' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'javascript', name: 'JavaScript', icon: '⚡' }
  ];

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
    return this.currentLine === index && this.selectedLanguage === 'pseudocode';
  }

  selectLanguage(language: Language): void {
    this.selectedLanguage = language;
  }

  getCode(): string[] {
    if (!this.algorithmMetadata) return [];

    switch (this.selectedLanguage) {
      case 'python':
        return this.algorithmMetadata.codeImplementations?.python || [];
      case 'java':
        return this.algorithmMetadata.codeImplementations?.java || [];
      case 'javascript':
        return this.algorithmMetadata.codeImplementations?.javascript || [];
      default:
        return this.algorithmMetadata.pseudocode;
    }
  }

  isLanguageAvailable(language: Language): boolean {
    if (!this.algorithmMetadata) return false;
    if (language === 'pseudocode') return true;

    return !!this.algorithmMetadata.codeImplementations?.[language];
  }
}
