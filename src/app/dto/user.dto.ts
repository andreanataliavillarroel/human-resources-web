import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { RoleType } from '../enum/role-type.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsEmail()
  mail!: string;

  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsArray()
  @IsEnum(
    [
      RoleType.ADMINISTRATOR,
      RoleType.NONE,
      RoleType.REGULAR_USER,
      RoleType.HUMAN_RESOURCES_USER,
    ],
    {
      each: true,
      message:
        'Role must be: REGULAR_USER, HUMAN_RESOURCES_USER, ADMINISTRATOR or NO ROLE.',
    }
  )
  role!: RoleType[];

  @IsNotEmpty()
  @IsString()
  password!: string;
}
