import { DriversSort } from '../../enums';
import {
  DriverEntity,
  HealthResponse,
  PaginatedDriversResponse,
  PostDriverEntity,
  UpdateDriverEntity,
} from '../../dto';

export class DriversClient {
  public async checkHealth(): Promise<HealthResponse> {
    return {
      status: 'UP',
    };
  }

  public async getOne(_id: number): Promise<DriverEntity> {
    return {
      id: 12,
      lastName: 'Васильев',
      firstName: 'Антон',
      patronymic: 'Станиславович',
      isDisabled: false,
    };
  }

  public async getAll(_limit: number, _offset: number, _sort?: DriversSort): Promise<PaginatedDriversResponse> {
    return {
      count: 10,
      drivers: [
        {
          id: 8,
          lastName: 'Яковлев',
          firstName: 'Давид',
          patronymic: 'Львович',
          isDisabled: false,
        },
        {
          id: 2,
          lastName: 'Филиппова',
          firstName: 'София',
          patronymic: 'Ивановна',
          isDisabled: false,
        },
        {
          id: 1,
          lastName: 'Свешников',
          firstName: 'Юрий',
          patronymic: 'Максимович',
          isDisabled: false,
        },
        {
          id: 5,
          lastName: 'Костин',
          firstName: 'Кирилл',
          patronymic: 'Егорович',
          isDisabled: false,
        },
        {
          id: 9,
          lastName: 'Киселева',
          firstName: 'Мария',
          patronymic: 'Викторовна',
          isDisabled: false,
        },
      ],
      offset: 0,
      totalRows: 10,
    };
  }

  public async post(_entity: PostDriverEntity): Promise<DriverEntity> {
    return {
      id: 12,
      lastName: 'Рябов',
      firstName: 'Антон',
      patronymic: 'Станиславович',
      isDisabled: false,
    };
  }

  public async update(_entity: UpdateDriverEntity): Promise<DriverEntity> {
    return {
      id: 12,
      lastName: 'Васильев',
      firstName: 'Антон',
      patronymic: 'Станиславович',
      isDisabled: false,
    };
  }

  public async delete(_id: number): Promise<DriverEntity> {
    return {
      id: 12,
      lastName: 'Васильев',
      firstName: 'Антон',
      patronymic: 'Станиславович',
      isDisabled: false,
    };
  }
}
