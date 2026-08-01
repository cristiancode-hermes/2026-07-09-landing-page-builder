import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="fixed inset-0 modal-overlay dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" (click)="cancel.emit()">
        <div class="bg-secondary-100 dark:bg-secondary-100 rounded-md  max-w-md w-full" (click)="$event.stopPropagation()">
          <div class="px-6 py-4 border-b border-secondary-200 dark:border-secondary-300">
            <h3 class="text-lg font-semibold text-secondary-800 dark:text-secondary-700">{{ title() }}</h3>
          </div>
          <div class="px-6 py-4">
            <p class="text-secondary-600">{{ message() }}</p>
          </div>
          <div class="px-6 py-4 border-t border-secondary-200 dark:border-secondary-300 flex justify-end gap-3">
            <button (click)="cancel.emit()"
              class="px-4 py-2 text-sm font-medium text-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-200 rounded-md transition-colors">
              {{ cancelLabel() }}
            </button>
            <button (click)="confirm.emit()"
              class="px-4 py-2 text-sm font-medium text-ink bg-danger-500 hover:bg-danger-600 rounded-md transition-colors">
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmModalComponent {
  readonly visible = input(false);
  readonly title = input('Are you sure?');
  readonly message = input('');
  readonly confirmLabel = input('Confirm');
  readonly cancelLabel = input('Cancel');
  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
