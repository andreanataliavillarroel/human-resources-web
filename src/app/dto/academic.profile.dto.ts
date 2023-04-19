import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { EnglishLevel } from '../enum/english-level.enum';

export class createAcademicProfileDto {
  @IsNotEmpty()
  @IsUUID()
  occupation!: string;

  @IsNotEmpty()
  @IsString()
  employee_id!: string;

  @IsEnum([EnglishLevel.A12, EnglishLevel.B12, EnglishLevel.C12], {
    each: true,
    message: 'A1-A2, B1-B2 o C1-C2.',
  })
  english_level!: EnglishLevel;

  // @IsNotEmpty()
  // @IsUUID()
  // employee_id!: string;
}
