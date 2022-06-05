import { DeliveriesSort, DeliveryStatus } from '../../enums';
import { DeliveryEntity, PaginatedDeliveriesResponse, PostDeliveryEntity, UpdateDeliveryEntity } from '../../dto';
import { BaseClient } from '../base.client';
import { axiosInstance } from '../instance';

const BASE_URL = 'http://0.0.0.0:3005/api/v1';
const PATH_PART = `deliveries`;

class DeliveriesClient extends BaseClient<
  DeliveryEntity,
  DeliveriesSort,
  PaginatedDeliveriesResponse,
  PostDeliveryEntity,
  UpdateDeliveryEntity
> {
  public override async getAll(
    limit: number,
    offset: number,
    sort?: DeliveriesSort,
    filter?: DeliveryStatus,
  ): Promise<PaginatedDeliveriesResponse> {
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

  public async getStatuses(): Promise<string[]> {
    const { data } = await this.client.get(`${this.domain}/${this.pathPart}/statuses`);

    return data;
  }

  public async updateStatus(id: number, status: DeliveryStatus): Promise<DeliveryEntity> {
    const { data } = await this.client.put(`${this.domain}/${this.pathPart}/statuses`, { id, status });

    return data;
  }
}

export default new DeliveriesClient(axiosInstance, BASE_URL, PATH_PART);
