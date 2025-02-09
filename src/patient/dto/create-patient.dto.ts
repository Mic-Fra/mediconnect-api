import { IsString, IsOptional, IsEmail, IsArray, IsNotEmpty } from "class-validator";

export class CreatePatientDto {
    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsNotEmpty()
    @IsString()
    lastname: string;

    @IsNotEmpty()
    @IsString()
     birthdate: string;

    @IsNotEmpty()
    @IsString()
    sex: string;

    @IsNotEmpty()
    @IsString()
    height: string;

    @IsNotEmpty()
    @IsString()
    weight: string;

    @IsNotEmpty()
    @IsString()
    marital: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    clinicAddress1: string;

    @IsNotEmpty()
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
    medications: string;

    @IsNotEmpty()
    @IsString()
    emergfirstname: string;

    @IsNotEmpty()
    @IsString()
    emerglastname: string;

    @IsNotEmpty()
    @IsString()
    relationship: string;

    @IsNotEmpty()
    @IsString()
    emergnumber: string;

    @IsNotEmpty()
    @IsString()
    upimagePreview: string;
}
