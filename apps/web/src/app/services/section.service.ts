import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Section {
  id: string;
  pageId: string;
  sectionType: string;
  content: Record<string, any>;
  styles: Record<string, any>;
  position: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_CONTENT: Record<string, any> = {
  hero: { headline: 'Build Your Next Big Idea', subtitle: 'Launch fast with our drag-and-drop builder', buttonText: 'Get Started →', buttonUrl: '#', backgroundColor: '#f8fafc', textColor: '#0f172a', alignment: 'center' },
  features: { title: 'Features', subtitle: 'What makes us different', cards: [{ icon: '⚡', title: 'Lightning Fast', description: 'Build in minutes, not hours' }, { icon: '🎨', title: 'Beautiful Design', description: 'Professional templates included' }, { icon: '📱', title: 'Responsive', description: 'Looks great on all devices' }] },
  pricing: { title: 'Pricing', subtitle: 'Choose your plan', plans: [{ name: 'Free', price: '$0', currency: 'USD', period: '/month', features: ['1 page', 'Basic sections', 'Community support'], buttonText: 'Get Started', highlighted: false }, { name: 'Pro', price: '$29', currency: 'USD', period: '/month', features: ['Unlimited pages', 'All sections', 'Custom domain', 'Priority support'], buttonText: 'Start Free Trial', highlighted: true, highlightColor: '#6366f1' }, { name: 'Enterprise', price: '$99', currency: 'USD', period: '/month', features: ['Everything in Pro', 'Team collaboration', 'API access', 'Dedicated support'], buttonText: 'Contact Sales', highlighted: false }] },
  testimonials: { title: 'What Our Customers Say', items: [{ quote: 'The easiest landing page builder we\'ve ever used. Launched our campaign in under an hour!', author: 'Sarah Johnson', role: 'Marketing Director, TechCo' }, { quote: 'Beautiful templates and intuitive drag-and-drop. Our conversion rate improved by 40%.', author: 'Mike Chen', role: 'Founder, StartupX' }, { quote: 'Finally, a tool that doesn\'t require a designer. Highly recommended for small businesses.', author: 'Emily Rodriguez', role: 'Owner, GreenBite' }] },
  contact: { title: 'Get in Touch', subtitle: 'We\'d love to hear from you', email: 'hello@landingbuilder.com', buttonText: 'Send Message', backgroundColor: '#f8fafc' },
  footer: { companyName: 'Landing Builder', links: [{ label: 'Privacy', url: '#' }, { label: 'Terms', url: '#' }, { label: 'Contact', url: '#' }], copyrightText: '© 2026 Landing Builder. All rights reserved.', backgroundColor: '#f1f5f9' }
};

@Injectable({ providedIn: 'root' })
export class SectionService {
  private http = inject(HttpClient);

  create(pageId: string, data: { type: string; content: any; position: number }) {
    return this.http.post(`${environment.apiUrl}/pages/${pageId}/sections`, data);
  }

  update(id: string, data: { content?: any; position?: number; styles?: any }) {
    return this.http.patch(`${environment.apiUrl}/sections/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/sections/${id}`);
  }

  duplicate(id: string) {
    return this.http.post(`${environment.apiUrl}/sections/${id}/duplicate`, {});
  }

  reorder(pageId: string, items: { id: string; position: number }[]) {
    return this.http.put(`${environment.apiUrl}/pages/${pageId}/sections/reorder`, { items });
  }
}
