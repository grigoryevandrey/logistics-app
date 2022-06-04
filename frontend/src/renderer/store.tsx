import { configureStore } from '@reduxjs/toolkit';
import {
  globalReducer,
  loginFormReducer,
  addressesReducer,
  driversReducer,
  vehiclesReducer,
  managersReducer,
  adminsReducer,
} from './reducers';

export const store = configureStore({
  reducer: {
    loginForm: loginFormReducer,
    global: globalReducer,
    addresses: addressesReducer,
    drivers: driversReducer,
    vehicles: vehiclesReducer,
    managers: managersReducer,
    admins: adminsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
