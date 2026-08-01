import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div class="text-5xl mb-4">⚠️</div>
      <h3 class="text-lg font-semibold text-secondary-800 dark:text-secondary-700 mb-2">{{ message() }}</h3>
      @if (showRetry()) {
        <button (click)="retry.emit()"
          class="px-5 py-2.5 bg-primary-500 text-ink rounded-md hover:bg-primary-600 font-medium transition-colors mt-2">
          Try Again
        </button>
      }
    </div>
  `
})
export class ErrorStateComponent {
  readonly message = input('Something went wrong');
  readonly showRetry = input(true);
  readonly retry = output<void>();
}
