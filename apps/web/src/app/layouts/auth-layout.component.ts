import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-secondary-50 dark:bg-secondary-100 flex">
      <div class="flex-1 flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-md">
          <div class="mb-8 text-center">
            <span class="text-3xl font-display font-bold tracking-wide text-primary-500">LANDING BUILDER</span>
            <p class="mt-1 text-xs text-secondary-500 tracking-[0.3em] uppercase">Stealth Edition</p>
          </div>
          <router-outlet />
        </div>
      </div>
      <div class="hidden lg:flex flex-1 items-center justify-center bg-primary-50 dark:bg-primary-900/20 px-8 border-l border-secondary-200 dark:border-secondary-300">
        <div class="max-w-sm space-y-8">
          <div class="space-y-2">
            <div class="text-4xl">✨</div>
            <h3 class="text-xl font-display font-semibold text-primary-800 dark:text-primary-200">Build pages in minutes</h3>
            <p class="text-primary-600 dark:text-primary-300">Drag, drop, and publish. No coding required.</p>
          </div>
          <div class="space-y-2">
            <div class="text-4xl">🎨</div>
            <h3 class="text-xl font-display font-semibold text-primary-800 dark:text-primary-200">6 beautiful templates</h3>
            <p class="text-primary-600 dark:text-primary-300">Hero, Features, Pricing, Testimonials, Contact, Footer</p>
          </div>
          <div class="space-y-2">
            <div class="text-4xl">📱</div>
            <h3 class="text-xl font-display font-semibold text-primary-800 dark:text-primary-200">Responsive by default</h3>
            <p class="text-primary-600 dark:text-primary-300">Looks great on every device, out of the box</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthLayoutComponent {}
