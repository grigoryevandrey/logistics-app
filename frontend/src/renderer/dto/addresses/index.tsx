import { PaginatedBaseResponse } from '../base.dto';

export class PaginatedAddressesResponse extends PaginatedBaseResponse {
  public readonly addresses: AddressEntity[];
}

export class AddressEntity {
  public readonly id: number;
  public readonly address: string;
  public readonly latitude: number;
  public readonly longitude: number;
  public readonly isDisabled: boolean;
}

export class PostAddressEntity {
  public readonly address: string;
  public readonly latitude: number;
  public readonly longitude: number;
}

export class UpdateAddressEntity {
  public readonly id: number;
  public readonly address: string;
  public readonly latitude: number;
  public readonly longitude: number;
}
