import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  readonly isAuthenticated = signal<boolean>(this.hasStoredToken());
  readonly currentUser = signal<User | null>(this.getStoredUser());
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  private hasStoredToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  async login(email: string, password: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res: any = await firstValueFrom(
        this.http.post(`${environment.apiUrl}/auth/login`, { email, password })
      );
      localStorage.setItem(this.TOKEN_KEY, res.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
      this.isAuthenticated.set(true);
      this.currentUser.set(res.user);
    } catch (err: any) {
      this.error.set(err.error?.message || 'Login failed');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async register(name: string, email: string, password: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res: any = await firstValueFrom(
        this.http.post(`${environment.apiUrl}/auth/register`, { name, email, password })
      );
      localStorage.setItem(this.TOKEN_KEY, res.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
      this.isAuthenticated.set(true);
      this.currentUser.set(res.user);
    } catch (err: any) {
      this.error.set(err.error?.message || 'Registration failed');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }
}
