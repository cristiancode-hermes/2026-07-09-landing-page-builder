import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
// Use import type to break circular dependency with project.entity
import type { Project } from './project.entity';
// Use import type to break circular dependency with section.entity/revision.entity
import type { Section } from './section.entity';
import type { Revision } from './revision.entity';

@Entity('pages')
@Unique(['projectId', 'slug'])
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'projectId' })
  projectId: string;

  @ManyToOne(() => require('./project.entity').Project, (project: any) => project.pages)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  seoTitle: string | null;

  @Column({ type: 'text', nullable: true })
  seoDescription: string | null;

  @Column({ type: 'text', nullable: true })
  customCss: string | null;

  @Column({ type: 'text', nullable: true })
  customJs: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  favicon: string | null;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  publishedUrl: string | null;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => require('./section.entity').Section, (section) => section.page)
  sections: Section[];

  @OneToMany(() => require('./revision.entity').Revision, (revision) => revision.page)
  revisions: Revision[];
}
