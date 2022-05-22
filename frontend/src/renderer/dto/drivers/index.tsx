import { PaginatedBaseResponse } from '../base.dto';

export class PaginatedDriversResponse extends PaginatedBaseResponse {
  public readonly drivers: DriverEntity[];
}

export class DriverEntity {
  public readonly id: number;
  public readonly lastName: string;
  public readonly firstName: string;
  public readonly patronymic: string;
  public readonly isDisabled: boolean;
}

export class PostDriverEntity {
  public readonly lastName: string;
  public readonly firstName: string;
  public readonly patronymic: string;
}

export class UpdateDriverEntity {
  public readonly id: number;
  public readonly lastName: string;
  public readonly firstName: string;
  public readonly patronymic: string;
  public readonly isDisabled: boolean;
}
