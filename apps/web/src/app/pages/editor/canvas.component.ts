import { Component, input, output, signal } from '@angular/core';
import { Section } from '../../services/section.service';
import { CanvasSectionComponent } from './canvas-section.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CanvasSectionComponent, EmptyStateComponent],
  template: `
    <div class="flex-1 overflow-y-auto p-6 bg-editor-bg"
      [style.backgroundColor]="'var(--editor-bg, #f1f5f9)'"
      (dragover)="onDragOver($event)"
      (drop)="onDrop($event)"
      (dragleave)="onDragLeave()">

      <!-- Viewport wrapper -->
      <div class="mx-auto transition-all duration-300"
        [style.maxWidth]="viewportWidth()"
        [style.backgroundColor]="'var(--editor-panel, #ffffff)'"
        class="bg-secondary-100 dark:bg-secondary-100 rounded-md  min-h-[400px]">

        @if (sections().length === 0) {
          <app-empty-state icon="🎯" title="Drag sections here" description="Drag sections from the left panel to start building your page." />
        }

        <div class="space-y-4 p-4">
          @for (section of sortedSections(); track section.id) {
            <div class="relative">
              <!-- Drop zone above -->
              <div class="h-2 -mb-2 z-10 relative"
                (dragover)="onDragOver($event, $index)"
                (drop)="onDropAt($event, $index)"
                class="transition-all"
                [class.h-8]="dropIndex() === $index"
                [class.border-2]="dropIndex() === $index"
                [class.border-dashed]="dropIndex() === $index"
                [class.border-primary-300]="dropIndex() === $index"
                [class.bg-primary-50/50]="dropIndex() === $index"
                [class.rounded-md]="dropIndex() === $index">
              </div>
              <app-canvas-section [section]="section" [isSelected]="selectedId() === section.id"
                (select)="selectSection.emit($event)" (delete)="deleteSection.emit($event)"
                (duplicate)="duplicateSection.emit($event)" />
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class CanvasComponent {
  readonly sections = input.required<Section[]>();
  readonly selectedId = input<string | null>(null);
  readonly viewport = input<'desktop' | 'tablet' | 'mobile'>('desktop');
  readonly selectSection = output<string>();
  readonly deleteSection = output<string>();
  readonly duplicateSection = output<string>();
  readonly reorder = output<{ id: string; position: number }>();
  readonly addSection = output<string>();

  readonly dropIndex = signal<number | null>(null);

  get sortedSections() {
    return () => [...this.sections()].sort((a, b) => a.position - b.position);
  }

  get viewportWidth() {
    return () => {
      switch (this.viewport()) {
        case 'mobile': return '375px';
        case 'tablet': return '768px';
        default: return '100%';
      }
    };
  }

  onDragOver(event: DragEvent, index?: number) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    this.dropIndex.set(index ?? null);
  }

  onDragLeave() {
    this.dropIndex.set(null);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dropIndex.set(null);
    const type = event.dataTransfer?.getData('text/plain');
    if (type && SECTION_TYPES.some(st => st.type === type)) {
      this.addSection.emit(type);
    }
  }

  onDropAt(event: DragEvent, index: number) {
    event.preventDefault();
    this.dropIndex.set(null);
    const sectionId = event.dataTransfer?.getData('application/section-id');
    if (sectionId) {
      this.reorder.emit({ id: sectionId, position: index });
    } else {
      const type = event.dataTransfer?.getData('text/plain');
      if (type) {
        this.addSection.emit(type);
      }
    }
  }
}

const SECTION_TYPES = [
  { type: 'hero', icon: '🏠', label: 'Hero' },
  { type: 'features', icon: '📊', label: 'Features' },
  { type: 'pricing', icon: '💰', label: 'Pricing' },
  { type: 'testimonials', icon: '💬', label: 'Testimonials' },
  { type: 'contact', icon: '📧', label: 'Contact' },
  { type: 'footer', icon: '🔗', label: 'Footer' },
];
