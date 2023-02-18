export const PDP_INFORMATION = {
  id: '46f96d62-b99a-4444-be44-a13c703a9191',
  name: 'AMBROYAL',
  fullName: 'CÔNG TY CỔ PHẦN AMBROYAL',
  pdpLabel: null,
  email: 'ambroyalfood@gmail.com',
  phone: '02778588886',
  totalProductsSellingQuantity: 0,
  gapoGroupUrl: null,
  address: 'Tổ 9, Ấp Tân Thạnh, Xã An Nhơn, Huyện Châu Thành, Tỉnh Đồng Tháp, Việt Nam',
  background: null,
  backgroundUrl: '',
  avatarUrl: '',
  avatar: null,
};

export const PDP_REPORT = {
  customerSummary: {
    revenue: 8181829278392999,
    company: {
      expensePerItem: 3000,
      totalExpense: 200199,
    },
    product: {
      expensePerItem: 850,
      totalExpense: 2001989,
    },
    totalCustomer: 1000,
    totalAcceptanceRecord: 90,
  },
  collaboratorSummary: {
    revenue: 1891919283838,
    company: {
      expensePerItem: 3000,
      totalExpense: 200199,
    },
    product: {
      expensePerItem: 850,
      totalExpense: 2001989,
    },
    totalCollaborator: 1009,
  },
  acceptanceRecordStatusSummary: {
    totalAcceptanceRecordCreated: 1011,
    totalAcceptanceRecordIsNew: 101221,
    totalAcceptanceRecordIsWaitingConfirm: 18382,
    totalAcceptanceRecordIsWaitingForSign: 9019232,
    totalAcceptanceRecordIsCompleted: 0,
    totalAcceptanceRecordIsArchive: 190239,
    totalAcceptanceRecordIsCanceled: 38740,
  },
  monthYearFilter: '10-2022',
};

export const GET_PDP_TRAFFICS_RESPONSE = {
  statusCode: 0,
  message: null,
  pageable: {
    pageNumber: 1,
    pageSize: 15,
    totalPages: 1,
    totalElements: 3,
  },
  data: [
    {
      id: '28558090-ea97-43a7-a51c-fc324f40b475',
      supplierId: '3887fccd-fa66-4059-b8aa-01b310f622dc',
      price: 850,
      visitTime: 1676221200000,
      visitType: 'PRODUCT',
      productName: 'Test',
      productLink: 'Test',
    },
    {
      id: '79ccf852-9f54-4259-aa10-01f449e4c6ba',
      supplierId: '3887fccd-fa66-4059-b8aa-01b310f622dc',
      price: 850,
      visitTime: 1676221200000,
      visitType: 'PRODUCT',
      productName: 'Test',
      productLink: 'Test',
    },
    {
      id: '06d3cebf-fbc4-432f-8a55-6a1a0db731c1',
      supplierId: 'a409c44c-13c2-4a2b-b92f-b60d649ac65b',
      price: 850,
      visitTime: 1676221200000,
      visitType: 'PRODUCT',
      productName: 'Test',
      productLink: 'Test',
    },
  ],
};


export const GET_PRODUCT_TRAFFICS_RESPONSE = {
  statusCode: 0,
  message: null,
  pageable: {
    pageNumber: 1,
    pageSize: 15,
    totalPages: 1,
    totalElements: 3,
  },
  data: [
    {
      id: '28558090-ea97-43a7-a51c-fc324f40b475',
      supplierId: '3887fccd-fa66-4059-b8aa-01b310f622dc',
      price: 850,
      visitTime: 1676221200000,
      visitType: 'PRODUCT',
      productName: 'Test',
      productLink: 'Test',
    },
    {
      id: '79ccf852-9f54-4259-aa10-01f449e4c6ba',
      supplierId: '3887fccd-fa66-4059-b8aa-01b310f622dc',
      price: 850,
      visitTime: 1676221200000,
      visitType: 'PRODUCT',
      productName: 'Test',
      productLink: 'Test',
    },
    {
      id: '06d3cebf-fbc4-432f-8a55-6a1a0db731c1',
      supplierId: 'a409c44c-13c2-4a2b-b92f-b60d649ac65b',
      price: 850,
      visitTime: 1676221200000,
      visitType: 'PRODUCT',
      productName: 'Test',
      productLink: 'Test',
    },
  ],
};
