import { identityService, pdpService } from 'api';
import { PDP_INFORMATION, PDP_REPORT } from 'constance/mockPdpData';
import produce from 'immer';
import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { useCallback } from 'react';
import { ListPdp, ListPdpResponse, PdpInformations, PdpReport } from 'types/common';
import { formatDatetime } from 'utils/datetime';
import { useAuthContext } from './AuthContext';

// =================================================================================
type initialState = {
  pdpReport: PdpReport;
  productReport: PdpReport;
  fromDate: Date;
  toDate: Date;
  pdpReportLoading: boolean;
  productReportLoading: boolean;
  listPdp: ListPdp[];
  selectedPdp: ListPdp;
  listPdpLoading: boolean;
  pdpProfile?: PdpInformations;
  pdpProfileLoading: boolean;
  listPdpFull: ListPdpResponse[];
};

type fromDateActionType = { type: 'SET_FROM_DATE'; payload: Date };
type listPdpActionType = { type: 'SET_LIST_PDP'; payload: ListPdp[] };
type listPdpFullActionType = { type: 'SET_LIST_PDP_FULL'; payload: ListPdpResponse[] };
type listPdpLoadingActionType = { type: 'SET_LIST_PDP_LOADING'; payload: boolean };
type selectedPdpActionType = {
  type: 'SET_SELECTED_PDP';
  payload: ListPdp;
};
type toDateActionType = { type: 'SET_TO_DATE'; payload: Date };
type pdpReportActionType = { type: 'SET_PDP_REPORT'; payload: PdpReport };
type productReportActionType = { type: 'SET_PRODUCT_REPORT'; payload: PdpReport };
type pdpReportLoadingActionType = { type: 'SET_PDP_REPORT_LOADING'; payload: boolean };
type s = { type: 'SET_PDP_REPORT_LOADING'; payload: boolean };
type productReportLoadingActionType = { type: 'SET_PRODUCT_REPORT_LOADING'; payload: boolean };
type setPdpProfileActionType = {
  type: 'SET_PDP_PROFILE';
  payload: PdpInformations;
};

type setPdpProfileLoadingActionType = {
  type: 'SET_PDP_PROFILE_LOADING';
  payload: boolean;
};
type ActionType =
  | toDateActionType
  | fromDateActionType
  | pdpReportActionType
  | productReportActionType
  | pdpReportLoadingActionType
  | productReportLoadingActionType
  | listPdpActionType
  | listPdpLoadingActionType
  | setPdpProfileActionType
  | setPdpProfileLoadingActionType
  | listPdpFullActionType
  | selectedPdpActionType;

// =================================================================================

const initState: initialState = {
  fromDate: new Date(new Date().getTime() - 604800000),
  toDate: new Date(),
  pdpReport: undefined,
  productReport: undefined,
  pdpReportLoading: false,
  productReportLoading: false,
  listPdp: [],
  selectedPdp: null,
  listPdpLoading: false,
  pdpProfile: null,
  pdpProfileLoading: false,
  listPdpFull: [],
};

interface ContextProps {
  state: initialState;
  dispatch: (args: ActionType) => void;
}

const AppContext = createContext<ContextProps>({
  state: initState,
  dispatch: () => {},
});

const reducer = (state: initialState, action: ActionType) => {
  switch (action.type) {
    case 'SET_FROM_DATE': {
      const newState = produce(state, draftState => {
        draftState.fromDate = action.payload;
      });
      return newState;
    }

    case 'SET_LIST_PDP': {
      const newState = produce(state, draftState => {
        draftState.listPdp = action.payload;
      });
      return newState;
    }

    case 'SET_LIST_PDP_FULL': {
      const newState = produce(state, draftState => {
        draftState.listPdpFull = action.payload;
      });
      return newState;
    }

    case 'SET_LIST_PDP_LOADING': {
      const newState = produce(state, draftState => {
        draftState.listPdpLoading = action.payload;
      });
      return newState;
    }

    case 'SET_SELECTED_PDP': {
      const newState = produce(state, draftState => {
        draftState.selectedPdp = action.payload;
      });
      return newState;
    }

    case 'SET_TO_DATE': {
      const newState = produce(state, draftState => {
        draftState.toDate = action.payload;
      });
      return newState;
    }

    case 'SET_PDP_REPORT': {
      const newState = produce(state, draftState => {
        draftState.pdpReport = action.payload;
      });
      return newState;
    }

    case 'SET_PRODUCT_REPORT': {
      const newState = produce(state, draftState => {
        draftState.productReport = action.payload;
      });
      return newState;
    }

    case 'SET_PRODUCT_REPORT_LOADING': {
      const newState = produce(state, draftState => {
        draftState.productReportLoading = action.payload;
      });
      return newState;
    }

    case 'SET_PDP_REPORT_LOADING': {
      const newState = produce(state, draftState => {
        draftState.pdpReportLoading = action.payload;
      });
      return newState;
    }

    case 'SET_PDP_PROFILE': {
      const newState = produce(state, draftState => {
        draftState.pdpProfile = action.payload;
      });
      return newState;
    }
    case 'SET_PDP_PROFILE_LOADING': {
      const newState = produce(state, draftState => {
        draftState.pdpProfileLoading = action.payload;
      });
      return newState;
    }

    default: {
      return state;
    }
  }
};

