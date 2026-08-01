import { Component, input, output } from '@angular/core';
import { Section } from '../../services/section.service';
import { SectionRendererComponent } from './section-renderer.component';

@Component({
  selector: 'app-canvas-section',
  standalone: true,
  imports: [SectionRendererComponent],
  template: `
    <div class="relative group cursor-pointer rounded-md border-2 transition-all"
      [class.border-primary-500]="isSelected()"
      [class.ring-1]="isSelected()"
      [class.ring-primary-500]="isSelected()"
      [class.border-secondary-200]="!isSelected()"
      [class.hover:border-primary-300]="!isSelected()"
      [class.opacity-50]="isDragging()"
      [class.scale-[1.02]]="isDragging()"
      [class.]="isDragging()"
      (click)="select.emit(section().id)">

      <!-- Hover controls -->
      <div class="absolute top-2 right-2 z-10 hidden group-hover:flex items-center gap-1 bg-secondary-100 dark:bg-secondary-100 rounded-md  border border-secondary-200 px-1 py-0.5">
        <span class="cursor-grab active:cursor-grabbing text-secondary-400 px-1" draggable="true"
          (dragstart)="onDragStart($event)">⠿</span>
        <button (click)="$event.stopPropagation(); duplicate.emit(section().id)"
          class="text-xs text-secondary-500 hover:text-primary-500 px-1.5 py-0.5">📋</button>
        <button (click)="$event.stopPropagation(); delete.emit(section().id)"
          class="text-xs text-secondary-500 hover:text-danger-500 px-1.5 py-0.5">🗑</button>
      </div>

      <!-- Section preview -->
      <div class="p-4 pointer-events-none">
        <app-section-renderer [section]="section()" />
      </div>
    </div>
  `
})
export class CanvasSectionComponent {
  readonly section = input.required<Section>();
  readonly isSelected = input(false);
  readonly isDragging = input(false);
  readonly select = output<string>();
  readonly delete = output<string>();
  readonly duplicate = output<string>();

  onDragStart(event: DragEvent) {
    event.dataTransfer?.setData('application/section-id', this.section().id);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }
}
