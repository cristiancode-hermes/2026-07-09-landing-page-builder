import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="fixed top-4 right-4 z-50 animate-slide-in">
        <div class="flex items-center gap-3 px-4 py-3 rounded-md  border min-w-[300px] max-w-md"
          [class.bg-success-50]="type() === 'success'"
          [class.border-success-500]="type() === 'success'"
          [class.text-success-600]="type() === 'success'"
          [class.bg-danger-50]="type() === 'error'"
          [class.border-danger-500]="type() === 'error'"
          [class.text-danger-600]="type() === 'error'"
          [class.bg-warning-50]="type() === 'warning'"
          [class.border-warning-500]="type() === 'warning'"
          [class.text-warning-600]="type() === 'warning'"
          [class.bg-primary-50]="type() === 'info'"
          [class.border-primary-500]="type() === 'info'"
          [class.text-primary-600]="type() === 'info'">
          <span class="text-lg">{{ icon() }}</span>
          <span class="text-sm font-medium flex-1">{{ message() }}</span>
          <button (click)="dismiss.emit()" class="text-current opacity-60 hover:opacity-100">&times;</button>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .animate-slide-in { animation: slideIn 0.3s ease-out; }
  `]
})
export class ToastComponent {
  readonly visible = input(false);
  readonly type = input<'success' | 'error' | 'warning' | 'info'>('info');
  readonly message = input('');
  readonly icon = input('ℹ️');
  readonly dismiss = output<void>();
}
