import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/animations';

/**
 * Animation for bar height changes
 */
export const barHeightAnimation = trigger('barHeight', [
  transition('* => *', [
    animate('300ms ease-in-out')
  ])
]);

/**
 * Animation for bar color state changes
 */
export const barStateAnimation = trigger('barState', [
  state('default', style({
    backgroundColor: '{{ defaultColor }}',
    transform: 'scale(1)'
  }), { params: { defaultColor: '#4F46E5' } }),

  state('comparing', style({
    backgroundColor: '{{ comparingColor }}',
    transform: 'scale(1.05)'
  }), { params: { comparingColor: '#FDE047' } }),

  state('swapping', style({
    backgroundColor: '{{ swappingColor }}',
    transform: 'scale(1.1) translateY(-5px)'
  }), { params: { swappingColor: '#EF4444' } }),

  state('sorted', style({
    backgroundColor: '{{ sortedColor }}',
    transform: 'scale(1)'
  }), { params: { sortedColor: '#10B981' } }),

  state('pivot', style({
    backgroundColor: '{{ pivotColor }}',
    transform: 'scale(1.05)'
  }), { params: { pivotColor: '#FB923C' } }),

  transition('* => *', [
    animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
  ])
]);

/**
 * Swap animation with arc motion
 */
export const swapAnimation = trigger('swap', [
  transition(':increment', [
    animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)', keyframes([
      style({ transform: 'translateX(0) translateY(0)', offset: 0 }),
      style({ transform: 'translateX(50%) translateY(-30px)', offset: 0.5 }),
      style({ transform: 'translateX(100%) translateY(0)', offset: 1.0 })
    ]))
  ]),
  transition(':decrement', [
    animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)', keyframes([
      style({ transform: 'translateX(0) translateY(0)', offset: 0 }),
      style({ transform: 'translateX(-50%) translateY(-30px)', offset: 0.5 }),
      style({ transform: 'translateX(-100%) translateY(0)', offset: 1.0 })
    ]))
  ])
]);

/**
 * Fade in/out animation
 */
export const fadeAnimation = trigger('fade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-in', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-out', style({ opacity: 0 }))
  ])
]);

/**
 * Slide animation for panels
 */
export const slideAnimation = trigger('slide', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('300ms ease-out', style({ transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
  ])
]);

/**
 * Highlight pulse animation
 */
export const pulseAnimation = trigger('pulse', [
  state('inactive', style({
    transform: 'scale(1)',
    opacity: 1
  })),
  state('active', style({
    transform: 'scale(1.1)',
    opacity: 0.8
  })),
  transition('inactive <=> active', [
    animate('500ms ease-in-out')
  ])
]);
