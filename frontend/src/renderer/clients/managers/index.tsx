import { ManagersSort } from '../../enums';
import { ManagerEntity, PaginatedManagersResponse, PostManagerEntity, UpdateManagerEntity } from '../../dto';
import { BaseClient } from '../base.client';
import { axiosInstance } from '../instance';

const BASE_URL = 'http://0.0.0.0:3003/api/v1';
const PATH_PART = `managers`;

class ManagersClient extends BaseClient<
  ManagerEntity,
  ManagersSort,
  PaginatedManagersResponse,
  PostManagerEntity,
  UpdateManagerEntity
> {}

export default new ManagersClient(axiosInstance, BASE_URL, PATH_PART);
