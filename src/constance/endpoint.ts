export const ENDPOINT = {
  LOGIN: '/identity-service/v1/mco/identity/token',
  GET_ID: '/order-service/v1/back-office/mco/affiliate/supplier',
  GET_PROFILE: (id: string) => `/product-service/v1/mco/pdp/${id}`,
  GET_TRAFFICS: '/order-service/v1/back-office/mco/affiliate/tracking',
  GET_TRAFFICS_SUMMARY: '/order-service/v1/back-office/mco/affiliate/tracking/group-by-name',
  GET_SUMMARY: '/order-service/v1/back-office/mco/affiliate/summary',
  GET_LIST_PDP: '/order-service/v1/back-office/mco-acceptance-record/suppliers',
<<<<<<< HEAD
  GET_LIST_PDP_NOT_YET_CREATE_ACCOUNT: '/product-service/v1/mco/pdp/exclude',
  CHANGE_PDP_STATUS: '/product-service/v1/mco/pdp/status',
  CREATE_ACCOUNT: '/user-service/v1/mco/user',
  MAP_ACCOUNT_WITH_PDP: '/order-service/v1/back-office/mco/affiliate/mapping',
  CHANGE_PASSWORD: (id: string) => `/identity-service/v1/mco/identity/${id}/force-update-password`,
=======
  GET_CMS: '/order-service/v1/back-office/mco/affiliate/tracking',
>>>>>>> 04c6b6a (init)
};
