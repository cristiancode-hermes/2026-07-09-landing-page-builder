import { Component, input, output } from '@angular/core';
import { Section } from '../../services/section.service';
import { FormsModule } from '@angular/forms';
import { ColorPickerComponent } from '../../shared/color-picker.component';

@Component({
  selector: 'app-property-panel',
  standalone: true,
  imports: [FormsModule, ColorPickerComponent],
  template: `
    @if (section()) {
      <div class="p-4 space-y-4">
        <h3 class="text-sm font-semibold text-secondary-800 dark:text-secondary-700">Section: {{ section()!.sectionType }}</h3>
        <div class="border-t border-secondary-200 dark:border-secondary-300 pt-4 space-y-4">
          @for (field of fields(); track field.key) {
            <div class="space-y-1">
              <label class="block text-xs font-medium text-secondary-600 dark:text-secondary-500 uppercase tracking-wider">{{ field.label }}</label>
              @if (field.type === 'text') {
                <input #inp type="text" [value]="getFieldValue(field.key)" (input)="onFieldChange(field.key, inp.value)"
                  class="w-full px-3 py-2 bg-secondary-50 dark:bg-secondary-200 border border-secondary-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              } @else if (field.type === 'color') {
                <app-color-picker [value]="getFieldValue(field.key) || '#6366f1'" (change)="onFieldChange(field.key, $event)" />
              } @else if (field.type === 'textarea') {
                <textarea #ta [value]="getFieldValue(field.key)" (input)="onFieldChange(field.key, ta.value)"
                  class="w-full px-3 py-2 bg-secondary-50 dark:bg-secondary-200 border border-secondary-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" rows="2"></textarea>
              }
            </div>
          }
        </div>
        <div class="border-t border-secondary-200 dark:border-secondary-300 pt-4 flex gap-3">
          <button (click)="delete.emit(section()!.id)"
            class="flex-1 py-2 text-sm font-medium text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-50/10 rounded-md transition-colors">
            Delete Section
          </button>
          <button (click)="duplicate.emit(section()!.id)"
            class="flex-1 py-2 text-sm font-medium text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-50/10 rounded-md transition-colors">
            Duplicate
          </button>
        </div>
      </div>
    } @else {
      <div class="p-4 text-center text-secondary-400 text-sm">
        Select a section to edit its properties
      </div>
    }
  `
})
export class PropertyPanelComponent {
  readonly section = input<Section | null>(null);
  readonly update = output<{ id: string; content: any }>();
  readonly delete = output<string>();
  readonly duplicate = output<string>();

  getFieldsForType(type: string): { key: string; label: string; type: 'text' | 'color' | 'textarea' }[] {
    const schema: Record<string, any[]> = {
      hero: [
        { key: 'headline', label: 'Headline', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'buttonText', label: 'Button Text', type: 'text' },
        { key: 'buttonUrl', label: 'Button URL', type: 'text' },
        { key: 'backgroundColor', label: 'Background Color', type: 'color' },
        { key: 'textColor', label: 'Text Color', type: 'color' },
      ],
      features: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
      ],
      pricing: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
      ],
      testimonials: [
        { key: 'title', label: 'Title', type: 'text' },
      ],
      contact: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'buttonText', label: 'Button Text', type: 'text' },
        { key: 'backgroundColor', label: 'Background Color', type: 'color' },
      ],
      footer: [
        { key: 'companyName', label: 'Company Name', type: 'text' },
        { key: 'copyrightText', label: 'Copyright Text', type: 'text' },
        { key: 'backgroundColor', label: 'Background Color', type: 'color' },
      ],
    };
    return schema[type] || [];
  }

  fields() {
    const s = this.section();
    return s ? this.getFieldsForType(s.sectionType) : [];
  }

  getFieldValue(key: string): string {
    return this.section()?.content?.[key] || '';
  }

  onFieldChange(key: string, value: string) {
    const s = this.section();
    if (!s) return;
    const newContent = { ...s.content, [key]: value };
    this.update.emit({ id: s.id, content: newContent });
  }
}
