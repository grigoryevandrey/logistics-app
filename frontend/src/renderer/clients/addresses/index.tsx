import axios from 'axios';
import { AddressesSort } from '../../enums';
import {
  AddressEntity,
  HealthResponse,
  PaginatedAddressesResponse,
  PostAddressEntity,
  UpdateAddressEntity,
} from '../../dto';
import { store } from '../../store';
import { EntityClient } from '../../interfaces';

const BASE_URL = 'http://0.0.0.0:3000/api/v1/addresses';

class AddressesClient implements EntityClient {
  private readonly client = axios.create({
    baseURL: BASE_URL,
  });

  public async checkHealth(): Promise<HealthResponse> {
    return {
      status: 'UP',
    };
  }

  public async getOne(id: number): Promise<AddressEntity> {
    // TODO: tokens into interceptors
    const accessToken = store.getState().global.credentials.accessToken;
    const { data } = await this.client.get(`/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } });

    return data;
  }

  public async getAll(limit: number, offset: number, sort?: AddressesSort): Promise<PaginatedAddressesResponse> {
    const accessToken = store.getState().global.credentials.accessToken;
    const { data } = await this.client.get('/', {
      params: {
        limit,
        offset,
        sort,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  }

  public async post(entity: PostAddressEntity): Promise<AddressEntity> {
    const accessToken = store.getState().global.credentials.accessToken;
    const { data } = await this.client.post('/', entity, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  }

  public async update(entity: UpdateAddressEntity): Promise<AddressEntity> {
    const accessToken = store.getState().global.credentials.accessToken;
    const { data } = await this.client.put('/', entity, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  }

  public async delete(id: number): Promise<AddressEntity> {
    const accessToken = store.getState().global.credentials.accessToken;

    const { data } = await this.client.delete('/', {
      params: { id },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  }
}

export default new AddressesClient();
