export const ENDPOINT = {
  LOGIN: '/identity-service/v1/mco/identity/token',
  GET_ID: '/order-service/v1/back-office/mco/affiliate/supplier',
  GET_PROFILE: (id: string) => `/product-service/v1/mco/pdp/${id}`,
  GET_TRAFFICS: '/order-service/v1/back-office/mco/affiliate/tracking',
  GET_SUMMARY: '/order-service/v1/back-office/mco/affiliate/summary',
};
