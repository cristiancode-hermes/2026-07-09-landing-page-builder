import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
      [class.bg-success-50]="variant() === 'success'"
      [class.text-success-600]="variant() === 'success'"
      [class.bg-warning-50]="variant() === 'warning'"
      [class.text-warning-600]="variant() === 'warning'"
      [class.bg-secondary-100]="variant() === 'default'"
      [class.text-secondary-600]="variant() === 'default'"
      [class.dark:bg-success-50/20]="variant() === 'success'"
      [class.dark:text-success-500]="variant() === 'success'"
      [class.dark:bg-warning-50/20]="variant() === 'warning'"
      [class.dark:text-warning-500]="variant() === 'warning'">
      {{ label() }}
    </span>
  `
})
export class BadgeComponent {
  readonly label = input('');
  readonly variant = input<'success' | 'warning' | 'default'>('default');
}
