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
  addressesSort: AddressesSort.AddressAsc,
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
      state.addressesOffset = 0;
      state.addressesLimit = action.payload;

      state.addressesPage = state.addressesLimit ? Math.floor(state.addressesOffset / state.addressesLimit) : 0;
    },
    setAddressesSort: (state, action) => {
      state.addressesSort = action.payload;
    },
    setRedirectToAddressId: (state, action) => {
      state.redirectToId = action.payload;
    },
    resetRedirectToAddressId: (state) => {
      state.redirectToId = 0;
    },
    setSingleAddressData: (state, action) => {
      action.payload.latitude =
        parseFloat(action.payload.latitude) !== NaN
          ? parseFloat(action.payload.latitude)
          : state.singleAddressData.latitude;

      action.payload.latitude = action.payload.latitude || 0;

      action.payload.longitude =
        parseFloat(action.payload.longitude) !== NaN
          ? parseFloat(action.payload.longitude)
          : state.singleAddressData.longitude;

      action.payload.longitude = action.payload.longitude || 0;

      state.singleAddressData = { ...state.singleAddressData, ...action.payload };
    },
    clearSingleAddressData: (state) => {
      state.singleAddressData = {
        address: '',
        latitude: 0,
        longitude: 0,
        isDisabled: false,
      } as AddressEntity;
    },
    startCreatingNewAddress: (state) => {
      state.isCreatingNewElement = true;
    },
    endCreatingNewAddress: (state) => {
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

  setRedirectToAddressId,
  resetRedirectToAddressId,

  setSingleAddressData,
  clearSingleAddressData,

  startCreatingNewAddress,
  endCreatingNewAddress,
} = addressesSlice.actions;

export const addressesReducer = addressesSlice.reducer;
