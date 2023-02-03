import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { AccountType } from '../enum/account-type.enum';
import { AfpType } from '../enum/afp-type.enum';

export class createFinantialInformationDto {
  @IsEnum([AccountType.CHECKING, AccountType.SAVINGS], {
    each: true,
    message: 'Checking Account or Savings Account',
  })
  account_type!: AccountType;

  @IsNotEmpty()
  @IsNumber()
  account_number!: number;

  @IsEnum([AfpType.FUTURO, AfpType.PREVISION], {
    each: true,
    message: 'AFP Futuro o AFP Prevision.',
  })
  afp_type!: AfpType;

  @IsNotEmpty()
  @IsNumber()
  afp_number!: number;

  @IsNotEmpty()
  @IsUUID()
  employee_id!: string;
}
