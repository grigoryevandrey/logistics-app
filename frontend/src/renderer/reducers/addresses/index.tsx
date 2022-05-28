import { createSlice } from '@reduxjs/toolkit';
import { AddressesSort } from '../../enums';
import { PaginatedAddressesResponse } from '../../dto';

const initialState = {
  addressesTableData: {},
  addressesOffset: 0,
  addressesLimit: 5,
  addressesPage: 0,
  addressesSort: AddressesSort.address_asc,
} as {
  addressesTableData: Partial<PaginatedAddressesResponse>;
  addressesOffset: number;
  addressesLimit: number;
  addressesSort: AddressesSort;
  addressesPage: number;
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
  },
});

export const { setAddressesData, resetAddressesData, setAddressesOffset, setAddressesLimit, setAddressesSort } =
  addressesSlice.actions;

export const addressesReducer = addressesSlice.reducer;