export const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const { fromDate, toDate, selectedPdp } = useMemo(() => {
    return state;
  }, [state]);
  const { isLogin, isAdmin } = useAuthContext();

  const getListPdp = useCallback(async () => {
    try {
      dispatch({
        type: 'SET_LIST_PDP_LOADING',
        payload: true,
      });
      const response = await pdpService.getListPdp();
      dispatch({
        type: 'SET_LIST_PDP_LOADING',
        payload: false,
      });
      if (response.statusCode === 0) {
        dispatch({
          type: 'SET_LIST_PDP',
          payload: response.data?.map(i => ({ id: i.id, name: i.fullName })),
        });
        dispatch({
          type: 'SET_LIST_PDP_FULL',
          payload: response.data,
        });
      }
    } catch (error) {
      dispatch({
        type: 'SET_LIST_PDP_LOADING',
        payload: false,
      });
    }
  }, []);

  const getPdpProfile = useCallback(async (id: string) => {
    try {
      dispatch({
        type: 'SET_PDP_PROFILE_LOADING',
        payload: true,
      });
      const response = await identityService.getCurrentUser(id);
      dispatch({
        type: 'SET_PDP_PROFILE_LOADING',
        payload: false,
      });
      if (response.statusCode === 0) {
        dispatch({
          type: 'SET_PDP_PROFILE',
          payload: response.data,
        });
      }
    } catch (error) {
      dispatch({
        type: 'SET_PDP_PROFILE_LOADING',
        payload: false,
      });
    }
  }, []);

  const getPdpReport = useCallback(async (from, to, id) => {
    try {
      dispatch({
        type: 'SET_PDP_REPORT_LOADING',
        payload: true,
      });
      const response = await pdpService.getPdpReport({
        fromDate: formatDatetime(from.getTime(), 'yyyy-MM-dd'),
        toDate: formatDatetime(to.getTime(), 'yyyy-MM-dd'),
        type: 'PDP',
        supplierId: id,
      });
      dispatch({
        type: 'SET_PDP_REPORT_LOADING',
        payload: false,
      });
      if (response.statusCode === 0) {
        dispatch({
          type: 'SET_PDP_REPORT',
          payload: response.data,
        });
      }
    } catch (error) {
      dispatch({
        type: 'SET_PDP_REPORT_LOADING',
        payload: false,
      });
    }
  }, []);

  const getProductReport = useCallback(async (from, to, id) => {
    try {
      dispatch({
        type: 'SET_PRODUCT_REPORT_LOADING',
        payload: true,
      });
      const response = await pdpService.getPdpReport({
        fromDate: formatDatetime(from.getTime(), 'yyyy-MM-dd'),
        toDate: formatDatetime(to.getTime(), 'yyyy-MM-dd'),
        type: 'PRODUCT',
        supplierId: id,
      });
      dispatch({
        type: 'SET_PRODUCT_REPORT_LOADING',
        payload: false,
      });
      if (response.statusCode === 0) {
        dispatch({
          type: 'SET_PRODUCT_REPORT',
          payload: response.data,
        });
      }
    } catch (error) {
      dispatch({
        type: 'SET_PRODUCT_REPORT_LOADING',
        payload: false,
      });
    }
  }, []);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  useEffect(() => {
    if (isLogin && (!isAdmin || (isAdmin && selectedPdp?.id))) {
      getProductReport(fromDate, toDate, selectedPdp?.id);
      getPdpReport(fromDate, toDate, selectedPdp?.id);
    }
  }, [fromDate, toDate, isLogin, getProductReport, getPdpReport, isAdmin, selectedPdp?.id]);

  useEffect(() => {
    if (isLogin && isAdmin) {
      getListPdp();
    }
  }, [isLogin, isAdmin, getListPdp]);

  useEffect(() => {
    if (selectedPdp?.id && isAdmin) {
      getPdpProfile(selectedPdp?.id);
    }
  }, [isAdmin, getPdpProfile, selectedPdp?.id]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext<ContextProps>(AppContext);

export default AppContext;
