import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Window Overlay Component
 * Visual indicator for sliding window in array visualization
 */
@Component({
  selector: 'app-window-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="window-overlay anim-window"
      [style.left.%]="leftPercent"
      [style.width.%]="widthPercent"
      [attr.data-window-start]="start"
      [attr.data-window-end]="end">
      <span class="window-label">{{ label }}</span>
    </div>
  `,
  styleUrls: ['./window-overlay.component.scss'],
})
export class WindowOverlayComponent {
  /** Window start index */
  @Input() start!: number;

  /** Window end index (inclusive) */
  @Input() end!: number;

  /** Total array length (for percentage calculation) */
  @Input() arrayLength!: number;

  /** Custom label */
  @Input() label: string = 'Window';

  /**
   * Calculate left position as percentage
   */
  get leftPercent(): number {
    if (this.arrayLength === 0) return 0;
    return (this.start / this.arrayLength) * 100;
  }

  /**
   * Calculate width as percentage
   */
  get widthPercent(): number {
    if (this.arrayLength === 0) return 0;
    const windowSize = this.end - this.start + 1;
    return (windowSize / this.arrayLength) * 100;
  }

  /**
   * Get window size
   */
  get windowSize(): number {
    return this.end - this.start + 1;
  }
}
