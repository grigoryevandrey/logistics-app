import { DeliveryStatus } from '../../enums';
import { PaginatedBaseResponse } from '../base.dto';

export class PaginatedDeliveriesResponse extends PaginatedBaseResponse {
  public readonly deliveries: DeliveryJoinedEntity[];
}

export class DeliveryJoinedEntity {
  public readonly id: number;
  public readonly vehicle: string;
  public readonly vehicleCarNumber: string;
  public readonly addressTo: string;
  public readonly addressFrom: string;
  public readonly driverLastName: string;
  public readonly driverFirstName: string;
  public readonly managerLastName: string;
  public readonly managerFirstName: string;
  public readonly contents: string;
  public readonly eta: string;
  public readonly updatedAt: string;
  public readonly status: DeliveryStatus;
}

export class DeliveryEntity {
  public readonly id: number;
  public readonly vehicleId: number;
  public readonly addressTo: number;
  public readonly addressFrom: number;
  public readonly driverId: number;
  public readonly managerId: number;
  public readonly contents: string;
  public readonly eta: string;
  public readonly updatedAt: string;
  public readonly status: DeliveryStatus;
}

export class PostDeliveryEntity {
  public readonly vehicleId: number;
  public readonly addressTo: number;
  public readonly addressFrom: number;
  public readonly driverId: number;
  public readonly managerId: number;
  public readonly contents: string;
  public readonly eta: string;
  public readonly status: DeliveryStatus;
}

export class UpdateDeliveryEntity {
  public readonly id: number;
  public readonly vehicleId: number;
  public readonly addressTo: number;
  public readonly addressFrom: number;
  public readonly driverId: number;
  public readonly managerId: number;
  public readonly contents: string;
  public readonly eta: string;
  public readonly status: DeliveryStatus;
}
