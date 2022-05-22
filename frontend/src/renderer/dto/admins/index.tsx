import { AdminRole } from '../../enums';
import { PaginatedBaseResponse } from '../base.dto';

export class PaginatedAdminsResponse extends PaginatedBaseResponse {
  public readonly admins: AdminEntity[];
}

export class AdminEntity {
  public readonly id: number;
  public readonly lastName: string;
  public readonly firstName: string;
  public readonly patronymic: string;
  public readonly role: AdminRole;
  public readonly isDisabled: boolean;
}

export class PostAdminEntity {
  public readonly login: string;
  public readonly password: string;
  public readonly lastName: string;
  public readonly firstName: string;
  public readonly patronymic: string;
  public readonly role: AdminRole;
}

export class UpdateAdminEntity {
  public readonly id: number;
  public readonly login: string;
  public readonly password: string;
  public readonly lastName: string;
  public readonly firstName: string;
  public readonly patronymic: string;
  public readonly role: AdminRole;
  public readonly isDisabled: boolean;
}
