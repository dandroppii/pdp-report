import { pdpService } from 'api';
import { PDP_INFORMATION, PDP_REPORT } from 'constance/mockPdpData';
import produce from 'immer';
import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { useCallback } from 'react';
import { PdpInformations, PdpReport } from 'types/common';
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
};

type fromDateActionType = { type: 'SET_FROM_DATE'; payload: Date };
type toDateActionType = { type: 'SET_TO_DATE'; payload: Date };
type pdpReportActionType = { type: 'SET_PDP_REPORT'; payload: PdpReport };
type productReportActionType = { type: 'SET_PRODUCT_REPORT'; payload: PdpReport };
type pdpReportLoadingActionType = { type: 'SET_PDP_REPORT_LOADING'; payload: boolean };
type productReportLoadingActionType = { type: 'SET_PRODUCT_REPORT_LOADING'; payload: boolean };
type ActionType =
  | toDateActionType
  | fromDateActionType
  | pdpReportActionType
  | productReportActionType
  | pdpReportLoadingActionType
  | productReportLoadingActionType;

// =================================================================================

const initialState = {
  fromDate: new Date(new Date().getTime() - 604800000),
  toDate: new Date(),
  pdpReport: undefined,
  productReport: undefined,
  pdpReportLoading: false,
  productReportLoading: true,
};

interface ContextProps {
  state: initialState;
  dispatch: (args: ActionType) => void;
}

const AppContext = createContext<ContextProps>({
  state: initialState,
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

    default: {
      return state;
    }
  }
};

export const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { fromDate, toDate } = useMemo(() => {
    return state;
  }, [state]);
  const { isLogin } = useAuthContext();

  const getPdpReport = useCallback(async (from, to) => {
    try {
      dispatch({
        type: 'SET_PDP_REPORT_LOADING',
        payload: true,
      });
      const response = await pdpService.getPdpReport({
        fromDate: formatDatetime(from.getTime(), 'yyyy-MM-dd'),
        toDate: formatDatetime(to.getTime(), 'yyyy-MM-dd'),
        type: 'PDP',
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

  const getProductReport = useCallback(async (from, to) => {
    try {
      dispatch({
        type: 'SET_PRODUCT_REPORT_LOADING',
        payload: true,
      });
      const response = await pdpService.getPdpReport({
        fromDate: formatDatetime(from.getTime(), 'yyyy-MM-dd'),
        toDate: formatDatetime(to.getTime(), 'yyyy-MM-dd'),
        type: 'PRODUCT',
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
    if (isLogin) {
      getProductReport(fromDate, toDate);
      getPdpReport(fromDate, toDate);
    }
  }, [fromDate, toDate, isLogin, getProductReport, getPdpReport]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext<ContextProps>(AppContext);

export default AppContext;
