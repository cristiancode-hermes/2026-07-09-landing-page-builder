import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  template: `
    <div class="flex items-center gap-2">
      <input type="color" [value]="value()" (input)="onColorChange($event)"
        class="w-10 h-10 rounded-md border border-secondary-200 p-0.5 cursor-pointer bg-transparent" />
      <input type="text" [value]="value()" (input)="onTextChange($event)"
        class="flex-1 px-3 py-2 bg-secondary-50 dark:bg-secondary-200 border border-secondary-300 rounded-md text-sm text-secondary-900 dark:text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono" />
    </div>
  `
})
export class ColorPickerComponent {
  readonly value = input('#6366f1');
  readonly change = output<string>();

  onColorChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.change.emit(input.value);
  }

  onTextChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (/^#[0-9a-fA-F]{6}$/.test(input.value)) {
      this.change.emit(input.value);
    }
  }
}
