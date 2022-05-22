import { AddressesSort } from '../../enums';
import {
  AddressEntity,
  HealthResponse,
  PaginatedAddressesResponse,
  PostAddressEntity,
  UpdateAddressEntity,
} from '../../dto';

export class AddressesClient {
  public async checkHealth(): Promise<HealthResponse> {
    return {
      status: 'UP',
    };
  }

  public async getOne(_id: number): Promise<AddressEntity> {
    return {
      id: 12,
      address: 'Склад Тестовый',
      latitude: 65,
      longitude: 35.7,
      isDisabled: false,
    };
  }

  public async getAll(_limit: number, _offset: number, _sort?: AddressesSort): Promise<PaginatedAddressesResponse> {
    return {
      totalRows: 10,
      offset: 0,
      count: 10,
      addresses: [
        {
          id: 6,
          address: 'Склад в Ярославле',
          latitude: 57.589493,
          longitude: 39.90941,
          isDisabled: false,
        },
      ],
    };
  }

  public async post(_entity: PostAddressEntity): Promise<AddressEntity> {
    return {
      id: 12,
      address: 'Склад Тестовый',
      latitude: 65,
      longitude: 35.7,
      isDisabled: false,
    };
  }

  public async update(_entity: UpdateAddressEntity): Promise<AddressEntity> {
    return {
      id: 12,
      address: 'Склад Хороший',
      latitude: 67,
      longitude: 35.7,
      isDisabled: false,
    };
  }

  public async delete(_id: number): Promise<AddressEntity> {
    return {
      id: 12,
      address: 'Склад Хороший',
      latitude: 67,
      longitude: 35.7,
      isDisabled: false,
    };
  }
}
