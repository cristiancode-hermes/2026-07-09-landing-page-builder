import { Component, input } from '@angular/core';
import { Section } from '../../services/section.service';

@Component({
  selector: 'app-section-renderer',
  standalone: true,
  template: `
    @switch (section().sectionType) {
      @case ('hero') {
        <div class="text-center py-8 px-6" [style.backgroundColor]="section().content['backgroundColor'] || '#f8fafc'">
          <h1 class="text-3xl font-bold mb-3" [style.color]="section().content['textColor'] || '#0f172a'">
            {{ section().content['headline'] || 'Headline' }}
          </h1>
          <p class="text-lg mb-6" [style.color]="section().content['textColor'] || '#64748b'">
            {{ section().content['subtitle'] || 'Your subtitle here' }}
          </p>
          <span class="inline-block px-6 py-3 bg-primary-500 text-ink rounded-md font-medium">
            {{ section().content['buttonText'] || 'Get Started →' }}
          </span>
        </div>
      }
      @case ('features') {
        <div class="py-8 px-6">
          <h2 class="text-2xl font-bold text-center mb-2">{{ section().content['title'] || 'Features' }}</h2>
          <p class="text-center text-secondary-500 mb-8">{{ section().content['subtitle'] || 'What we offer' }}</p>
          <div class="grid grid-cols-3 gap-4">
            @for (card of (section().content['cards'] || [{}]); track $index) {
              <div class="text-center p-4 rounded-md border border-secondary-200">
                <div class="text-3xl mb-2">{{ card['icon'] || '⭐' }}</div>
                <h3 class="font-semibold mb-1">{{ card['title'] || 'Feature' }}</h3>
                <p class="text-sm text-secondary-500">{{ card['description'] || 'Description' }}</p>
              </div>
            }
          </div>
        </div>
      }
      @case ('pricing') {
        <div class="py-8 px-6">
          <h2 class="text-2xl font-bold text-center mb-2">{{ section().content['title'] || 'Pricing' }}</h2>
          <p class="text-center text-secondary-500 mb-8">{{ section().content['subtitle'] || 'Choose your plan' }}</p>
          <div class="grid grid-cols-3 gap-4">
            @for (plan of (section().content['plans'] || [{}]); track $index) {
              <div class="text-center p-6 rounded-md border"
                [class.border-primary-500]="plan['highlighted']"
                [class.]="plan['highlighted']"
                [class.border-secondary-200]="!plan['highlighted']">
                <h3 class="font-semibold text-lg mb-2">{{ plan['name'] || 'Plan' }}</h3>
                <p class="text-3xl font-bold text-primary-500 mb-2">{{ plan['price'] || '$0' }}</p>
                <p class="text-sm text-secondary-500 mb-4">{{ plan['period'] || '' }}</p>
                <ul class="text-sm text-left space-y-1 mb-6">
                  @for (feat of (plan['features'] || []); track $index) {
                    <li>✓ {{ feat }}</li>
                  }
                </ul>
                <span class="block w-full py-2 bg-primary-500 text-ink rounded-md text-sm font-medium">
                  {{ plan['buttonText'] || 'Choose' }}
                </span>
              </div>
            }
          </div>
        </div>
      }
      @case ('testimonials') {
        <div class="py-8 px-6 text-center">
          <h2 class="text-2xl font-bold mb-8">{{ section().content['title'] || 'Testimonials' }}</h2>
          <div class="space-y-6">
            @for (item of (section().content['items'] || [{}]); track $index) {
              <div class="max-w-lg mx-auto p-6 bg-secondary-50 rounded-md">
                <p class="text-lg italic mb-4">"{{ item['quote'] || 'Great product!' }}"</p>
                <p class="font-semibold">{{ item['author'] || 'Customer' }}</p>
                <p class="text-sm text-secondary-500">{{ item['role'] || '' }}</p>
              </div>
            }
          </div>
        </div>
      }
      @case ('contact') {
        <div class="py-8 px-6 text-center" [style.backgroundColor]="section().content['backgroundColor'] || '#f8fafc'">
          <h2 class="text-2xl font-bold mb-2">{{ section().content['title'] || 'Get in Touch' }}</h2>
          <p class="text-secondary-500 mb-6">{{ section().content['subtitle'] || 'We would love to hear from you' }}</p>
          <p class="text-lg mb-4">{{ section().content['email'] || 'hello@example.com' }}</p>
          <span class="inline-block px-6 py-3 bg-primary-500 text-ink rounded-md font-medium">
            {{ section().content['buttonText'] || 'Send Message' }}
          </span>
        </div>
      }
      @case ('footer') {
        <div class="py-6 px-6 text-center" [style.backgroundColor]="section().content['backgroundColor'] || '#f1f5f9'">
          <p class="font-semibold mb-2">{{ section().content['companyName'] || 'Company' }}</p>
          <div class="flex justify-center gap-4 mb-3">
            @for (link of (section().content['links'] || []); track $index) {
              <a class="text-sm text-primary-500 hover:underline">{{ link['label'] || 'Link' }}</a>
            }
          </div>
          <p class="text-sm text-secondary-500">{{ section().content['copyrightText'] || '© All rights reserved.' }}</p>
        </div>
      }
    }
  `
})
export class SectionRendererComponent {
  readonly section = input.required<Section>();
}
