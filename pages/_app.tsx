import RTL from "components/RTL";
import { AppProvider } from "contexts/AppContext";
import SettingsProvider from "contexts/SettingContext";
import { NextPage } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { Fragment, ReactElement, ReactNode, useEffect } from "react";
import "simplebar/dist/simplebar.min.css";
import MuiTheme from "theme/MuiTheme";
import OpenGraphTags from "utils/OpenGraphTags";
import "../src/fake-db";
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import 'date-fns/locale/vi';
import vi from 'date-fns/locale/vi';
import { AlertProvider } from "contexts/AlertContext";
import { AuthContextProvider } from "contexts/AuthContext";
import { NextIntlProvider } from "next-intl";
import { STORAGE_LOCALE_KEY } from "constance/key-storage";

type MyAppProps = AppProps & {
  Component: NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
};

//Binding events.
Router.events.on("routeChangeStart", () => nProgress.start());
Router.events.on("routeChangeComplete", () => nProgress.done());
Router.events.on("routeChangeError", () => nProgress.done());
// small change
nProgress.configure({ showSpinner: false });
// registerLocale('nl', nl);
const loadTranslations = async () => {
  const defaultLocale = process.env.LOCALE === 'en' ? 'en-US' : 'vi-VN';
  const localLocale =
    typeof window !== 'undefined' ? window?.localStorage?.getItem(STORAGE_LOCALE_KEY) : '';
  !localLocale &&
    typeof window !== 'undefined' &&
    window?.localStorage.setItem(STORAGE_LOCALE_KEY, defaultLocale);
  const locale = localLocale || defaultLocale;
  const settingLocale = locale === 'en' ? 'en-US' : 'vi-VN';
  const messages = await import(`../translations/${settingLocale}/all.json`);
  return messages;
};

const translationMessages = await loadTranslations();

interface IntlPageProps {
  messages: Record<string, string>;
  now: number;
}

const App = ({ Component, pageProps }: MyAppProps) => {
  const AnyComponent = Component as any;
  const getLayout = AnyComponent.getLayout ?? ((page) => page);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  if(typeof window === 'undefined') return<></>

  return (
    <NextIntlProvider
      // To achieve consistent date, time and number formatting
      // across the app, you can define a set of global formats.
      formats={{
        dateTime: {
          short: {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            weekday: 'short'
          },
        },
      }}
      // Messages can be received from individual pages or configured
      // globally in this module (`App.getInitialProps`). Note that in
      // the latter case the messages are available as a top-level prop
      // and not nested within `pageProps`.
      messages={translationMessages ?? {}}
      // Providing an explicit value for `now` ensures consistent formatting of
      // relative values regardless of the server or client environment.
      now={new Date((pageProps as IntlPageProps)?.now)}
      // Also an explicit time zone is helpful to ensure dates render the
      // same way on the client as on the server, which might be located
      // in a different time zone.
      timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
      onError={() => {}}
    >
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <title>Bazaar - Next.js Ecommerce Template</title>
        <meta
          name="description"
          content="React Next.js ecommerce template. Build SEO friendly Online store, delivery app and Multivendor store"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <OpenGraphTags />
      </Head>

      <MuiTheme>
          <AlertProvider>
            <AuthContextProvider>
              <AppProvider>
                <SettingsProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                  <RTL>{getLayout(<AnyComponent {...pageProps} />)}</RTL>
                </LocalizationProvider>
              </SettingsProvider>
            </AppProvider>
          </AuthContextProvider>
        </AlertProvider>
      </MuiTheme>
    </Fragment>
    </NextIntlProvider>
  );
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// App.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps };
// };

export default App;
