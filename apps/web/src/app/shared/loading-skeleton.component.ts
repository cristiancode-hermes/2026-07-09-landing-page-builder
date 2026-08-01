import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `
    <div class="animate-pulse space-y-2">
      @if (shape() === 'card') {
        <div class="h-32 bg-secondary-200 dark:bg-secondary-300 rounded-md"></div>
        <div class="h-4 bg-secondary-200 dark:bg-secondary-300 rounded w-3/4"></div>
        <div class="h-3 bg-secondary-200 dark:bg-secondary-300 rounded w-1/2"></div>
      } @else if (shape() === 'grid') {
        <div class="grid grid-cols-3 gap-4">
          @for (_ of [1,2,3,4,5,6]; track _) {
            <div class="h-40 bg-secondary-200 dark:bg-secondary-300 rounded-md"></div>
          }
        </div>
      } @else {
        <div class="h-4 bg-secondary-200 dark:bg-secondary-300 rounded w-full mb-2"></div>
        <div class="h-4 bg-secondary-200 dark:bg-secondary-300 rounded w-5/6"></div>
        <div class="h-4 bg-secondary-200 dark:bg-secondary-300 rounded w-2/3"></div>
      }
    </div>
  `
})
export class LoadingSkeletonComponent {
  readonly shape = input<'card' | 'grid' | 'text'>('text');
}
