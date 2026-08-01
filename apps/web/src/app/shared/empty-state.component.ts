import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div class="text-5xl mb-4">{{ icon() }}</div>
      <h3 class="text-lg font-semibold text-secondary-800 dark:text-secondary-700 mb-2">{{ title() }}</h3>
      <p class="text-secondary-500 max-w-md mb-6">{{ description() }}</p>
      @if (actionLabel()) {
        <button (click)="action.emit()"
          class="px-5 py-2.5 bg-primary-500 text-ink rounded-md hover:bg-primary-600 font-medium transition-colors">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `
})
export class EmptyStateComponent {
  readonly icon = input('📋');
  readonly title = input('Nothing here yet');
  readonly description = input('');
  readonly actionLabel = input('');
  readonly action = output<void>();
}
