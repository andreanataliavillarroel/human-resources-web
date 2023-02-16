import { IsNotEmpty, IsUUID } from 'class-validator';

export class createEmployeeSkillDto {
  @IsNotEmpty()
  @IsUUID()
  employee_id!: string;

  @IsNotEmpty()
  @IsUUID()
  skill_id!: string;
}
