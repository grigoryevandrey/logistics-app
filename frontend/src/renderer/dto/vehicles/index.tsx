import { PaginatedBaseResponse } from '../base.dto';

export class PaginatedVehiclesResponse extends PaginatedBaseResponse {
  public readonly vehicles: VehicleEntity[];
}

export class VehicleEntity {
  public readonly id: number;
  public readonly vehicle: string;
  public readonly carNumber: string;
  public readonly tonnage: number;
  public readonly isDisabled: boolean;
}

export class PostVehicleEntity {
  public readonly vehicle: string;
  public readonly carNumber: number;
  public readonly tonnage: number;
}

export class UpdateVehicleEntity {
  public readonly id: number;
  public readonly vehicle: string;
  public readonly carNumber: number;
  public readonly tonnage: number;
  public readonly isDisabled: boolean;
}
