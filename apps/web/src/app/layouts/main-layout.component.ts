import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-secondary-100 dark:bg-secondary-100 border-b border-secondary-200 dark:border-secondary-300 h-14">
      <div class="h-full px-4 flex items-center justify-between">
        <a routerLink="/dashboard" class="flex items-center gap-2">
          <span class="text-xl font-bold text-primary-500">&#9998;</span>
          <span class="font-display font-semibold tracking-wide text-secondary-800 dark:text-secondary-700">LANDING BUILDER</span>
        </a>
        <div class="flex items-center gap-4">
          @if (authService.currentUser(); as user) {
            <span class="text-sm text-secondary-500">{{ user.name }}</span>
          }
          <button (click)="themeService.toggle()" class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-200 text-secondary-500 transition-colors"
            [attr.title]="themeService.isDark() ? 'Light mode' : 'Dark mode'">
            {{ themeService.isDark() ? '☀️' : '🌙' }}
          </button>
          <button (click)="authService.logout()" class="text-sm text-secondary-500 hover:text-danger-500 transition-colors font-medium">Sign out</button>
        </div>
      </div>
    </nav>
    <main class="pt-14 min-h-screen bg-secondary-50 dark:bg-secondary-100">
      <router-outlet />
    </main>
  `
})
export class MainLayoutComponent {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
}
