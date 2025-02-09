import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('patients') // Ensure this maps to the correct database table
export class Patient {
  @PrimaryGeneratedColumn() // UUID for unique patient ID
  id: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column('date') // Store as date type
  birthdate: string;

  @Column({ nullable: true })  // ✅ Allow NULL values
  sex: string;

  @Column({ nullable: true })
  height: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  marital: string;

  @Column()
  phone: string;

  @Column({ unique: true }) // Ensuring unique email
  email: string;

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

  @Column('text') // Long text storage for medications
  medications: string;

  @Column()
  emergfirstname: string;

  @Column()
  emerglastname: string;

  @Column()
  relationship: string;

  @Column()
  emergnumber: string;

  @Column({ type: 'text', nullable: true }) // Optional image field
  upimagePreview: string;

  @CreateDateColumn() // Auto-generated creation timestamp
  createdAt: Date;

  @UpdateDateColumn() // Auto-updated timestamp
  updatedAt: Date;

  @Column({ default: false }) // Default active status
  isActive: boolean;
}
