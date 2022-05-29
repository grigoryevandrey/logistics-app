import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AUTH_PATH } from '../configuration';
import { store } from '../store';

export const PrivateRoute = () => {
  const isLoggedIn =
    store.getState().global.credentials.accessToken && store.getState().global.credentials.refreshToken;

  return isLoggedIn ? <Outlet /> : <Navigate to={AUTH_PATH} />;
};
