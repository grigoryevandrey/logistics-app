import { DeliveriesSort, DeliveryStatus } from '../../enums';
import {
  DeliveryEntity,
  HealthResponse,
  PaginatedDeliveriesResponse,
  PostDeliveryEntity,
  UpdateDeliveryEntity,
} from '../../dto';
import { EntityClient } from '../../interfaces';

export class DeliveriesClient implements EntityClient {
  public async checkHealth(): Promise<HealthResponse> {
    return {
      status: 'UP',
    };
  }

  public async getOne(_id: number): Promise<DeliveryEntity> {
    return {
      id: 1,
      vehicleId: 1,
      addressFrom: 6,
      addressTo: 2,
      driverId: 6,
      managerId: 3,
      contents: '20 кубометров зерна',
      eta: '2022-07-10T19:10:25Z',
      updatedAt: '2022-05-22T19:10:25Z',
      status: DeliveryStatus.cancelled,
    };
  }

  public async getAll(
    _limit: number,
    _offset: number,
    _sort?: DeliveriesSort,
    _filter?: DeliveryStatus,
  ): Promise<PaginatedDeliveriesResponse> {
    return {
      count: 10,
      deliveries: [
        {
          id: 7,
          vehicle: 'Volvo FL',
          vehicleCarNumber: 'Е386РУ',
          addressFrom: 'Склад в Москве',
          addressTo: 'Склад в Великом Новгороде',
          driverLastName: 'Киселева',
          driverFirstName: 'Мария',
          managerFirstName: 'Зоя',
          managerLastName: 'Малышева',
          contents: '5 кубометров зерна',
          eta: '2022-07-21T19:10:25Z',
          updatedAt: '2022-05-22T19:10:25Z',
          status: DeliveryStatus.on_the_way,
        },
        {
          id: 10,
          vehicle: 'Volvo',
          vehicleCarNumber: 'Х699ТВ',
          addressFrom: 'Склад в Великом Новгороде',
          addressTo: 'Склад в Пскове',
          driverLastName: 'Киселева',
          driverFirstName: 'Алёна',
          managerFirstName: 'Максим',
          managerLastName: 'Куприянов',
          contents: '12 тонн техники',
          eta: '2022-07-02T19:10:25Z',
          updatedAt: '2022-05-22T19:10:25Z',
          status: DeliveryStatus.on_the_way,
        },
      ],
      offset: 0,
      totalRows: 10,
    };
  }

  public async getStatuses(): Promise<string[]> {
    return ['not started', 'on the way', 'delivered', 'cancelled'];
  }

  public async post(_entity: PostDeliveryEntity): Promise<DeliveryEntity> {
    return {
      id: 12,
      vehicleId: 2,
      addressFrom: 2,
      addressTo: 1,
      driverId: 2,
      managerId: 1,
      contents: '10 килограмм пшена',
      eta: '2022-05-07T10:10:25Z',
      updatedAt: '2022-05-22T07:24:33.804134Z',
      status: DeliveryStatus.on_the_way,
    };
  }

  public async update(_entity: UpdateDeliveryEntity): Promise<DeliveryEntity> {
    return {
      id: 12,
      vehicleId: 1,
      addressFrom: 5,
      addressTo: 1,
      driverId: 1,
      managerId: 1,
      contents: '25 килограмм пшена',
      eta: '2022-05-07T10:10:25Z',
      updatedAt: '2022-05-22T07:24:49.160609Z',
      status: DeliveryStatus.on_the_way,
    };
  }

  public async updateStatus(_id: string, _status: DeliveryStatus): Promise<DeliveryEntity> {
    return {
      id: 12,
      vehicleId: 1,
      addressFrom: 5,
      addressTo: 1,
      driverId: 1,
      managerId: 1,
      contents: '25 килограмм пшена',
      eta: '2022-05-07T10:10:25Z',
      updatedAt: '2022-05-22T07:26:12.797862Z',
      status: DeliveryStatus.on_the_way,
    };
  }

  public async delete(_id: number): Promise<DeliveryEntity> {
    return {
      id: 12,
      vehicleId: 1,
      addressFrom: 5,
      addressTo: 1,
      driverId: 1,
      managerId: 1,
      contents: '25 килограмм пшена',
      eta: '2022-05-07T10:10:25Z',
      updatedAt: '2022-05-22T07:26:12.797862Z',
      status: DeliveryStatus.on_the_way,
    };
  }
}
