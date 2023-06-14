import { sortBy } from 'lodash';
import { ReportDetailResponse, ReportItem, ReportResponse } from 'types/common';
import { formatDatetime } from './datetime';

export const formatCmsItem = (listCms: ReportResponse[]): ReportItem[] => {
  const list =
    listCms?.map(i => ({
      ...i,
      lastTimeDownload: formatDatetime(i.lastTimeDownload, 'dd/MM/yyyy hh:mm:ss a'),
      lastTimeRecalculate: formatDatetime(i.lastTimeRecalculate, 'dd/MM/yyyy hh:mm:ss a'),
    })) || [];
  return sortBy(list, i => +i.month);
};

export const formatCmsDetailItem = (
  listCmsDetail: ReportDetailResponse[]
): ReportDetailResponse[] => {
  return listCmsDetail?.map(i => ({
    ...i,
    bankAccountHolder: i.bankAccountHolder || '',
    bankAccountNumber: i.bankAccountNumber || '',
    bankName: i.bankName || '',
    fullName: i.fullName || '',
  }));
};
