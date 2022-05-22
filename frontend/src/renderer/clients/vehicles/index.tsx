import { VehiclesSort } from '../../enums';
import {
  VehicleEntity,
  HealthResponse,
  PaginatedVehiclesResponse,
  PostVehicleEntity,
  UpdateVehicleEntity,
} from '../../dto';

export class VehiclesClient {
  public async checkHealth(): Promise<HealthResponse> {
    return {
      status: 'UP',
    };
  }

  public async getOne(_id: number): Promise<VehicleEntity> {
    return {
      id: 12,
      vehicle: 'Камаз',
      carNumber: 'A345ВМ',
      tonnage: 30,
      isDisabled: false,
    };
  }

  public async getAll(_limit: number, _offset: number, _sort?: VehiclesSort): Promise<PaginatedVehiclesResponse> {
    return {
      count: 5,
      offset: 0,
      totalRows: 10,
      vehicles: [
        {
          id: 7,
          vehicle: 'Hyundai Porter',
          carNumber: 'Н741ХА',
          tonnage: 1,
          isDisabled: false,
        },
        {
          id: 3,
          vehicle: 'Mercedes Atego',
          carNumber: 'О707ОХ',
          tonnage: 7,
          isDisabled: false,
        },
      ],
    };
  }

  public async post(_entity: PostVehicleEntity): Promise<VehicleEntity> {
    return {
      id: 12,
      vehicle: 'Камаз',
      carNumber: 'A345ВМ',
      tonnage: 30,
      isDisabled: false,
    };
  }

  public async update(_entity: UpdateVehicleEntity): Promise<VehicleEntity> {
    return {
      id: 12,
      vehicle: 'Камаз',
      carNumber: 'A345ВМ',
      tonnage: 30,
      isDisabled: false,
    };
  }

  public async delete(_id: number): Promise<VehicleEntity> {
    return {
      id: 12,
      vehicle: 'Камаз',
      carNumber: 'A345ВМ',
      tonnage: 30,
      isDisabled: false,
    };
  }
}
