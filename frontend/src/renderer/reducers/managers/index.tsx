import { createSlice } from '@reduxjs/toolkit';
import { ManagersSort } from '../../enums';
import { PaginatedManagersResponse, UpdateManagerEntity } from '../../dto';

const initialState = {
  managersTableData: {},
  singleManagerData: {
    login: '',
    password: '',
    lastName: '',
    firstName: '',
    patronymic: '',
    isDisabled: false,
  },
  managersOffset: 0,
  managersLimit: 5,
  managersPage: 0,
  managersSort: ManagersSort.NameAsc,
  redirectToManagerId: 0,
  isCreatingNewManager: false,
} as {
  managersTableData: Partial<PaginatedManagersResponse>;
  singleManagerData: UpdateManagerEntity;
  managersOffset: number;
  managersLimit: number;
  managersSort: ManagersSort;
  managersPage: number;
  redirectToManagerId: number;
  isCreatingNewManager: boolean;
};

const managersSlice = createSlice({
  name: 'managers',
  initialState,
  reducers: {
    setManagersData: (state, action) => {
      state.managersTableData = action.payload;
    },
    resetManagersData: (state) => {
      state.managersTableData = {};
    },
    setManagersOffset: (state, action) => {
      state.managersOffset = action.payload;
      state.managersPage = state.managersLimit ? Math.floor(state.managersOffset / state.managersLimit) : 0;
    },
    setManagersLimit: (state, action) => {
      state.managersOffset = 0;
      state.managersLimit = action.payload;

      state.managersPage = state.managersLimit ? Math.floor(state.managersOffset / state.managersLimit) : 0;
    },
    setManagersSort: (state, action) => {
      state.managersSort = action.payload;
    },
    setRedirectToManagerId: (state, action) => {
      state.redirectToManagerId = action.payload;
    },
    resetRedirectToManagerId: (state) => {
      state.redirectToManagerId = 0;
    },
    setSingleManagerData: (state, action) => {
      state.singleManagerData = { ...state.singleManagerData, ...action.payload };
    },
    clearSingleManagerData: (state) => {
      state.singleManagerData = {
        login: '',
        password: '',
        lastName: '',
        firstName: '',
        patronymic: '',
        isDisabled: false,
      } as UpdateManagerEntity;
    },
    startCreatingNewManager: (state) => {
      state.isCreatingNewManager = true;
    },
    endCreatingNewManager: (state) => {
      state.isCreatingNewManager = false;
    },
  },
});

export const {
  setManagersData,
  resetManagersData,

  setManagersOffset,
  setManagersLimit,
  setManagersSort,

  setRedirectToManagerId,
  resetRedirectToManagerId,

  setSingleManagerData,
  clearSingleManagerData,

  startCreatingNewManager,
  endCreatingNewManager,
} = managersSlice.actions;

export const managersReducer = managersSlice.reducer;
