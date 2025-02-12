import { IsNotEmpty, IsString, IsEmail, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsDateString()  // Ensures it's a valid date string (YYYY-MM-DD)
  birthdate: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  clinicName: string;

  @IsNotEmpty()
  @IsString()
  clinicAddress1: string;

  @IsOptional()  // If clinicAddress2 is optional
  @IsString()
  clinicAddress2: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  education: string;

  @IsNotEmpty()
  @IsString()
  work: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  imagePreview: string;

  @IsNotEmpty()
  @IsString()
  upimagePreview: string;

  @IsNotEmpty()
  @IsString()
  surgeries: string;

  @IsNotEmpty()
  @IsString()
  general: string[];

  @IsNotEmpty()
  @IsString()
  surgical: string[];

  @IsNotEmpty()
  @IsString()
  medical: string[];

  @IsNotEmpty()
  @IsString()
  pediatric: string[];

  @IsNotEmpty()
  @IsString()
  other: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Ensures every item is a string
  specialty?: string[];

}
