import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createSkillDto {
  @IsNotEmpty()
  @IsString()
  type!: string;
}
