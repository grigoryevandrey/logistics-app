import { ManagersSort } from '../../enums';
import {
  ManagerEntity,
  HealthResponse,
  PaginatedManagersResponse,
  PostManagerEntity,
  UpdateManagerEntity,
} from '../../dto';
import { EntityClient } from '../../interfaces';

export class ManagersClient implements EntityClient {
  public async checkHealth(): Promise<HealthResponse> {
    return {
      status: 'UP',
    };
  }

  public async getOne(_id: number): Promise<ManagerEntity> {
    return {
      id: 1,
      login: 'test',
      lastName: 'Осипов',
      firstName: 'Михаил',
      patronymic: 'Маркович',
      isDisabled: false,
    };
  }

  public async getAll(_limit: number, _offset: number, _sort?: ManagersSort): Promise<PaginatedManagersResponse> {
    return {
      count: 5,
      managers: [
        {
          id: 10,
          login: 'test9',
          lastName: 'Куликов',
          firstName: 'Макар',
          patronymic: 'Иванович',
          isDisabled: false,
        },
        {
          id: 6,
          login: 'test5',
          lastName: 'Сазонова',
          firstName: 'Василиса',
          patronymic: 'Петровна',
          isDisabled: false,
        },
      ],
      offset: 0,
      totalRows: 10,
    };
  }

  public async post(_entity: PostManagerEntity): Promise<ManagerEntity> {
    return {
      id: 12,
      login: 'test123',
      lastName: 'Кудрявцев',
      firstName: 'Карим',
      patronymic: 'Сергеевич',
      isDisabled: false,
    };
  }

  public async update(_entity: UpdateManagerEntity): Promise<ManagerEntity> {
    return {
      id: 12,
      login: 'test123',
      lastName: 'Кудрявцев',
      firstName: 'Карим',
      patronymic: 'Сергеевич',
      isDisabled: false,
    };
  }

  public async delete(_id: number): Promise<ManagerEntity> {
    return {
      id: 12,
      login: 'test123',
      lastName: 'Кудрявцев',
      firstName: 'Карим',
      patronymic: 'Сергеевич',
      isDisabled: false,
    };
  }
}
