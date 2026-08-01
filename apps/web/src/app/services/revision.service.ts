import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Revision {
  id: string;
  pageId: string;
  versionNumber: number;
  changeSummary: string;
  revisionType: 'auto_save' | 'manual' | 'publish' | 'restore';
  createdAt: string;
  sections?: RevisionSection[];
}
export interface RevisionSection {
  id: string;
  revisionId: string;
  sectionId: string | null;
  sectionType: string;
  position: number;
  content: Record<string, any>;
  styles: Record<string, any>;
}

@Injectable({ providedIn: 'root' })
export class RevisionService {
  private http = inject(HttpClient);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  getByPage(pageId: string) {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<Revision[]>(`${environment.apiUrl}/pages/${pageId}/revisions`);
  }

  getById(id: string) {
    return this.http.get<Revision>(`${environment.apiUrl}/revisions/${id}`);
  }

  create(pageId: string, changeSummary?: string) {
    return this.http.post<Revision>(`${environment.apiUrl}/pages/${pageId}/revisions`, {
      changeSummary: changeSummary || ''
    });
  }

  restore(id: string) {
    return this.http.post<{ page: any; sections: any[]; revision: Revision }>(
      `${environment.apiUrl}/revisions/${id}/restore`, {}
    );
  }
}
