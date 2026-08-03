import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  template: '<h1>Hello World</h1>'
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection(), provideRouter([]), provideHttpClient()]
}).catch(err => console.error(err));
