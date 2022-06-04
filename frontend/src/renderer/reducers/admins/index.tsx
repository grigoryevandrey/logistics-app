import { createSlice } from '@reduxjs/toolkit';
import { AdminFilter, AdminRole, AdminsSort } from '../../enums';
import { PaginatedAdminsResponse, UpdateAdminEntity } from '../../dto';

const initialState = {
  adminsTableData: {},
  singleAdminData: {
    login: '',
    password: '',
    lastName: '',
    firstName: '',
    patronymic: '',
    role: AdminRole.Regular,
    isDisabled: false,
  },
  adminsOffset: 0,
  adminsLimit: 5,
  adminsPage: 0,
  adminsSort: AdminsSort.NameAsc,
  adminsFilter: AdminFilter.None,
  redirectToAdminId: 0,
  isCreatingNewAdmin: false,
} as {
  adminsTableData: Partial<PaginatedAdminsResponse>;
  singleAdminData: UpdateAdminEntity;
  adminsOffset: number;
  adminsLimit: number;
  adminsSort: AdminsSort;
  adminsFilter: AdminFilter;
  adminsPage: number;
  redirectToAdminId: number;
  isCreatingNewAdmin: boolean;
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminsData: (state, action) => {
      state.adminsTableData = action.payload;
    },
    resetAdminsData: (state) => {
      state.adminsTableData = {};
    },
    setAdminsOffset: (state, action) => {
      state.adminsOffset = action.payload;
      state.adminsPage = state.adminsLimit ? Math.floor(state.adminsOffset / state.adminsLimit) : 0;
    },
    setAdminsLimit: (state, action) => {
      state.adminsOffset = 0;
      state.adminsLimit = action.payload;

      state.adminsPage = state.adminsLimit ? Math.floor(state.adminsOffset / state.adminsLimit) : 0;
    },
    setAdminsSort: (state, action) => {
      state.adminsSort = action.payload;
    },
    setAdminsFilter: (state, action) => {
      state.adminsFilter = action.payload;
    },
    setRedirectToAdminId: (state, action) => {
      state.redirectToAdminId = action.payload;
    },
    resetRedirectToAdminId: (state) => {
      state.redirectToAdminId = 0;
    },
    setSingleAdminData: (state, action) => {
      action.payload.tonnage = action.payload.tonnage || 0;

      state.singleAdminData = action.payload;
    },
    clearSingleAdminData: (state) => {
      state.singleAdminData = {
        login: '',
        password: '',
        lastName: '',
        firstName: '',
        patronymic: '',
        isDisabled: false,
      } as UpdateAdminEntity;
    },
    startCreatingNewAdmin: (state) => {
      state.isCreatingNewAdmin = true;
    },
    endCreatingNewAdmin: (state) => {
      state.isCreatingNewAdmin = false;
    },
  },
});

export const {
  setAdminsData,
  resetAdminsData,

  setAdminsOffset,
  setAdminsLimit,
  setAdminsSort,
  setAdminsFilter,

  setRedirectToAdminId,
  resetRedirectToAdminId,

  setSingleAdminData,
  clearSingleAdminData,

  startCreatingNewAdmin,
  endCreatingNewAdmin,
} = adminSlice.actions;

export const adminsReducer = adminSlice.reducer;
