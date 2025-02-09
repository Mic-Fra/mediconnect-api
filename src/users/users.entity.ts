import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')  // Ensure the entity is mapped to the correct table
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column('date')  // Set as 'date' type to store date correctly
  birthdate: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  gender: string;

  @Column()
  clinicName: string;

  @Column()
  clinicAddress1: string;

  @Column()
  clinicAddress2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @Column('text')  // Store education as a text field (it may be longer)
  education: string;

  @Column('text')  // Store work as a text field
  work: string;

  @Column('text')  // Store country as text
  country: string;

  @Column({ type: 'text'})  // Allowing NULL values for imagePreview
  imagePreview: string;

  @Column({ type: 'text', nullable: true })  // Allowing NULL values for imagePreview
  upimagePreview: string;

  @Column('text')  // Store surgeries as text
  surgeries: string;

  @Column({ type: 'text', array: true, nullable: true, default: null })
  general: string[];

  @Column({ type: 'text', array: true, nullable: true, default: null })
  surgical: string[];

  @Column({ type: 'text', array: true, nullable: true, default: null })
  medical: string[];

  @Column({ type: 'text', array: true, nullable: true, default: null })
  pediatric: string[];

  @Column({ type: 'text', array: true, nullable: true, default: null })
  other: string[];

  @Column({ default: false }) // Default active state
  isActive: boolean;

}
