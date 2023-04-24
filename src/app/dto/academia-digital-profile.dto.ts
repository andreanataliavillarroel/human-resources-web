import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { AcademiaDigitalType } from '../enum/academia-digital-type.enum';

export class createAcademiaDigitalProfileDto {
  @IsEnum([AcademiaDigitalType.INTERN, AcademiaDigitalType.TRAINEE], {
    each: true,
    message: 'Intern or Trainee',
  })
  type!: AcademiaDigitalType;

  @IsNotEmpty()
  @IsNumber()
  status!: number;

  @IsNotEmpty()
  @IsDate()
  start_date!: string;

  @IsNotEmpty()
  @IsDate()
  end_date!: string;

  @IsNotEmpty()
  @IsUUID()
  employee_id!: string;

}
