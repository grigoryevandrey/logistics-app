import { createSlice } from '@reduxjs/toolkit';
import { AdminFilter, AdminRole, AdminsSort } from '../../enums';
import { PaginatedAdminsResponse, UpdateAdminEntity } from '../../dto';

const initialState = {
  adminTableData: {},
  singleAdminData: {
    login: '',
    password: '',
    lastName: '',
    firstName: '',
    patronymic: '',
    role: AdminRole.Regular,
    isDisabled: false,
  },
  adminOffset: 0,
  adminLimit: 5,
  adminPage: 0,
  adminSort: AdminsSort.NameAsc,
  adminFilter: AdminFilter.None,
  redirectToAdminId: 0,
  isCreatingNewAdmin: false,
} as {
  adminTableData: Partial<PaginatedAdminsResponse>;
  singleAdminData: UpdateAdminEntity;
  adminOffset: number;
  adminLimit: number;
  adminSort: AdminsSort;
  adminFilter: AdminFilter;
  adminPage: number;
  redirectToAdminId: number;
  isCreatingNewAdmin: boolean;
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminsData: (state, action) => {
      state.adminTableData = action.payload;
    },
    resetAdminsData: (state) => {
      state.adminTableData = {};
    },
    setAdminsOffset: (state, action) => {
      state.adminOffset = action.payload;
      state.adminPage = state.adminLimit ? Math.floor(state.adminOffset / state.adminLimit) : 0;
    },
    setAdminsLimit: (state, action) => {
      state.adminOffset = 0;
      state.adminLimit = action.payload;

      state.adminPage = state.adminLimit ? Math.floor(state.adminOffset / state.adminLimit) : 0;
    },
    setAdminsSort: (state, action) => {
      state.adminSort = action.payload;
    },
    setAdminsFilter: (state, action) => {
      state.adminFilter = action.payload;
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
