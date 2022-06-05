import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import AuthClient from './index';
import { store } from '../../store';

interface AxiosRetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

interface AxiosRetryError extends AxiosError {
  config: AxiosRetryConfig;
}

export const addAccessTokenInterceptor = async (requestConfig: AxiosRequestConfig) => {
  const accessToken = store.getState().global.credentials.accessToken;

  requestConfig.headers = { ...requestConfig.headers, Authorization: `Bearer ${accessToken}` };

  return requestConfig;
};

export const refreshInterceptor = async (response: AxiosResponse) => response;
export const refreshErrorInterceptor = async (error: AxiosRetryError) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    await AuthClient.refreshToken();
    const accessToken = store.getState().global.credentials.accessToken;
    originalRequest.headers = { ...originalRequest.headers, Authorization: `Bearer ${accessToken}` };
    return;
  }

  // TODO Redirect to login page (if 401) + set error message

  return Promise.reject(error);
};
