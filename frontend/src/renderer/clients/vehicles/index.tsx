import { VehiclesSort } from '../../enums';
import { VehicleEntity, PaginatedVehiclesResponse, PostVehicleEntity, UpdateVehicleEntity } from '../../dto';
import { BaseClient } from '../base.client';
import { axiosInstance } from '../instance';

const BASE_URL = 'http://0.0.0.0:3001/api/v1';
const PATH_PART = `vehicles`;

class VehiclesClient extends BaseClient<
  VehicleEntity,
  VehiclesSort,
  PaginatedVehiclesResponse,
  PostVehicleEntity,
  UpdateVehicleEntity
> {}

export default new VehiclesClient(axiosInstance, BASE_URL, PATH_PART);
