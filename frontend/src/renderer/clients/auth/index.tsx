import axios from 'axios';
import { LoginStrategy, UserRole } from '../../enums';
import { HealthResponse, LoginCredentials } from '../../dto';
import { setCredentials, deleteCredentials, setUser, resetUser } from '../../reducers';
import { store } from '../../store';
import jwt from 'jwt-decode';

const BASE_URL = 'http://0.0.0.0:3006/api/v1/auth';
export class AuthClient {
  private readonly client = axios.create({
    baseURL: BASE_URL,
  });

  public async checkHealth(): Promise<HealthResponse> {
    return {
      status: 'UP',
    };
  }

  public async login(credentials: LoginCredentials, strategy: LoginStrategy): Promise<void> {
    const { data } = await this.client.post('/login', credentials, { params: { strategy } });

    store.dispatch(setCredentials(data));

    const user = jwt(data.accessToken) as any;
    store.dispatch(
      setUser({
        login: user.Name,
        role: user.Role,
        firstName: user.FirstName,
        lastName: user.LastName,
        patronymic: user.Patronymic,
      }),
    );
  }

  private getStrategyByRole(role: UserRole): LoginStrategy {
    switch (role) {
      case UserRole.manager: {
        return LoginStrategy.manager;
      }
      case UserRole.regular:
      case UserRole.super: {
        return LoginStrategy.admin;
      }
      default: {
        throw new Error(`Can not find login strategy for role ${role}`);
      }
    }
  }

  public async refreshToken(): Promise<void> {
    const state = store.getState();

    const role = state.global.user.role;

    const strategy = this.getStrategyByRole(role);
    const refreshToken = state.global.credentials.refreshToken;

    const { data } = await this.client.put('/refresh', null, {
      params: { strategy },
      headers: { Authorization: refreshToken },
    });

    store.dispatch(setCredentials(data));

    const user = jwt(data.accessToken) as any;
    store.dispatch(
      setUser({
        login: user.Name,
        role: user.Role,
        firstName: user.FirstName,
        lastName: user.LastName,
        patronymic: user.Patronymic,
      }),
    );
  }

  public async logout(): Promise<void> {
    const state = store.getState();

    const role = state.global.user.role;

    const strategy = this.getStrategyByRole(role);
    const credentials = state.global.credentials;
    console.log('🚀 ~ file: index.tsx ~ line 86 ~ AuthClient ~ logout ~ credentials', credentials);

    await this.client.delete('/logout', {
      params: { strategy },
      data: credentials,
      headers: { Authorization: `Bearer ${credentials.accessToken}` },
    });

    store.dispatch(deleteCredentials());
    store.dispatch(resetUser());
  }
}

export default new AuthClient();
