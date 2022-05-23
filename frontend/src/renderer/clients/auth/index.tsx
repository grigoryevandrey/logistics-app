import { LoginStrategy } from '../../enums';
import { HealthResponse, LoginCredentials, Tokens } from '../../dto';

export class AuthClient {
  public async checkHealth(): Promise<HealthResponse> {
    return {
      status: 'UP',
    };
  }

  public async login(_credentials: LoginCredentials, _strategy: LoginStrategy): Promise<Tokens> {
    return {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTMyMDIzMzksIk5hbWUiOiJ0ZXN0IiwiUm9sZSI6InN1cGVyIiwiVG9rZW5UeXBlIjoiYWNjZXNzIn0.7VyVUU3mzITfrCo-dBe8qDn7o8v1FA2tE7SRLUxZqGM',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE2NTMyMDE0MzksIk5hbWUiOiJ0ZXN0IiwiUm9sZSI6InN1cGVyIiwiVG9rZW5UeXBlIjoicmVmcmVzaCJ9.1KI-x5CaN5UIRcMwXCTU7glJEdjS-4g02a4jrog1Ljw',
    };
  }

  public async refreshToken(): Promise<Tokens> {
    return {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTMyMDMzODUsIk5hbWUiOiJ0ZXN0IiwiUm9sZSI6InN1cGVyIiwiVG9rZW5UeXBlIjoiYWNjZXNzIn0.LqOYRLhn2lby4k_iguvPrpCKGHtc6IpcuyfGJFyma08',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE2NTMyMDI0ODUsIk5hbWUiOiJ0ZXN0IiwiUm9sZSI6InN1cGVyIiwiVG9rZW5UeXBlIjoicmVmcmVzaCJ9.IHWme8tLCAh7-A5ss0ZejtDoYKau_rMOjzAC1JcOCpU',
    };
  }

  public async logout(): Promise<void> {}
}

export default new AuthClient();
