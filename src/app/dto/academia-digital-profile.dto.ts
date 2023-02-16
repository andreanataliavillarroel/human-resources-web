import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AcademiaDigitalType } from '../enum/academia-digital-type.enum';

export class createAcademiaDigitalProfileDto {
  @IsEnum([AcademiaDigitalType.INTERN, AcademiaDigitalType.TRAINEE], {
    each: true,
    message: 'Intern or Trainee',
  })
  type!: AcademiaDigitalType;

  @IsOptional()
  // @IsNotEmpty()
  @IsNumber()
  grades!: number;

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  comment!: string;

  @IsNotEmpty()
  @IsNumber()
  status!: number;
}
