import { PDP_INFORMATION, PDP_REPORT } from 'constance/mockPdpData';
import produce from 'immer';
import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { useCallback } from 'react';
import { PdpInformations, PdpReport } from 'types/common';
import { useAuthContext } from './AuthContext';

// =================================================================================
type initialState = {
  pdpInformations: PdpInformations;
  pdpReport: PdpReport;
  fromDate: Date;
  toDate: Date;
};

type pdpInformationActionType = { type: 'SET_PDP_INFORMATION'; payload: PdpInformations };
type fromDateActionType = { type: 'SET_FROM_DATE'; payload: Date };
type toDateActionType = { type: 'SET_TO_DATE'; payload: Date };
type pdpReportActionType = { type: 'SET_PDP_REPORT'; payload: PdpReport };
type ActionType =
  | pdpInformationActionType
  | toDateActionType
  | fromDateActionType
  | pdpReportActionType;

// =================================================================================

const initialState = {
  pdpInformations: undefined,
  fromDate: new Date(new Date().getTime() - 604800000),
  toDate: new Date(),
  pdpReport: undefined,
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
    case 'SET_PDP_INFORMATION': {
      const newState = produce(state, draftState => {
        draftState.pdpInformations = action.payload;
      });
      return newState;
    }

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

  const getPdpReport = useCallback((from, to) => {
    dispatch({
      type: 'SET_PDP_REPORT',
      payload: PDP_REPORT,
    });
  }, []);

  const getPdpInformation = useCallback(() => {
    dispatch({
      type: 'SET_PDP_INFORMATION',
      payload: PDP_INFORMATION,
    });
  }, []);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  useEffect(() => {
    isLogin && getPdpReport(fromDate, toDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, isLogin]);

  useEffect(() => {
    isLogin && getPdpInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext<ContextProps>(AppContext);

export default AppContext;
