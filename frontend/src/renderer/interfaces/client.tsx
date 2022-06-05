import { HealthResponse } from '../dto';

export interface EntityClient {
  checkHealth(): Promise<HealthResponse>;
  getOne(...args: any): Promise<any>;
  getAll(...args: any): Promise<any>;
  post(...args: any): Promise<any>;
  update(...args: any): Promise<any>;
  delete(...args: any): Promise<any>;
}
