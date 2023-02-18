import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

export type WithChildren<T = {}> = T & { children: ReactNode };

export type FileWithPreview = File & { preview?: string };

export type UseTranslationsReturn = ReturnType<typeof useTranslations>;

export interface UserResponseData {
  id: string;
  parent?: UserResponseDataParent;
  personalInfo: PersonalInfo;
  address?: Address;
  email: string;
  phone: string;
  username: string;
  accountType: number;
  isTrialExpired?: boolean;
  createdAt: string;
  isActive: boolean;
  isBanned: boolean;
  avatar: string | null;
  avatarFullUrl: string | null;
  taxCode?: string;
  roles?: string[];
  sponsorLink?: string;
  zaloUrl?: string;
  popupsViewed?: Array<number>;
  gapoUserId?: number;
  kungfuDetail?: {
    code: string;
    id: string;
    price: number;
  };
  fullName?: string;
  dialCode?: string;
  isAgent?: boolean;
}

export interface UserResponseDataParent {
  id: string;
  username: string;
  fullName: any;
  createdAt: string;
  accountType: number;
  phone: string;
}

export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  sex: number;
  identityCard: string;
  dateOfIssue: string;
  placeOfIssue: string;
  placeOfIssueId: any;
  permanentAddress: PermanentAddress;
  status: number;
  createdAt: string;
  modifiedAt: string;
  identityCardFirstImage: string;
  identityCardSecondImage: string;
  identityCardThirdImage: string;
  reason: string;
}

export interface PermanentAddress {
  street: string;
  provinceId: string;
  provinceName: string;
  districtId: string;
  districtName: string;
  wardId: string;
  wardName: string;
  hamletId: string;
  hamlet: string;
  fullAddress: string;
}

export interface Address {
  street: any;
  provinceId: string;
  provinceName: string;
  districtId: string;
  districtName: string;
  wardId: string;
  wardName: string;
  hamletId: any;
  hamlet: string;
  fullAddress: string;
  isNullOrEmpty: boolean;
}

export interface BaseResponse<T> {
  statusCode?: number;
  message?: any;
  data: T;
  pageable?: Pageable;
}

export interface LoginResponseData {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
}

export interface Pageable {
  pageNumber: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
}

export interface PdpInformations {
  id: string;
  name: string;
  fullName: string;
  pdpLabel: string;
  email: string;
  phone: string;
  totalProductsSellingQuantity: number;
  gapoGroupUrl: string;
  address: string;
  background: string;
  backgroundUrl: string;
  avatarUrl: string;
  avatar: string;
}

export interface PdpReport {
  customerSummary: {
    revenue: number;
    company: {
      expensePerItem: number;
      totalExpense: number;
    };
    product: {
      expensePerItem: number;
      totalExpense: number;
    };
    totalCustomer: number;
    totalAcceptanceRecord: number;
  };
  collaboratorSummary: {
    revenue: number;
    company: {
      expensePerItem: number;
      totalExpense: number;
    };
    product: {
      expensePerItem: number;
      totalExpense: number;
    };
    totalCollaborator: number;
  };
  acceptanceRecordStatusSummary: {
    totalAcceptanceRecordCreated: number;
    totalAcceptanceRecordIsNew: number;
    totalAcceptanceRecordIsWaitingConfirm: number;
    totalAcceptanceRecordIsWaitingForSign: number;
    totalAcceptanceRecordIsCompleted: number;
    totalAcceptanceRecordIsArchive: number;
    totalAcceptanceRecordIsCanceled: number;
  };
  monthYearFilter: string;
}

export interface ProductTrafficItem {
  id: string;
  supplierId: string;
  price: number;
  visitTime: number;
  visitType: string;
  productName: string;
  productLink: string;
}

export interface PDPTrafficItem {
  id: string;
  supplierId: string;
  price: number;
  visitTime: number;
  visitType: string;
  productName: string;
  productLink: string;
}
