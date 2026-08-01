import { effect, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  readonly isDark = signal(this.theme() === 'dark');

  constructor() {
    this.applyTheme();
    effect(() => {
      this.applyTheme();
      localStorage.setItem('theme', this.theme());
    });
  }

  toggle() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
    this.isDark.set(this.theme() === 'dark');
  }

  private applyTheme() {
    if (this.theme() === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
