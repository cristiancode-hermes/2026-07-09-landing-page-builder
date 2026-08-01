import { Injectable, signal } from '@angular/core';

export type ViewportType = 'desktop' | 'tablet' | 'mobile';

@Injectable({ providedIn: 'root' })
export class EditorStateService {
  readonly selectedSectionId = signal<string | null>(null);
  readonly viewport = signal<ViewportType>('desktop');
  readonly isSaving = signal(false);
  readonly lastSaved = signal<Date | null>(null);
  readonly saveError = signal<string | null>(null);

  selectSection(id: string | null) {
    this.selectedSectionId.set(id);
  }

  setViewport(vp: ViewportType) {
    this.viewport.set(vp);
  }

  markSaved() {
    this.isSaving.set(false);
    this.lastSaved.set(new Date());
    this.saveError.set(null);
  }

  markSaving() {
    this.isSaving.set(true);
    this.saveError.set(null);
  }

  markError(err: string) {
    this.isSaving.set(false);
    this.saveError.set(err);
  }
}
