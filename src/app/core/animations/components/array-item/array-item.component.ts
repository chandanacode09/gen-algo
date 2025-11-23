import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElementState } from '../../models';

/**
 * Array Item Component
 * Displays a single element in an array visualization with state-based styling
 */
@Component({
  selector: 'app-array-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="array-item"
      [class]="getStateClass()"
      [style.height.px]="heightScale ? value * heightScale : null"
      [attr.data-index]="index"
      [attr.data-value]="value">
      <div class="array-value">{{ displayValue_computed }}</div>
      <div class="array-index" *ngIf="showIndex">{{ index }}</div>
    </div>
  `,
  styleUrls: ['./array-item.component.scss'],
})
export class ArrayItemComponent {
  /** Array index */
  @Input() index!: number;

  /** Element value */
  @Input() value!: any;

  /** Current element state */
  @Input() state: ElementState = ElementState.DEFAULT;

  /** Show index label? */
  @Input() showIndex: boolean = true;

  /** Height scale for bar visualization (value * scale = height in px) */
  @Input() heightScale?: number;

  /** Custom display value (if different from actual value) */
  @Input() displayValue?: string;

  /** Is this element being compared? */
  @Input() isComparing: boolean = false;

  /** Is this element highlighted? */
  @Input() isHighlighted: boolean = false;

  /**
   * Get CSS class based on current state
   */
  getStateClass(): string {
    const classes = ['anim-state', `anim-state-${this.state.toLowerCase()}`];

    if (this.isComparing) {
      classes.push('comparing');
    }

    if (this.isHighlighted) {
      classes.push('highlighted');
    }

    return classes.join(' ');
  }

  /**
   * Get display value
   */
  get displayValue_computed(): string {
    return this.displayValue !== undefined
      ? this.displayValue
      : String(this.value);
  }
}
