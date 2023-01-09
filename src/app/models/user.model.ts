import { RoleType } from '../enum/role-type.enum';

export class User {
  id!: string;
  username!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  token!: string;
  status!: number;
  role!: RoleType[];
  createdAt!: Date;
  mail!: string;
  image!: string;
}
