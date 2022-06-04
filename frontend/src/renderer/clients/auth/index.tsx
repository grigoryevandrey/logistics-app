import { AxiosInstance } from 'axios';
import { LoginStrategy, UserRole } from '../../enums';
import { LoginCredentials } from '../../dto';
import { setCredentials, deleteCredentials, setUser, resetUser } from '../../reducers';
import { store } from '../../store';
import jwt from 'jwt-decode';
import { axiosInstance } from '../instance';

const BASE_URL = 'http://0.0.0.0:3006/api/v1/auth';

export class AuthClient {
  constructor(private readonly client: AxiosInstance) {}

  public async login(credentials: LoginCredentials, strategy: LoginStrategy): Promise<void> {
    const { data } = await this.client.post(`${BASE_URL}/login`, credentials, { params: { strategy } });

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

    try {
      const { data } = await this.client.put(`${BASE_URL}/refresh`, null, {
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
    } catch (e) {
      console.error('Error refreshing token:', e);
    }
  }

  public async logout(): Promise<void> {
    const state = store.getState();

    const role = state.global.user.role;

    const strategy = this.getStrategyByRole(role);
    const credentials = state.global.credentials;

    await this.client.delete(`${BASE_URL}/logout`, {
      params: { strategy },
      data: credentials,
      headers: { Authorization: `Bearer ${credentials.accessToken}` },
    });

    store.dispatch(deleteCredentials());
    store.dispatch(resetUser());
  }
}

export default new AuthClient(axiosInstance);
