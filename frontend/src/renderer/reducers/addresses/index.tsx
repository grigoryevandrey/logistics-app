import { createSlice } from '@reduxjs/toolkit';
import { AddressesSort } from '../../enums';
import { AddressEntity, PaginatedAddressesResponse } from '../../dto';

const initialState = {
  addressesTableData: {},
  singleAddressData: {
    address: '',
    latitude: 0,
    longitude: 0,
    isDisabled: false,
  },
  addressesOffset: 0,
  addressesLimit: 5,
  addressesPage: 0,
  addressesSort: AddressesSort.address_asc,
  redirectToId: 0,
  isCreatingNewElement: false,
} as {
  addressesTableData: Partial<PaginatedAddressesResponse>;
  singleAddressData: AddressEntity;
  addressesOffset: number;
  addressesLimit: number;
  addressesSort: AddressesSort;
  addressesPage: number;
  redirectToId: number;
  isCreatingNewElement: boolean;
};

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    setAddressesData: (state, action) => {
      state.addressesTableData = action.payload;
    },
    resetAddressesData: (state) => {
      state.addressesTableData = {};
    },
    setAddressesOffset: (state, action) => {
      state.addressesOffset = action.payload;
      state.addressesPage = state.addressesLimit ? Math.floor(state.addressesOffset / state.addressesLimit) : 0;
    },
    setAddressesLimit: (state, action) => {
      state.addressesLimit = action.payload;
      state.addressesPage = state.addressesLimit ? Math.floor(state.addressesOffset / state.addressesLimit) : 0;
    },
    setAddressesSort: (state, action) => {
      state.addressesSort = action.payload;
    },
    setRedirectToId: (state, action) => {
      state.redirectToId = action.payload;
    },
    resetRedirectToId: (state) => {
      state.redirectToId = 0;
    },
    setSingleAddressData: (state, action) => {
      state.singleAddressData = action.payload;
    },
    clearSingleAddressData: (state) => {
      state.singleAddressData = {
        address: '',
        latitude: 0,
        longitude: 0,
        isDisabled: false,
      } as AddressEntity;
    },
    startCreatingNewElement: (state) => {
      state.isCreatingNewElement = true;
    },
    endCreatingNewElement: (state) => {
      state.isCreatingNewElement = false;
    },
  },
});

export const {
  setAddressesData,
  resetAddressesData,

  setAddressesOffset,
  setAddressesLimit,
  setAddressesSort,

  setRedirectToId,
  resetRedirectToId,

  setSingleAddressData,
  clearSingleAddressData,

  startCreatingNewElement,
  endCreatingNewElement,
} = addressesSlice.actions;

export const addressesReducer = addressesSlice.reducer;
