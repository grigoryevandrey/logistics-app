import { AxiosInstance } from 'axios';
import { HealthResponse } from '../dto';
import { EntityClient } from '../interfaces';

export abstract class BaseClient<E, S, PE, P, U> implements EntityClient {
  constructor(
    protected readonly client: AxiosInstance,
    protected readonly domain: string,
    protected readonly pathPart: string,
  ) {}

  public async checkHealth(): Promise<HealthResponse> {
    const { data } = await this.client.get(`${this.domain}/health`);

    return data;
  }

  public async getOne(id: number): Promise<E> {
    const { data } = await this.client.get(`${this.domain}/${this.pathPart}/${id}`);

    return data;
  }

  public async getAll(limit: number, offset: number, sort?: S): Promise<PE> {
    const { data } = await this.client.get(`${this.domain}/${this.pathPart}/`, {
      params: {
        limit,
        offset,
        sort,
      },
    });

    return data;
  }

  public async post(entity: P): Promise<E> {
    const { data } = await this.client.post(`${this.domain}/${this.pathPart}/`, entity);

    return data;
  }

  public async update(entity: U): Promise<E> {
    const { data } = await this.client.put(`${this.domain}/${this.pathPart}/`, entity);

    return data;
  }

  public async delete(id: number): Promise<E> {
    const { data } = await this.client.delete(`${this.domain}/${this.pathPart}/`, {
      params: { id },
    });

    return data;
  }
}
