import { createSlice } from '@reduxjs/toolkit';
import { VehiclesSort } from '../../enums';
import { VehicleEntity, PaginatedVehiclesResponse } from '../../dto';

const initialState = {
  vehiclesTableData: {},
  singleVehicleData: {
    vehicle: '',
    carNumber: '',
    tonnage: 0,
    isDisabled: false,
  },
  vehiclesOffset: 0,
  vehiclesLimit: 5,
  vehiclesPage: 0,
  vehiclesSort: VehiclesSort.VehicleAsc,
  redirectToVehicleId: 0,
  isCreatingNewVehicle: false,
} as {
  vehiclesTableData: Partial<PaginatedVehiclesResponse>;
  singleVehicleData: VehicleEntity;
  vehiclesOffset: number;
  vehiclesLimit: number;
  vehiclesSort: VehiclesSort;
  vehiclesPage: number;
  redirectToVehicleId: number;
  isCreatingNewVehicle: boolean;
};

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setVehiclesData: (state, action) => {
      state.vehiclesTableData = action.payload;
    },
    resetVehiclesData: (state) => {
      state.vehiclesTableData = {};
    },
    setVehiclesOffset: (state, action) => {
      state.vehiclesOffset = action.payload;
      state.vehiclesPage = state.vehiclesLimit ? Math.floor(state.vehiclesOffset / state.vehiclesLimit) : 0;
    },
    setVehiclesLimit: (state, action) => {
      state.vehiclesOffset = 0;
      state.vehiclesLimit = action.payload;

      state.vehiclesPage = state.vehiclesLimit ? Math.floor(state.vehiclesOffset / state.vehiclesLimit) : 0;
    },
    setVehiclesSort: (state, action) => {
      state.vehiclesSort = action.payload;
    },
    setRedirectToVehicleId: (state, action) => {
      state.redirectToVehicleId = action.payload;
    },
    resetRedirectToVehicleId: (state) => {
      state.redirectToVehicleId = 0;
    },
    setSingleVehicleData: (state, action) => {
      action.payload.tonnage =
        parseFloat(action.payload.tonnage) !== NaN && action.payload.tonnage >= 0
          ? parseFloat(action.payload.tonnage)
          : state.singleVehicleData.tonnage;

      action.payload.tonnage = action.payload.tonnage || 0;

      state.singleVehicleData = { ...state.singleVehicleData, ...action.payload };
    },
    clearSingleVehicleData: (state) => {
      state.singleVehicleData = {
        vehicle: '',
        carNumber: '',
        tonnage: 0,
        isDisabled: false,
      } as VehicleEntity;
    },
    startCreatingNewVehicle: (state) => {
      state.isCreatingNewVehicle = true;
    },
    endCreatingNewVehicle: (state) => {
      state.isCreatingNewVehicle = false;
    },
  },
});

export const {
  setVehiclesData,
  resetVehiclesData,

  setVehiclesOffset,
  setVehiclesLimit,
  setVehiclesSort,

  setRedirectToVehicleId,
  resetRedirectToVehicleId,

  setSingleVehicleData,
  clearSingleVehicleData,

  startCreatingNewVehicle,
  endCreatingNewVehicle,
} = vehiclesSlice.actions;

export const vehiclesReducer = vehiclesSlice.reducer;
