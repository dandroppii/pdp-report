function getLocale() {
  if (process.env.LOCALE == null) return DEFAULT_LOCALE;
  return process.env.LOCALE === 'vi' ? 'vi-VN' : 'en-US';
}


module.exports = {
  devIndicators: {},
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT",
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: [getLocale()],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: getLocale(),
  },
  webpack: config => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },

  publicRuntimeConfig: {
    // Available on both server and client
    theme: 'DEFAULT',
  },
  images: {
    domains: ['cdnstg.droppii.com', 'cdn.droppii.com', 'cdndev.droppii.com', 'droppiistg.blob.core.windows.net',  'droppii.blob.core.windows.net', 'droppiidev.blob.core.windows.net', 'cdnbeta.droppii.vn', 'cdn.droppii.vn'],
  },
};
