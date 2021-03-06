import { createSlice } from '@reduxjs/toolkit';
import { DeliveriesFilter, DeliveriesSort, DeliveryStatus } from '../../enums';
import { PaginatedDeliveriesResponse, UpdateDeliveryEntity } from '../../dto';

const initialState = {
  deliveriesTableData: {},
  singleDeliveryData: {
    vehicleId: null,
    addressTo: null,
    addressFrom: null,
    driverId: null,
    managerId: null,
    contents: '',
    eta: '',
    status: DeliveryStatus.NotStarted,
  },
  deliveriesAddressesFrom: {
    open: false,
    loading: false,
    data: [],
  },
  deliveriesAddressesTo: {
    open: false,
    loading: false,
    data: [],
  },
  deliveriesVehicles: {
    open: false,
    loading: false,
    data: [],
  },
  deliveriesDrivers: {
    open: false,
    loading: false,
    data: [],
  },
  deliveriesManagers: {
    open: false,
    loading: false,
    data: [],
  },
  deliveriesOffset: 0,
  deliveriesLimit: 5,
  deliveriesPage: 0,
  deliveriesSort: DeliveriesSort.UpdatedAsc,
  deliveriesFilter: DeliveriesFilter.None,
  redirectToDeliveryId: 0,
  isCreatingNewDelivery: false,
} as {
  deliveriesTableData: Partial<PaginatedDeliveriesResponse>;
  singleDeliveryData: Partial<UpdateDeliveryEntity>;
  deliveriesAddressesFrom: {
    open: boolean;
    loading: boolean;
    data: { id: number; address: string }[];
  };
  deliveriesAddressesTo: {
    open: boolean;
    loading: boolean;
    data: { id: number; address: string }[];
  };
  deliveriesVehicles: {
    open: boolean;
    loading: boolean;
    data: { id: number; vehicle: string; carNumber: string }[];
  };
  deliveriesDrivers: {
    open: boolean;
    loading: boolean;
    data: { id: number; lastName: string; firstName: string; patronymic: string }[];
  };
  deliveriesManagers: {
    open: boolean;
    loading: boolean;
    data: { id: number; lastName: string; firstName: string; patronymic: string }[];
  };
  deliveriesOffset: number;
  deliveriesLimit: number;
  deliveriesSort: DeliveriesSort;
  deliveriesFilter: DeliveriesFilter;
  deliveriesPage: number;
  redirectToDeliveryId: number;
  isCreatingNewDelivery: boolean;
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    setDeliveriesData: (state, action) => {
      state.deliveriesTableData = action.payload;
    },
    resetDeliveriesData: (state) => {
      state.deliveriesTableData = {};
    },
    setDeliveriesOffset: (state, action) => {
      state.deliveriesOffset = action.payload;
      state.deliveriesPage = state.deliveriesLimit ? Math.floor(state.deliveriesOffset / state.deliveriesLimit) : 0;
    },
    setDeliveriesLimit: (state, action) => {
      state.deliveriesOffset = 0;
      state.deliveriesLimit = action.payload;

      state.deliveriesPage = state.deliveriesLimit ? Math.floor(state.deliveriesOffset / state.deliveriesLimit) : 0;
    },
    setDeliveriesSort: (state, action) => {
      state.deliveriesSort = action.payload;
    },
    setDeliveriesFilter: (state, action) => {
      state.deliveriesFilter = action.payload;
    },
    setRedirectToDeliveryId: (state, action) => {
      state.redirectToDeliveryId = action.payload;
    },
    resetRedirectToDeliveryId: (state) => {
      state.redirectToDeliveryId = 0;
    },
    setSingleDeliveryData: (state, action) => {
      action.payload.tonnage = action.payload.tonnage || 0;

      state.singleDeliveryData = { ...state.singleDeliveryData, ...action.payload };
    },
    clearSingleDeliveryData: (state) => {
      state.singleDeliveryData = {
        vehicleId: null,
        addressTo: null,
        addressFrom: null,
        driverId: null,
        managerId: null,
        contents: '',
        eta: '',
        status: DeliveryStatus.NotStarted,
      } as UpdateDeliveryEntity;
    },
    setDeliveriesAddressesFrom: (state, action) => {
      state.deliveriesAddressesFrom = { ...state.deliveriesAddressesFrom, ...action.payload };
    },
    setDeliveriesAddressesTo: (state, action) => {
      state.deliveriesAddressesTo = { ...state.deliveriesAddressesTo, ...action.payload };
    },
    setDeliveriesVehicles: (state, action) => {
      state.deliveriesVehicles = { ...state.deliveriesVehicles, ...action.payload };
    },
    setDeliveriesDrivers: (state, action) => {
      state.deliveriesDrivers = { ...state.deliveriesDrivers, ...action.payload };
    },
    setDeliveriesManagers: (state, action) => {
      state.deliveriesManagers = { ...state.deliveriesManagers, ...action.payload };
    },
    clearDeliveriesSubData: (state) => {
      state.deliveriesAddressesFrom = {
        open: false,
        loading: false,
        data: [],
      };
      state.deliveriesAddressesTo = {
        open: false,
        loading: false,
        data: [],
      };
      state.deliveriesVehicles = {
        open: false,
        loading: false,
        data: [],
      };
      state.deliveriesDrivers = {
        open: false,
        loading: false,
        data: [],
      };
      state.deliveriesManagers = {
        open: false,
        loading: false,
        data: [],
      };
    },
    startCreatingNewDelivery: (state) => {
      state.isCreatingNewDelivery = true;
    },
    endCreatingNewDelivery: (state) => {
      state.isCreatingNewDelivery = false;
    },
  },
});

export const {
  setDeliveriesData,
  resetDeliveriesData,

  setDeliveriesOffset,
  setDeliveriesLimit,
  setDeliveriesSort,
  setDeliveriesFilter,

  setRedirectToDeliveryId,
  resetRedirectToDeliveryId,

  setSingleDeliveryData,
  clearSingleDeliveryData,

  startCreatingNewDelivery,
  endCreatingNewDelivery,

  setDeliveriesAddressesFrom,
  setDeliveriesAddressesTo,
  setDeliveriesVehicles,
  setDeliveriesManagers,
  setDeliveriesDrivers,
  clearDeliveriesSubData,
} = deliverySlice.actions;

export const deliveriesReducer = deliverySlice.reducer;
