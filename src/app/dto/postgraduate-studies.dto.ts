import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createPostgraduateStudiesDto {
  // @IsNotEmpty()
  // @IsNumber()
  // status!: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  area!: string;

  @IsNotEmpty()
  @IsString()
  speciality!: string;

  @IsString()
  link_drive!: string;
}
