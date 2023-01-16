import { IsNotEmpty, IsString } from 'class-validator';

export class UserLogInDto {
  // @IsNotEmpty()
  // @IsEmail()
  // mail!: string;

  @IsNotEmpty()
  @IsString()
  user!: string;
  @IsNotEmpty()
  @IsString()
  password!: string;
}
