import { DriversSort } from '../../enums';
import { DriverEntity, PaginatedDriversResponse, PostDriverEntity, UpdateDriverEntity } from '../../dto';
import { axiosInstance } from '../instance';
import { BaseClient } from '../base.client';

const BASE_URL = 'http://0.0.0.0:3002/api/v1';
const PATH_PART = `drivers`;

class DriversClient extends BaseClient<
  DriverEntity,
  DriversSort,
  PaginatedDriversResponse,
  PostDriverEntity,
  UpdateDriverEntity
> {}

export default new DriversClient(axiosInstance, BASE_URL, PATH_PART);
