import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class createCertificationDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsString()
  drive_id!: string;

  @IsNotEmpty()
  @IsUUID()
  academic_profile_id!: string;
}
