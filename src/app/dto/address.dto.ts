import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class createAddressDto {
  @IsNotEmpty()
  @IsString()
  country!: string;

  @IsNotEmpty()
  @IsEmail()
  department!: string;

  @IsNotEmpty()
  @IsDate()
  city!: string;

  @IsNotEmpty()
  @IsString()
  workplace_district!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @IsString()
  zone!: string;

  @IsNotEmpty()
  @IsString()
  link_google_maps!: string;

  @IsNotEmpty()
  @IsUUID()
  employee_id!: string;
}
