import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

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
}
