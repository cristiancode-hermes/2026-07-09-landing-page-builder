import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProjectService, Project } from '../../services/project.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-secondary-800 dark:text-secondary-800">
          Welcome back, {{ authService.currentUser()?.name || 'User' }}
        </h1>
        <p class="mt-2 text-secondary-500 dark:text-secondary-500">
          Manage your landing page projects from this dashboard.
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-secondary-100 dark:bg-secondary-100 rounded-md border border-secondary-200 dark:border-secondary-300 p-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 text-lg">📄</div>
            <div>
              <p class="text-2xl font-bold text-secondary-800 dark:text-secondary-800">{{ projects().length }}</p>
              <p class="text-sm text-secondary-500 dark:text-secondary-500">Projects</p>
            </div>
          </div>
        </div>
        <div class="bg-secondary-100 dark:bg-secondary-100 rounded-md border border-secondary-200 dark:border-secondary-300 p-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-md bg-success-50 dark:bg-green-900 flex items-center justify-center text-success-500 text-lg">✅</div>
            <div>
              <p class="text-2xl font-bold text-secondary-800 dark:text-secondary-800">{{ publishedCount }}</p>
              <p class="text-sm text-secondary-500 dark:text-secondary-500">Published</p>
            </div>
          </div>
        </div>
        <div class="bg-secondary-100 dark:bg-secondary-100 rounded-md border border-secondary-200 dark:border-secondary-300 p-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-md bg-warning-50 dark:bg-amber-900 flex items-center justify-center text-warning-500 text-lg">⏳</div>
            <div>
              <p class="text-2xl font-bold text-secondary-800 dark:text-secondary-800">{{ draftCount }}</p>
              <p class="text-sm text-secondary-500 dark:text-secondary-500">Drafts</p>
            </div>
          </div>
        </div>
        <div class="bg-secondary-100 dark:bg-secondary-100 rounded-md border border-secondary-200 dark:border-secondary-300 p-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-md bg-accent-500 bg-opacity-10 dark:bg-purple-900 flex items-center justify-center text-accent-500 text-lg">👤</div>
            <div>
              <p class="text-sm font-medium text-secondary-800 dark:text-secondary-800 truncate">{{ authService.currentUser()?.email || '' }}</p>
              <p class="text-sm text-secondary-500 dark:text-secondary-500">Signed in</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <a routerLink="/editor/new"
           class="block bg-secondary-100 dark:bg-secondary-100 rounded-md border-2 border-dashed border-secondary-300 dark:border-secondary-400 hover:border-primary-400 dark:hover:border-primary-500 transition-colors p-6 text-center group cursor-pointer">
          <div class="w-14 h-14 mx-auto rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 text-2xl mb-4 group-hover:scale-110 transition-transform">+</div>
          <h3 class="font-semibold text-secondary-800 dark:text-secondary-800">New Project</h3>
          <p class="text-sm text-secondary-500 dark:text-secondary-500 mt-1">Create a new landing page project</p>
        </a>
        <a routerLink="/settings"
           class="block bg-secondary-100 dark:bg-secondary-100 rounded-md border border-secondary-200 dark:border-secondary-300 hover:border-secondary-400 dark:hover:border-secondary-500 transition-colors p-6 group cursor-pointer">
          <div class="w-14 h-14 mx-auto rounded-full bg-secondary-100 dark:bg-secondary-200 flex items-center justify-center text-secondary-500 text-2xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
          <h3 class="font-semibold text-secondary-800 dark:text-secondary-800">Settings</h3>
          <p class="text-sm text-secondary-500 dark:text-secondary-500 mt-1">Manage your account preferences</p>
        </a>
        <a routerLink="#"
           class="block bg-secondary-100 dark:bg-secondary-100 rounded-md border border-secondary-200 dark:border-secondary-300 hover:border-secondary-400 dark:hover:border-secondary-500 transition-colors p-6 group cursor-pointer"
           (click)="authService.logout()">
          <div class="w-14 h-14 mx-auto rounded-full bg-danger-50 dark:bg-red-900 flex items-center justify-center text-danger-500 text-2xl mb-4 group-hover:scale-110 transition-transform">🚪</div>
          <h3 class="font-semibold text-secondary-800 dark:text-secondary-800">Sign Out</h3>
          <p class="text-sm text-secondary-500 dark:text-secondary-500 mt-1">Sign out of your account</p>
        </a>
      </div>

      <!-- Projects List -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-secondary-800 dark:text-secondary-800">Your Projects</h2>
          <button (click)="createNewProject()"
                  class="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-ink text-sm font-medium rounded-md transition-colors"
                  [disabled]="creating">
            {{ creating ? 'Creating...' : '+ New Project' }}
          </button>
        </div>

        @if (loading) {
          <div class="flex items-center justify-center py-16">
            <div class="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        } @else if (error) {
          <div class="bg-danger-50 dark:bg-red-900 border border-danger-500 rounded-md p-4 text-danger-600 dark:text-red-200 text-sm">
            {{ error }}
          </div>
        } @else if (projects().length === 0) {
          <div class="bg-secondary-100 dark:bg-secondary-100 rounded-md border border-secondary-200 dark:border-secondary-300 p-12 text-center">
            <div class="text-5xl mb-4">📋</div>
            <h3 class="text-lg font-medium text-secondary-800 dark:text-secondary-800 mb-2">No projects yet</h3>
            <p class="text-secondary-500 dark:text-secondary-500 mb-6 max-w-md mx-auto">
              Create your first landing page project to get started. You can build, preview, and publish beautiful pages.
            </p>
            <button (click)="createNewProject()"
                    class="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-ink text-sm font-medium rounded-md transition-colors"
                    [disabled]="creating">
              {{ creating ? 'Creating...' : 'Create Your First Project' }}
            </button>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (project of projects(); track project.id) {
              <a [routerLink]="['/editor', project.id]"
                 class="block bg-secondary-100 dark:bg-secondary-100 rounded-md border border-secondary-200 dark:border-secondary-300 hover:border-primary-400 dark:hover:border-primary-500 transition-colors p-5 group cursor-pointer">
                <div class="flex items-start justify-between mb-3">
                  <h3 class="font-medium text-secondary-800 dark:text-secondary-800 group-hover:text-primary-500 transition-colors">
                    {{ project.name }}
                  </h3>
                  @if (project.published) {
                    <span class="shrink-0 px-2 py-0.5 text-xs font-medium bg-success-50 dark:bg-green-900 text-success-600 dark:text-green-300 rounded-full">Published</span>
                  } @else {
                    <span class="shrink-0 px-2 py-0.5 text-xs font-medium bg-secondary-100 dark:bg-secondary-300 text-secondary-500 dark:text-secondary-400 rounded-full">Draft</span>
                  }
                </div>
                @if (project.description) {
                  <p class="text-sm text-secondary-500 dark:text-secondary-500 mb-3 line-clamp-2">{{ project.description }}</p>
                }
                <div class="flex items-center gap-2 text-xs text-secondary-400 dark:text-secondary-500">
                  <span>Created {{ project.createdAt | date:'mediumDate' }}</span>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardPageComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly projectService = inject(ProjectService);

  projects = this.projectService.projectsList;
  loading = true;
  error: string | null = null;
  creating = false;

  get publishedCount(): number {
    return this.projects().filter(p => p.published).length;
  }

  get draftCount(): number {
    return this.projects().filter(p => !p.published).length;
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.loading = true;
    this.error = null;
    this.projectService.getAll().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to load projects';
      }
    });
  }

  async createNewProject(): Promise<void> {
    if (this.creating) return;
    this.creating = true;
    try {
      const result = await firstValueFrom(
        this.projectService.create({
          name: `Project ${this.projects().length + 1}`,
          description: 'A new landing page project'
        })
      );
      if (result) {
        // Navigate to editor for this new project
        window.location.href = `/editor/${result.id}`;
      }
    } catch (err: any) {
      this.error = err.error?.message || 'Failed to create project';
    } finally {
      this.creating = false;
    }
  }
}
