import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class createUndergraduateStudiesDto {
  @IsNotEmpty()
  @IsNumber()
  status!: number;

  @IsNotEmpty()
  @IsString()
  career!: string;

  @IsNotEmpty()
  @IsString()
  university!: string;

  @IsString()
  drive_id!: string;

  @IsNotEmpty()
  @IsUUID()
  academic_profile_id!: string;
}
