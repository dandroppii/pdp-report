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
  roles?: string[];
}

export interface PdpReport {
  visitType: string;
  totalVisitInDuration: number;
  revenueInDuration: number;
  currentPrice: number;
  avgPricePerItem: number;
}

export interface TrafficItem {
  id: string;
  supplierId: string;
  price: number;
  taxPercent: number;
  visitTime: number;
  visitType: string;
  productName: null;
  productLink: null;
  userAgent: string;
}

export interface ProductTrafficItemSummary {
  supplierId: string;
  price: number;
  taxPercent: number;
  visitType: string;
  totalCount: number;
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
  userAgent: string;
}

export interface PDPTrafficItemForDownload {
  STT: number;
  'Thời gian': string;
  'Thiết bị': string;
}

export interface ListPdp {
  name: string;
  id: string;
}

export interface ListPdpResponse {
  name: string;
  id: string;
  fullName: string;
  phone: string;
  email: string;
  status: number;
  userDetail?: {
    username: string;
    id: string;
  };
}
