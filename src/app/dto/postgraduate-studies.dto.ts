import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class createPostgraduateStudiesDto {
  @IsNotEmpty()
  @IsNumber()
  status!: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  area!: string;

  @IsNotEmpty()
  @IsString()
  speciality!: string;

  @IsString()
  drive_id!: string;

  @IsNotEmpty()
  @IsUUID()
  academic_profile_id!: string;
}
