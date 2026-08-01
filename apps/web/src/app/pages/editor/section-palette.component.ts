import { Component, input, output } from '@angular/core';

export const SECTION_TYPES = [
  { type: 'hero', icon: '🏠', label: 'Hero' },
  { type: 'features', icon: '📊', label: 'Features' },
  { type: 'pricing', icon: '💰', label: 'Pricing' },
  { type: 'testimonials', icon: '💬', label: 'Testimonials' },
  { type: 'contact', icon: '📧', label: 'Contact' },
  { type: 'footer', icon: '🔗', label: 'Footer' },
] as const;

@Component({
  selector: 'app-section-palette',
  standalone: true,
  template: `
    <div class="p-3">
      <h3 class="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-3">Sections</h3>
      <div class="space-y-1">
        @for (st of sectionTypes; track st.type) {
          <div draggable="true" (dragstart)="onDragStart($event, st.type)"
            class="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-grab active:cursor-grabbing border border-transparent bg-secondary-50 dark:bg-secondary-100 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-200 text-sm text-secondary-700 dark:text-secondary-600 transition-colors">
            <span>{{ st.icon }}</span>
            <span>{{ st.label }}</span>
          </div>
        }
      </div>
      <p class="text-xs text-secondary-400 mt-4 text-center">↕ Drag section to canvas</p>
    </div>
  `
})
export class SectionPaletteComponent {
  readonly sectionTypes = SECTION_TYPES;
  readonly addSection = output<string>();

  onDragStart(event: DragEvent, type: string) {
    event.dataTransfer?.setData('text/plain', type);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
    }
  }
}
