import { AdminRole, AdminsSort } from '../../enums';
import { AdminEntity, HealthResponse, PaginatedAdminsResponse, PostAdminEntity, UpdateAdminEntity } from '../../dto';

export class AdminsClient {
  public async checkHealth(): Promise<HealthResponse> {
    return {
      status: 'UP',
    };
  }

  public async getOne(_id: number): Promise<AdminEntity> {
    return {
      id: 4,
      lastName: 'Смирнов',
      firstName: 'Семен',
      patronymic: 'Геннадиевич',
      role: AdminRole.regular,
      isDisabled: false,
    };
  }

  public async getAll(_limit: number, _offset: number, _sort?: AdminsSort): Promise<PaginatedAdminsResponse> {
    return {
      admins: [
        {
          id: 1,
          lastName: 'Лебедев',
          firstName: 'Иван',
          patronymic: 'Билалович',
          role: AdminRole.super,
          isDisabled: false,
        },
        {
          id: 2,
          lastName: 'Калмыкова',
          firstName: 'Арина',
          patronymic: 'Егоровна',
          role: AdminRole.regular,
          isDisabled: false,
        },
      ],
      count: 2,
      offset: 0,
      totalRows: 2,
    };
  }

  public async post(_entity: PostAdminEntity): Promise<AdminEntity> {
    return {
      id: 4,
      lastName: 'Смирнов',
      firstName: 'Семен',
      patronymic: 'Геннадиевич',
      role: AdminRole.regular,
      isDisabled: false,
    };
  }

  public async update(_entity: UpdateAdminEntity): Promise<AdminEntity> {
    return {
      id: 4,
      lastName: 'Смирнов',
      firstName: 'Семен',
      patronymic: 'Геннадиевич',
      role: AdminRole.regular,
      isDisabled: true,
    };
  }

  public async delete(_id: number): Promise<AdminEntity> {
    return {
      id: 4,
      lastName: 'Смирнов',
      firstName: 'Семен',
      patronymic: 'Геннадиевич',
      role: AdminRole.regular,
      isDisabled: true,
    };
  }
}
