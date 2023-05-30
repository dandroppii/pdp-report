import { ReportItem, ReportResponse } from 'types/common';
import { formatDatetime } from './datetime';

export const formatCmsItem = (listCms: ReportResponse[]): ReportItem[] => {
  return listCms?.map(i => ({
    id: i.id,
    lastDownloadTime: formatDatetime(i.lastDownloadTime, 'dd/MM/yyyy HH:mm:ss'),
    lastCalculateTime: formatDatetime(i.lastCalculateTime, 'dd/MM/yyyy HH:mm:ss'),
    fileName: i.fileName,
    month: formatDatetime(i.createdDate, 'MM/yyyy'),
  }));
};
