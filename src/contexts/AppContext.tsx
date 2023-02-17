import produce from "immer";
import React, { createContext, useContext, useMemo, useReducer } from "react";
import { PdpInformations } from "types/common";

// =================================================================================
type initialState = {
  pdpInformations: PdpInformations;
  pdpReport: any;
  fromDate: number;
  toDate: number;
};


type pdpInformationActionType = { type: "SET_PDP_INFORMATION"; payload: PdpInformations };
type fromDateActionType = { type: "SET_FROM_DATE"; payload: number };
type toDateActionType = { type: "SET_TO_DATE"; payload: number };
type pdpReportActionType = { type: "SET_PDP_REPORT"; payload: number };
type ActionType = pdpInformationActionType | toDateActionType | fromDateActionType | pdpReportActionType;

// =================================================================================

const initialState = {
  pdpInformations: {
    "id": "46f96d62-b99a-4444-be44-a13c703a9191",
    "name": "AMBROYAL",
    "fullName": "CÔNG TY CỔ PHẦN AMBROYAL",
    "pdpLabel": null,
    "email": "ambroyalfood@gmail.com",
    "phone": "02778588886",
    "totalProductsSellingQuantity": 0,
    "gapoGroupUrl": null,
    "address": "Tổ 9, Ấp Tân Thạnh, Xã An Nhơn, Huyện Châu Thành, Tỉnh Đồng Tháp, Việt Nam",
    "background": null,
    "backgroundUrl": "",
    "avatarUrl": "",
    "avatar": null
  },
  fromDate: new Date().getTime() - 604800000,
  toDate: new Date().getTime(),
  pdpReport: {
    totalAmount: 1000000,
    totalAmountAfterTax: 920000,
    tax: 8,
    pdpTraffic: 475,
    productTraffic: 475,
    pdpTrafficPrice: 3000,
    productTrafficPrice: 2000
  }
};

interface ContextProps {
  state: initialState;
  dispatch: (args: ActionType) => void;
}

const AppContext = createContext<ContextProps>({
  state: initialState,
  dispatch: () => { },
});

const reducer = (state: initialState, action: ActionType) => {
  switch (action.type) {
    case 'SET_PDP_INFORMATION':
      {
        const newState = produce(state, draftState => {
          draftState.pdpInformations = action.payload
        })
        return newState;
      }

    case 'SET_FROM_DATE':
      {
        const newState = produce(state, draftState => {
          draftState.fromDate = action.payload
        })
        return newState;
      }

    case 'SET_TO_DATE':
      {
        const newState = produce(state, draftState => {
          draftState.toDate = action.payload
        })
        return newState;
      }

    case 'SET_PDP_REPORT':
      {
        const newState = produce(state, draftState => {
          draftState.pdpReport = action.payload
        })
        return newState;
      }

    default: {
      return state;
    }
  }
};

export const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => useContext<ContextProps>(AppContext);

export default AppContext;
