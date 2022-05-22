import { PaginatedBaseResponse } from '../base.dto';

export class PaginatedManagersResponse extends PaginatedBaseResponse {
  public readonly managers: ManagerEntity[];
}

export class ManagerEntity {
  public readonly id: number;
  public readonly login: string;
  public readonly lastName: string;
  public readonly firstName: string;
  public readonly patronymic: string;
  public readonly isDisabled: boolean;
}

export class PostManagerEntity {
  public readonly login: string;
  public readonly password: string;
  public readonly lastName: string;
  public readonly firstName: string;
  public readonly patronymic: string;
}

export class UpdateManagerEntity {
  public readonly id: number;
  public readonly login: string;
  public readonly password: string;
  public readonly lastName: string;
  public readonly firstName: string;
  public readonly patronymic: string;
  public readonly isDisabled: boolean;
}
