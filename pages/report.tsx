import {
  Box,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  LinearProgress,
  Stack,
  Table,
  TableContainer,
  styled,
  Button,
  TextField,
} from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableHeader from 'components/data-table/TableHeader';
import TablePagination from 'components/data-table/TablePagination';
import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import Scrollbar from 'components/Scrollbar';
import { H1, H2, Paragraph } from 'components/Typography';
import useMuiTable from 'hooks/useMuiTable';
import { StyledTableCell, StyledTableRow } from 'pages-sections/admin';
import React, { ReactElement } from 'react';
import Card2 from 'pages-sections/dashboard/Card2';
import { formatDatetime } from 'utils/datetime';
import { useAppContext } from 'contexts/AppContext';
import { useState } from 'react';
import { ReportItem } from 'types/common';
import { useCallback } from 'react';
import { useEffect } from 'react';
import DRowSkeleton from 'pages-sections/admin/DOrderSkeleton';
import { pdpService } from 'api';
import { exportToExcel } from 'react-json-to-excel';
import { useAuthContext } from 'contexts/AuthContext';
import { convertToSlug } from 'utils/utils';
import { MAX_ITEM_PER_SHEET } from 'utils/constants';
import { FlexBox } from 'components/flex-box';
import toast, { Toaster } from 'react-hot-toast';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { mockReportCmsList } from './mock';
import { useRouter } from 'next/router';
import { formatCmsItem } from 'utils/reports';

const tableHeading = [
  { id: 'id', label: 'STT', align: 'left', size: 'small' },
  { id: 'month', label: 'Tháng', align: 'center' },
  { id: 'fileName', label: 'Tên file', align: 'center' },
  { id: 'lastDownloaded', label: 'Lần tải cuối', align: 'center' },
  { id: 'lastRecalculating', label: 'Lần tính toán cuối', align: 'center' },
  { id: 'action', label: 'Thao tác', align: 'center' },
];

// =============================================================================
Report.getLayout = function getLayout(page: ReactElement) {
  return <VendorDashboardLayout adminFeature={true}>{page}</VendorDashboardLayout>;
};
// =============================================================================

export const ContentWrapper = styled(Box)(({ theme }) => ({
  textAlign: 'center',

  '& .carousel:hover': {
    cursor: 'pointer',
    '& .carousel__back-button': { opacity: 1, left: 10 },
    '& .carousel__next-button': { opacity: 1, right: 10 },
  },
  '& .carousel__next-button, & .carousel__back-button': {
    opacity: 0,
    boxShadow: 'none',
    transition: 'all 0.3s',
    background: 'transparent',
    color: theme.palette.primary.main,
    ':disabled': { color: theme.palette.grey[500] },
    ':hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
    },
  },
  '& .carousel__back-button': { left: 0 },
  '& .carousel__next-button': { right: 0 },
}));

type ReportProps = {};

// =============================================================================

