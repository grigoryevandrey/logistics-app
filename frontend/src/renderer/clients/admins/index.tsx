import { AdminRole, AdminsSort } from '../../enums';
import { AdminEntity, PaginatedAdminsResponse, PostAdminEntity, UpdateAdminEntity } from '../../dto';
import { BaseClient } from '../base.client';
import { axiosInstance } from '../instance';

const BASE_URL = 'http://0.0.0.0:3004/api/v1';
const PATH_PART = `admins`;

class AdminsClient extends BaseClient<
  AdminEntity,
  AdminsSort,
  PaginatedAdminsResponse,
  PostAdminEntity,
  UpdateAdminEntity
> {
  public override async getAll(
    limit: number,
    offset: number,
    sort?: AdminsSort,
    filter?: AdminRole,
  ): Promise<PaginatedAdminsResponse> {
    const { data } = await this.client.get(`${this.domain}/${this.pathPart}/`, {
      params: {
        limit,
        offset,
        sort,
        filter,
      },
    });

    return data;
  }
}

export default new AdminsClient(axiosInstance, BASE_URL, PATH_PART);
