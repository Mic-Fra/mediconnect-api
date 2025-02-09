import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("auth")
export class Auth {
  @PrimaryGeneratedColumn('uuid') // Use UUID for a unique identifier
  id: string;

  @Column() 
  email: string;

  @Column()
  password: string;
}
