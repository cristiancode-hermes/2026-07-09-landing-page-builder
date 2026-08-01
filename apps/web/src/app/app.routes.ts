import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login-page.component').then(m => m.LoginPageComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register-page.component').then(m => m.RegisterPageComponent) },
  { path: 'p/:slug', loadComponent: () => import('./pages/public/public-page.component').then(m => m.PublicPageComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard-page.component').then(m => m.DashboardPageComponent), canActivate: [AuthGuard] },
  { path: 'editor/:id', loadComponent: () => import('./pages/editor/editor-page.component').then(m => m.EditorPageComponent), canActivate: [AuthGuard] },
  { path: 'editor/:id/revisions', loadComponent: () => import('./pages/revisions/revisions-page.component').then(m => m.RevisionsPageComponent), canActivate: [AuthGuard] },
  { path: 'settings', loadComponent: () => import('./pages/settings/settings-page.component').then(m => m.SettingsPageComponent), canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];
