import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// Use import type to break circular dependency with revision.entity
import type { Revision } from './revision.entity';
import type { Section } from './section.entity';

@Entity('revision_sections')
export class RevisionSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'revisionId' })
  revisionId: string;

  @ManyToOne(() => require('./revision.entity').Revision, (revision) => revision.sections)
  @JoinColumn({ name: 'revisionId' })
  revision: Revision;

  @Column({ type: 'uuid', nullable: true, name: 'sectionId' })
  sectionId: string | null;

  @ManyToOne(() => require('./section.entity').Section, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'sectionId' })
  section: Section | null;

  @Column({ type: 'varchar', length: 50 })
  sectionType: string;

  @Column({ type: 'integer' })
  position: number;

  @Column({ type: 'simple-json' })
  content: Record<string, any>;

  @Column({ type: 'simple-json' })
  styles: Record<string, any>;
}
