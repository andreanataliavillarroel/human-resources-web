import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Classification } from '../enum/classification.enum';
import { Sex } from '../enum/gender.enum';
import { MaritalStatus } from '../enum/marital-status.enum';

export class createEmployeeDto {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsDate()
  recruitmentDate!: string;

  @IsNotEmpty()
  @IsNumber()
  country_id!: number;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  workLocation!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsEnum(
    [
      Classification.DEV,
      Classification.QA,
      Classification.QA_LEAD,
      Classification.DEV_LEAD,
      Classification.PM,
      Classification.PO,
      Classification.RRHH,
      Classification.EM,
      Classification.MARKETING,
    ],
    {
      each: true,
      message:
        'Role must be: DEV, QA, QA_LEAD, DEV_LEAD, PM, PO, RRHH, EM or MARKETING.',
    }
  )
  classification!: Classification;

  @IsNotEmpty()
  @IsNumber()
  phone!: number;

  @IsNotEmpty()
  @IsNumber()
  emergencyPhone!: number;

  @IsNotEmpty()
  @IsString()
  dni!: string;

  @IsNotEmpty()
  @IsString()
  nickname!: string;

  @IsEnum([Sex.MALE, Sex.FEMALE], {
    each: true,
    message: 'MALE or FEMALE.',
  })
  sex!: Sex;

  @IsNotEmpty()
  @IsString()
  account_id!: string;

  @IsNumber()
  status!: number;

  @IsNotEmpty()
  @IsNumber()
  category_id!: number;

  @IsNotEmpty()
  @IsDate()
  birthdate!: string;

  @IsDate()
  end_date!: string;

  @IsEnum(
    [MaritalStatus.SINGLE, MaritalStatus.MARRIED, MaritalStatus.DIVORCED],
    {
      each: true,
      message: 'SINGLE, MARRIED or DIVORCED.',
    }
  )
  marital_status!: MaritalStatus;
}
