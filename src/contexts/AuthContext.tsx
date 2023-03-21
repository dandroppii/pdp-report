/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from 'react';
import { createContext } from '@dwarvesf/react-utils';

import { PdpInformations, UserResponseData, WithChildren } from '../types/common';
import { identityService, services } from 'api';
import { useTranslations } from 'next-intl';
import { useAlertContext } from './AlertContext';
import { FetcherError } from 'libs/fetcher';
import { STATUS_CODE_NO_AUTH } from 'utils/constants';
import emitter, { API_REQUEST } from 'libs/emitter';
import { STORAGE_REFRESH_TOKEN_KEY, STORAGE_TOKEN_KEY } from 'constance/key-storage';
import { useRouter } from 'next/router';

interface AuthContextValues {
  isLogin: boolean;
  isLoading?: boolean;
  user?: PdpInformations;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
  isPdpLoading: boolean;
  isAdmin: boolean;
}

const [Provider, useAuthContext] = createContext<AuthContextValues>({
  name: 'auth',
});

const AuthContextProvider = ({ children }: WithChildren) => {
  const t = useTranslations();
  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPdpLoading, setIsPdpLoading] = useState(true);
  const [user, setUser] = useState<PdpInformations>();
  const router = useRouter();
  // const refreshTokenTimeout = useRef<ReturnType<typeof window?.setTimeout>>();
  const { showAlertError, showAlertSuccess } = useAlertContext();

  const logout = useCallback(() => {
    window?.localStorage?.removeItem(STORAGE_TOKEN_KEY);
    window?.localStorage?.removeItem(STORAGE_REFRESH_TOKEN_KEY);
    setIsLogin(false);
    setUser(undefined);
    router.push('/login');
  }, [router]);

  useEffect(() => {
    if (!window?.localStorage?.getItem(STORAGE_TOKEN_KEY)) {
      setIsLogin(false);
      router.push('/login');
    } else {
      checkUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkInvalidToken = useCallback(async () => {
    const authToken = window?.localStorage?.getItem(STORAGE_TOKEN_KEY);
    if (!authToken) {
      return;
    }
  }, []);

  useEffect(() => {
    const handleApiEvent = (event: any) => {
      if (event?.status === 401) {
        logout();
      }
    };

    emitter.on(API_REQUEST, handleApiEvent);

    return () => {
      emitter.off(API_REQUEST, handleApiEvent);
    };
  }, [logout]);

  const checkUser = useCallback(async () => {
    setIsPdpLoading(true);
    await checkInvalidToken();

    try {
      const response = await identityService.getCurrentUserId();
      setIsPdpLoading(false);
      if (response?.data) {
        const user = await identityService.getCurrentUser(response?.data);
        if (user?.data) {
          setUser(user?.data);
          setIsAdmin(true);
          setIsLoading(false);
          setIsLogin(true);
        } else {
          logout();
        }
      } else {
        logout();
      }
    } catch (error: any) {
      setIsPdpLoading(false);
      const { statusCode } = error as FetcherError; //

      if (statusCode === STATUS_CODE_NO_AUTH) {
        return logout();
      }
    }
  }, [logout, checkInvalidToken]);

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const { data, message } = await identityService.login({
          UserName: username,
          Password: password,
        });
        const token = data?.accessToken;
        if (token) {
          services.setAuthToken(token);
          window?.localStorage.setItem(STORAGE_TOKEN_KEY, token);
          window?.localStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, data.refreshToken);
          showAlertSuccess(t('login_success'));
          checkUser();
          return true;
        } else {
          showAlertError(message);
          return false;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [showAlertError, showAlertSuccess, t, checkUser]
  );

  useEffect(() => {
    if (!isLogin) {
      return;
    }

    if (!window?.localStorage?.getItem(STORAGE_TOKEN_KEY)) {
      return;
    }

    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Provider
      value={{
        isLogin,
        user,
        isLoading,
        login,
        logout,
        isPdpLoading,
        isAdmin,
      }}
    >
      {children}
    </Provider>
  );
};

export { useAuthContext, AuthContextProvider };
