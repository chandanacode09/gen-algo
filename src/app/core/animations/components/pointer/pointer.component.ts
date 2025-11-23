import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointerType } from '../../models';

/**
 * Pointer Component
 * Visual arrow/label that points to an array element
 */
@Component({
  selector: 'app-pointer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="pointer"
      [class]="getPointerClass()"
      [style.left.%]="leftPercent"
      [attr.data-pointer-id]="pointerId">
      <span class="pointer-label">{{ label || pointerId }}</span>
    </div>
  `,
  styleUrls: ['./pointer.component.scss'],
})
export class PointerComponent {
  /** Unique pointer identifier */
  @Input() pointerId!: string;

  /** Pointer type (LEFT, RIGHT, FAST, SLOW, etc.) */
  @Input() type: PointerType | string = PointerType.CURRENT;

  /** Display label */
  @Input() label?: string;

  /** Pointer color (optional override) */
  @Input() color?: string;

  /** Position as percentage (0-100) */
  @Input() leftPercent: number = 0;

  /**
   * Get CSS class based on pointer type
   */
  getPointerClass(): string {
    const typeClass = typeof this.type === 'string'
      ? this.type.toLowerCase()
      : this.type.toString().toLowerCase();

    return `anim-pointer anim-pointer-${typeClass}`;
  }

  /**
   * Get inline style with custom color
   */
  getStyle(): any {
    const style: any = {
      left: `${this.leftPercent}%`,
    };

    if (this.color) {
      style.backgroundColor = this.color;
      style.borderColor = this.color;
    }

    return style;
  }
}
