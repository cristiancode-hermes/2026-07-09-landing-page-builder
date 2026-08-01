import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, of } from 'rxjs';

export interface Project {
  id: string;
  name: string;
  description?: string;
  slug: string;
  published: boolean;
  pageId?: string;
  pages?: any[];
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  readonly projectsList = signal<Project[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly saving = signal(false);

  getAll() {
    this.loading.set(true);
    return this.http.get<Project[]>(`${environment.apiUrl}/projects`).pipe(
      tap((projects) => { this.projectsList.set(projects); this.loading.set(false); }),
      catchError((err) => { this.loading.set(false); this.error.set(err.error?.message || 'Failed to load projects'); return of([]); })
    );
  }

  getById(id: string) {
    return this.http.get<Project>(`${environment.apiUrl}/projects/${id}`);
  }

  create(data: { name: string; slug?: string; description?: string }) {
    this.saving.set(true);
    return this.http.post<Project>(`${environment.apiUrl}/projects`, data).pipe(
      tap((project) => { this.projectsList.update((list) => [project, ...list]); this.saving.set(false); }),
      catchError((err) => { this.saving.set(false); this.error.set(err.error?.message || 'Failed to create project'); return of(null); })
    );
  }

  update(id: string, data: any) {
    this.saving.set(true);
    return this.http.patch<Project>(`${environment.apiUrl}/projects/${id}`, data).pipe(
      tap((updated: any) => { this.projectsList.update((list) => list.map((p) => (p.id === id ? updated : p))); this.saving.set(false); }),
      catchError((err) => { this.saving.set(false); this.error.set(err.error?.message || 'Failed to update'); return of(null); })
    );
  }

  delete(id: string) {
    this.saving.set(true);
    return this.http.delete(`${environment.apiUrl}/projects/${id}`).pipe(
      tap(() => { this.projectsList.update((list) => list.filter((p) => p.id !== id)); this.saving.set(false); }),
      catchError((err) => { this.saving.set(false); this.error.set(err.error?.message || 'Failed to delete'); return of(null); })
    );
  }

  restore(id: string) {
    return this.http.post<Project>(`${environment.apiUrl}/projects/${id}/restore`, {}).pipe(
      tap((project: any) => { this.projectsList.update((list) => [project, ...list]); })
    );
  }
}
