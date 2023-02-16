import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { Sex } from '../enum/gender.enum';

export class createChildDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsDate()
  birthdate!: string;

  @IsNotEmpty()
  @IsEnum([Sex.MALE, Sex.FEMALE], {
    each: true,
    message: 'MALE or FEMALE.',
  })
  sex!: Sex;

  @IsNotEmpty()
  @IsUUID()
  employee_id!: string;
}
