import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createUndergraduateStudiesDto {
  @IsNotEmpty()
  @IsNumber()
  status!: number;

  @IsNotEmpty()
  @IsString()
  career!: string;

  @IsNotEmpty()
  @IsString()
  university!: string;

  @IsString()
  link_drive!: string;
}
