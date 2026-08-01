import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-secondary-50 dark:bg-secondary-100 flex items-center justify-center px-4" style="background-image: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(59,130,246,0.06), transparent 70%);">
      <div class="bg-secondary-100 dark:bg-secondary-100 border border-secondary-200 dark:border-secondary-300 p-8 w-full max-w-md shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_24px_60px_rgba(0,0,0,0.6)]">
        <div class="text-center mb-6">
          <span class="text-2xl font-display font-bold tracking-wide text-primary-500">LANDING BUILDER</span>
          <h2 class="text-xl font-display font-semibold text-secondary-800 dark:text-secondary-700 mt-4">Operate in the shadows</h2>
          <p class="text-secondary-500 text-sm">Sign in to your command deck</p>
        </div>
        @if (errorMsg()) {
          <div class="mb-4 p-3 bg-danger-50 dark:bg-danger-50/20 border border-danger-500 text-sm text-danger-600 dark:text-danger-500">{{ errorMsg() }}</div>
        }
        <form #f="ngForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div><label class="block text-sm font-medium text-secondary-700 dark:text-secondary-600 mb-1">Email</label><input ngModel name="email" #email="ngModel" type="email" required class="w-full px-3 py-2 bg-secondary-50 dark:bg-secondary-200 border border-secondary-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="you@example.com" /></div>
          <div><label class="block text-sm font-medium text-secondary-700 dark:text-secondary-600 mb-1">Password</label><input ngModel name="password" #password="ngModel" type="password" required class="w-full px-3 py-2 bg-secondary-50 dark:bg-secondary-200 border border-secondary-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Your password" /></div>
          <button type="submit" [disabled]="loading()" class="w-full py-2.5 bg-primary-500 text-ink font-display font-semibold tracking-wider uppercase hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(59,130,246,0.2)]">{{ loading() ? 'SIGNING IN...' : 'SIGN IN' }}</button>
        </form>
        <p class="mt-6 text-center text-sm text-secondary-500">Don't have an account? <a routerLink="/register" class="text-primary-500 hover:text-primary-600 font-medium">Register</a></p>
      </div>
    </div>
  `
})
export class LoginPageComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  readonly loading = signal(false);
  readonly errorMsg = signal('');

  async onSubmit() {
    this.loading.set(true);
    this.errorMsg.set('');
    try {
      const res: any = await firstValueFrom(this.http.post('/api/auth/login', {
        email: (document.querySelector('[name="email"]') as HTMLInputElement)?.value,
        password: (document.querySelector('[name="password"]') as HTMLInputElement)?.value
      }));
      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('auth_user', JSON.stringify(res.user));
      this.router.navigate(['/dashboard']);
    } catch {
      this.errorMsg.set('Invalid email or password');
    } finally {
      this.loading.set(false);
    }
  }
}
