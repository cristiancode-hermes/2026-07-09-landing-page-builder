import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Page } from './page.entity';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'pageId' })
  pageId: string;

  @ManyToOne(() => require('./page.entity').Page, (page) => page.sections)
  @JoinColumn({ name: 'pageId' })
  page: Page;

  @Column({ type: 'varchar', length: 50 })
  sectionType: 'hero' | 'features' | 'pricing' | 'testimonials' | 'contact' | 'footer';

  @Column({ type: 'integer' })
  position: number;

  @Column({ type: 'simple-json' })
  content: Record<string, any>;

  @Column({ type: 'simple-json', default: '{}' })
  styles: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  visible: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
