import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
// Use import type to break circular dependency with revision-section.entity
import type { RevisionSection } from './revision-section.entity';
import type { Page } from './page.entity';

@Entity('revisions')
@Unique(['pageId', 'versionNumber'])
export class Revision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'pageId' })
  pageId: string;

  @ManyToOne(() => require('./page.entity').Page, (page) => page.revisions)
  @JoinColumn({ name: 'pageId' })
  page: Page;

  @Column({ type: 'integer' })
  versionNumber: number;

  @Column({ type: 'text', nullable: true })
  changeSummary: string;

  @Column({ type: 'varchar', length: 20 })
  revisionType: 'auto_save' | 'manual' | 'publish' | 'restore';

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => require('./revision-section.entity').RevisionSection, (rs) => rs.revision, { cascade: true })
  sections: RevisionSection[];
}
