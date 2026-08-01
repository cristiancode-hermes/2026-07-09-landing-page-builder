import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, of } from 'rxjs';

export interface Page {
  id: string;
  projectId: string;
  slug: string;
  title: string;
  published: boolean;
  publishedAt?: string;
  isPublished?: boolean;
  publishedUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  sections?: any[];
}

@Injectable({ providedIn: 'root' })
export class PageService {
  private http = inject(HttpClient);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  getById(id: string) {
    this.loading.set(true);
    return this.http.get<Page>(`${environment.apiUrl}/pages/${id}`).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Failed to load page');
        return of(null as any);
      })
    );
  }

  getBySlug(slug: string) {
    return this.http.get<Page & { sections: any[] }>(`${environment.apiUrl}/public/pages/${slug}`);
  }

  create(projectId: string, data: { title: string; slug?: string }) {
    return this.http.post<Page>(`${environment.apiUrl}/projects/${projectId}/pages`, data);
  }

  update(id: string, data: any) {
    return this.http.patch<Page>(`${environment.apiUrl}/pages/${id}`, data);
  }

  publish(id: string) {
    return this.http.post(`${environment.apiUrl}/pages/${id}/publish`, {});
  }

  unpublish(id: string) {
    return this.http.post(`${environment.apiUrl}/pages/${id}/unpublish`, {});
  }
}
