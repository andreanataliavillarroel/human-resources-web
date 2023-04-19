import { IsNotEmpty, IsString, IsUUID, IsDate } from 'class-validator';

export class createPersonalDocumentationDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  drive_id!: string;

  @IsNotEmpty()
  @IsUUID()
  employee_id!: string;

  @IsNotEmpty()
  @IsDate()
  date!: string;
}
