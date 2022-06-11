import { createSlice } from '@reduxjs/toolkit';
import { DriversSort } from '../../enums';
import { DriverEntity, PaginatedDriversResponse } from '../../dto';

const initialState = {
  driversTableData: {},
  singleDriverData: {
    firstName: '',
    lastName: '',
    patronymic: '',
    isDisabled: false,
  },
  driversOffset: 0,
  driversLimit: 5,
  driversPage: 0,
  driversSort: DriversSort.NameAsc,
  redirectToDriverId: 0,
  isCreatingNewDriver: false,
} as {
  driversTableData: Partial<PaginatedDriversResponse>;
  singleDriverData: DriverEntity;
  driversOffset: number;
  driversLimit: number;
  driversSort: DriversSort;
  driversPage: number;
  redirectToDriverId: number;
  isCreatingNewDriver: boolean;
};

const driversSlice = createSlice({
  name: 'drivers',
  initialState,
  reducers: {
    setDriversData: (state, action) => {
      state.driversTableData = action.payload;
    },
    resetDriversData: (state) => {
      state.driversTableData = {};
    },
    setDriversOffset: (state, action) => {
      state.driversOffset = action.payload;
      state.driversPage = state.driversLimit ? Math.floor(state.driversOffset / state.driversLimit) : 0;
    },
    setDriversLimit: (state, action) => {
      state.driversOffset = 0;
      state.driversLimit = action.payload;

      state.driversPage = state.driversLimit ? Math.floor(state.driversOffset / state.driversLimit) : 0;
    },
    setDriversSort: (state, action) => {
      state.driversSort = action.payload;
    },
    setRedirectToDriverId: (state, action) => {
      state.redirectToDriverId = action.payload;
    },
    resetRedirectToDriverId: (state) => {
      state.redirectToDriverId = 0;
    },
    setSingleDriverData: (state, action) => {
      state.singleDriverData = { ...state.singleDriverData, ...action.payload };
    },
    clearSingleDriverData: (state) => {
      state.singleDriverData = {
        firstName: '',
        lastName: '',
        patronymic: '',
        isDisabled: false,
      } as DriverEntity;
    },
    startCreatingNewDriver: (state) => {
      state.isCreatingNewDriver = true;
    },
    endCreatingNewDriver: (state) => {
      state.isCreatingNewDriver = false;
    },
  },
});

export const {
  setDriversData,
  resetDriversData,

  setDriversOffset,
  setDriversLimit,
  setDriversSort,

  setRedirectToDriverId,
  resetRedirectToDriverId,

  setSingleDriverData,
  clearSingleDriverData,

  startCreatingNewDriver,
  endCreatingNewDriver,
} = driversSlice.actions;

export const driversReducer = driversSlice.reducer;
