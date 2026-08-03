import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { Page } from '../entities/page.entity';
import { Section } from '../entities/section.entity';
import { Revision } from '../entities/revision.entity';
import { RevisionSection } from '../entities/revision-section.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Revision)
    private readonly revisionRepository: Repository<Revision>,
    @InjectRepository(RevisionSection)
    private readonly revisionSectionRepository: Repository<RevisionSection>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    // Check if seed data already exists
    const existingUser = await this.userRepository.findOne({ where: { email: 'demo@example.com' } });
    if (existingUser) return;

    // Create demo user
    const passwordHash = await bcrypt.hash('password123', 10);
    const user = this.userRepository.create({
      name: 'Demo User',
      email: 'demo@example.com',
      passwordHash,
      themePreference: 'light',
    });
    const savedUser = await this.userRepository.save(user);

    // Create project
    const project = this.projectRepository.create({
      name: 'TechLaunch',
      slug: 'techlaunch',
      userId: savedUser.id,
      description: 'A landing page for a tech startup launch',
      faviconUrl: null,
    });
    const savedProject = await this.projectRepository.save(project);

    // Create page
    const page = this.pageRepository.create({
      projectId: savedProject.id,
      title: 'Home',
      slug: 'home',
    });
    const savedPage = await this.pageRepository.save(page);

    // Create sections
    const sectionsData: Array<{
      sectionType: Section['sectionType'];
      position: number;
      content: Record<string, any>;
    }> = [
      {
        sectionType: 'hero',
        position: 0,
        content: {
          headline: 'Launch Your Tech Product Today',
          subtitle: 'Build, deploy, and scale your SaaS product with our all-in-one platform',
          buttonText: 'Get Started Free',
          buttonUrl: '#signup',
          backgroundColor: '#4F46E5',
          textColor: '#FFFFFF',
          backgroundImage: null,
          alignment: 'center',
        },
      },
      {
        sectionType: 'features',
        position: 1,
        content: {
          title: 'Powerful Features',
          subtitle: 'Everything you need to launch successfully',
          cards: [
            { icon: 'zap', title: 'Lightning Fast', description: 'Deploy your product in minutes with our optimized infrastructure.' },
            { icon: 'shield', title: 'Enterprise Security', description: 'Bank-level encryption and security for your data.' },
            { icon: 'bar-chart', title: 'Analytics Dashboard', description: 'Real-time insights into your product performance.' },
          ],
        },
      },
      {
        sectionType: 'pricing',
        position: 2,
        content: {
          title: 'Simple Pricing',
          subtitle: 'Choose the plan that fits your needs',
          plans: [
            { name: 'Starter', price: 29, currency: 'USD', period: 'month', features: ['Up to 1,000 users', 'Basic analytics', 'Email support'], buttonText: 'Get Started', highlighted: false },
            { name: 'Professional', price: 99, currency: 'USD', period: 'month', features: ['Up to 10,000 users', 'Advanced analytics', 'Priority support', 'Custom integrations'], buttonText: 'Start Free Trial', highlighted: true, highlightColor: '#4F46E5' },
            { name: 'Enterprise', price: 299, currency: 'USD', period: 'month', features: ['Unlimited users', 'Full analytics suite', '24/7 dedicated support', 'Custom development'], buttonText: 'Contact Sales', highlighted: false },
          ],
        },
      },
      {
        sectionType: 'testimonials',
        position: 3,
        content: {
          title: 'What Our Customers Say',
          items: [
            { quote: 'TechLaunch helped us go from idea to launch in just 2 weeks. Incredible platform!', author: 'Sarah Johnson', role: 'CEO, StartupCo' },
            { quote: 'The analytics and deployment tools are best-in-class. Highly recommended.', author: 'Mike Chen', role: 'CTO, DevFirm' },
          ],
        },
      },
      {
        sectionType: 'footer',
        position: 4,
        content: {
          companyName: 'TechLaunch Inc.',
          links: [
            { label: 'About', url: '#about' },
            { label: 'Privacy', url: '#privacy' },
            { label: 'Terms', url: '#terms' },
            { label: 'Contact', url: '#contact' },
          ],
          copyrightText: '© 2024 TechLaunch Inc. All rights reserved.',
          backgroundColor: '#1F2937',
        },
      },
    ];

    const savedSections: Section[] = [];
    for (const secData of sectionsData) {
      const section = this.sectionRepository.create({
        pageId: savedPage.id,
        sectionType: secData.sectionType,
        position: secData.position,
        content: secData.content,
        styles: {},
        visible: true,
      });
      const saved = await this.sectionRepository.save(section);
      savedSections.push(saved);
    }

    // Create initial revision
    const revision = this.revisionRepository.create({
      pageId: savedPage.id,
      versionNumber: 1,
      changeSummary: 'Initial page setup',
      revisionType: 'manual',
    });
    const savedRevision = await this.revisionRepository.save(revision);

    // Create revision sections
    for (const section of savedSections) {
      const revisionSection = this.revisionSectionRepository.create({
        revisionId: savedRevision.id,
        sectionId: section.id,
        sectionType: section.sectionType,
        position: section.position,
        content: section.content,
        styles: section.styles,
      });
      await this.revisionSectionRepository.save(revisionSection);
    }
  }
}
