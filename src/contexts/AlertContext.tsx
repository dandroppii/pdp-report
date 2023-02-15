/* eslint-disable no-unused-vars */
import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { ACTION_NAME } from 'utils/constants';
import { Alert, Snackbar } from '@mui/material';
import { useTranslations } from 'next-intl';
import isString from 'lodash/isString';

// =================================================================================

type initialState = {
  alertContent: {
    severity: string;
    message: string;
    open: boolean;
    position?: {
      vertical: string;
      horizontal: string;
    };
    duration: number;
  };
};

type ActionType = {
  type: string;
  payload: any;
};

// =================================================================================

const initialState = {
  alertContent: {
    open: false,
    severity: 'success',
    message: '',
    duration: 3000,
    position: {
      vertical: 'top',
      horizontal: 'center',
    },
  },
};

interface ContextProps {
  state: initialState;
  dispatch: (args: ActionType) => void;
  showAlertError?: (message?: any) => void;
  showAlertSuccess?: (message: string) => void;
}

const AlertContext = createContext<ContextProps>({
  state: initialState,
  dispatch: () => {},
});

const reducer = (state: initialState, action: ActionType) => {
  switch (action.type) {
    case ACTION_NAME.TOGGLE_ALERT: {
      return { ...state, alertContent: action.payload };
    }

    default: {
      return state;
    }
  }
};

export const AlertProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const t = useTranslations();
  const alertContent = useMemo(() => state.alertContent, [state.alertContent]);

  const handleCloseAlert = useCallback(() => {
    dispatch({ type: ACTION_NAME.TOGGLE_ALERT, payload: { ...alertContent, open: false } });
  }, [alertContent]);

  const showAlertSuccess = useCallback(
    message => {
      dispatch({
        type: ACTION_NAME.TOGGLE_ALERT,
        payload: { ...alertContent, open: true, severity: 'success', message },
      });
    },
    [alertContent]
  );

  const showAlertError = useCallback(
    (message?: any) => {
      const mess = isString(message) ? message : message?.message;
      dispatch({
        type: ACTION_NAME.TOGGLE_ALERT,
        payload: {
          ...alertContent,
          open: true,
          severity: 'error',
          message: mess || t('unknown_error_message'),
        },
      });
    },
    [alertContent, t]
  );

  const contextValue = useMemo(
    () => ({ state, dispatch, showAlertError, showAlertSuccess }),
    [state, dispatch, showAlertError, showAlertSuccess]
  );

  return (
    <AlertContext.Provider value={contextValue}>
      {children}

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={alertContent.open}
        autoHideDuration={alertContent.duration || 3000}
        onClose={handleCloseAlert}
        sx={{ maxWidth: 400, zIndex: '2147483003 !important' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertContent.severity || 'success'}
          sx={{
            width: '100%',
            backgroundColor: alertContent?.severity === 'success' ? 'success.main' : 'error.main',
            color: 'white',
            zIndex: '2147483003 !important',
          }}
        >
          {alertContent.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => useContext<ContextProps>(AlertContext);

export default AlertContext;