export default function Report({}: ReportProps) {
  const {
    state: { fromDate, toDate, pdpReport },
  } = useAppContext();
  const { user, isAdmin } = useAuthContext();
  const [cmsList, setCmsList] = useState<ReportItem[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPageDownload, setTotalPageDownload] = useState<number>(100);
  const [percent, setPercent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingRecalculate, setLoadingRecalculate] = useState<{ [key: string]: boolean }>({});
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const router = useRouter();
  const pageSize = 12;

  const resetDownload = useCallback(() => {
    setPercent(0);
    setOpenDialog(false);
  }, []);

  const getCmsList = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      // const response = await pdpService.getCms({
      //   year: '2023',
      //   page: pageNumber,
      // });
      const delay = () => {
        return new Promise(resolve => setTimeout(() => resolve(mockReportCmsList), 2000));
      };

      const response: any = await delay();
      setLoading(false);
      if (response.statusCode === 0) {
        const formatCmsData = formatCmsItem(response.data);
        setCmsList(formatCmsData);
        setTotalPage(response.pageable.totalPages);
        setCurrentPage(pageNumber);
      }
    } catch (error) {
      setLoading(false);
    }
  }, []);

  const triggerDownloadReport = useCallback(
    (data, index, isOneFile) => {
      try {
        const fileName = isOneFile
          ? `traffic_cong_ty_${convertToSlug(user?.fullName)}_report_tu_${formatDatetime(
              fromDate.getTime(),
              'yyyyMMdd'
            )}_den_${formatDatetime(toDate.getTime(), 'yyyyMMdd')}`
          : `traffic_cong_ty_${convertToSlug(user?.fullName)}_report_tu_${formatDatetime(
              fromDate.getTime(),
              'yyyyMMdd'
            )}_den_${formatDatetime(toDate.getTime(), 'yyyyMMdd')}_part_${index + 1}`;
        const exportData = index
          ? data
          : [
              {
                sheetName: 'Tổng quan',
                details: [
                  {
                    'Số lượt truy cập': pdpReport?.totalVisitInDuration,
                    'Đơn giá dịch vụ': pdpReport?.avgPricePerItem,
                    'Phí dịch vụ': pdpReport?.totalVisitInDuration * pdpReport?.avgPricePerItem,
                  },
                ],
              },
              ...data,
            ];
        exportToExcel(exportData, fileName, true);
        resetDownload();
        toast.success('Tải báo cáo thành công!');
      } catch (error) {
        toast.error(error.message);
        resetDownload();
      }
    },
    [fromDate, toDate, user?.fullName, resetDownload, pdpReport]
  );

  const getCmsDetailForDownload = useCallback(
    async (pageNumber: number) => {
      try {
        const response = await pdpService.getCms({
          year: '2023',
          page: pageNumber,
          size: MAX_ITEM_PER_SHEET,
        });
        if (response.statusCode === 0) {
          const page = response.pageable.pageNumber;
          setPercent(page + 1);
          const startIndex = (page - 1) * MAX_ITEM_PER_SHEET;
          const newSheet = {
            sheetName: `${startIndex + 1} - ${startIndex + response.data.length}`,
            details: response.data.map((_item, index) => ({
              STT: startIndex + index + 1,
            })),
          };
          return newSheet;
        } else {
          return [];
        }
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu. Vui lòng thử lại sau vài phút!');
        resetDownload();
      }
    },
    [resetDownload]
  );

  const startDownload = useCallback(async () => {
    // setOpenDialog(true);
    // setPercent(0);
    // const dataDownload = [];
    // for (let i = 0; i < totalPageDownload; i++) {
    //   const index = Math.round(i / 40);
    // const res = await getCmsListDownload(i + 1);
    //   if (dataDownload[index]) {
    //     dataDownload[index].push(res);
    //   } else {
    //     dataDownload[index] = [res];
    //   }
    // }
    // dataDownload.forEach((data, index) => {
    //   triggerDownloadReport(data, index, dataDownload.length === 1);
    // });
  }, [totalPageDownload, triggerDownloadReport]);

  useEffect(() => {
    getCmsList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    !isAdmin && router?.isReady && router.push('/');
  }, [isAdmin, router]);

  const { order, orderBy, selected, filteredList, handleRequestSort } = useMuiTable({
    listData: cmsList,
  });

  return (
    <Box py={2}>
      <H1 my={2} textTransform="uppercase" textAlign={'center'} color="grey.900">
        CMS
      </H1>

      <Card>
        <FlexBox justifyContent={'flex-start'} m={1} p={1}>
          <DatePicker
            views={['year']}
            label="Chọn năm"
            value={fromDate}
            minDate={new Date('01/01/2010')}
            maxDate={new Date()}
            onChange={() => {}}
            disableFuture={true}
            renderInput={params => (
              <TextField
                inputProps={{
                  ...params.inputProps,
                  value: new Date() === null ? '' : new Date().getMonth() + 1,
                }}
                {...params}
                helperText={null}
              />
            )}
          ></DatePicker>
        </FlexBox>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 1100 }}>
            <Table>
              <TableHeader
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                rowCount={cmsList.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {loading ? (
                  <DRowSkeleton numberOfCol={6}></DRowSkeleton>
                ) : (
                  filteredList.map((item, index) => (
                    <StyledTableRow role="checkbox" key={index}>
                      <StyledTableCell align="left">
                        {(currentPage - 1) * pageSize + index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">{item.month}</StyledTableCell>
                      <StyledTableCell align="center">{item.fileName}</StyledTableCell>
                      <StyledTableCell align="center">{item.lastDownloadTime}</StyledTableCell>
                      <StyledTableCell align="center">{item.lastCalculateTime}</StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          disabled={loadingRecalculate[item.id]}
                          sx={{ mr: 1 }}
                          onClick={() => startDownload(item.id)}
                        >
                          Tải báo cáo
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={loadingRecalculate[item.id]}
                          sx={{ borderRadius: '8px' }}
                        >
                          Tính toán lại
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination
            disabled={loading}
            onChange={(_e, page) => {
              getCmsList(page);
            }}
            count={totalPage}
            page={currentPage}
          />
        </Stack>
      </Card>

      <Dialog open={openDialog} maxWidth={false} sx={{ zIndex: 1501 }}>
        <DialogContent sx={{ maxWidth: 500, width: '100%', p: '40px' }}>
          <ContentWrapper>
            <H2>Đang chuẩn bị dữ liệu </H2>
            <Paragraph my={2}>
              Báo cáo của bạn sẽ được tự động tải xuống sau vài giây. Vui lòng không tắt trình
              duyệt!
            </Paragraph>
          </ContentWrapper>
          <Box mt={3}>
            <LinearProgress
              variant="buffer"
              value={(100 * percent) / totalPageDownload}
              valueBuffer={(100 * percent) / totalPageDownload}
            />
          </Box>
        </DialogContent>
      </Dialog>
      <Toaster toastOptions={{ duration: 4000 }} />
    </Box>
  );
}
