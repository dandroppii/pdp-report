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
import { PDPTrafficItem } from 'types/common';
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

const tableHeading = [
  { id: 'no', label: 'No', align: 'left' },
  { id: 'startTime', label: 'Thời gian', align: 'center' },
  { id: 'userAgent', label: 'Thiết bị', align: 'center' },
];

// =============================================================================
PdpTraffic.getLayout = function getLayout(page: ReactElement) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
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

type PdpTrafficProps = {};

// =============================================================================

export default function PdpTraffic({}: PdpTrafficProps) {
  const {
    state: { fromDate, toDate, pdpReport, pdpId },
  } = useAppContext();
  const { user, isAdmin } = useAuthContext();

  const [pdpTraffic, setPdpTraffic] = useState<PDPTrafficItem[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPageDownload, setTotalPageDownload] = useState<number>(100);
  const [percent, setPercent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const resetDownload = useCallback(() => {
    setPercent(0);
    setOpenDialog(false);
  }, []);

  const getPdpTraffic = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
      try {
        const response = await pdpService.getPdpTraffics({
          fromDate: formatDatetime(fromDate.getTime(), 'yyyy-MM-dd'),
          toDate: formatDatetime(toDate.getTime(), 'yyyy-MM-dd'),
          type: 'PDP',
          page: pageNumber,
          supplierId: pdpId,
        });
        setLoading(false);
        if (response.statusCode === 0) {
          setPdpTraffic(response.data);
          setTotalPage(response.pageable.totalPages);
          setCurrentPage(pageNumber);
          setTotalPageDownload(Math.ceil(response.pageable.totalElements / MAX_ITEM_PER_SHEET));
        }
      } catch (error) {
        setLoading(false);
      }
    },
    [toDate, fromDate, pdpId]
  );

  const triggerDownloadReport = useCallback(
    data => {
      try {
        const fileName = `traffic_cong_ty_${convertToSlug(
          user.fullName
        )}_report_tu_${formatDatetime(fromDate.getTime(), 'yyyyMMdd')}_den_${formatDatetime(
          toDate.getTime(),
          'yyyyMMdd'
        )}`;
        exportToExcel(
          [
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
          ],
          fileName,
          true
        );
        resetDownload();
        toast.success('Tải báo cáo thành công!');
      } catch (error) {
        toast.error(error.message);
        resetDownload();
      }
    },
    [fromDate, toDate, user.fullName, resetDownload, pdpReport]
  );

  const getPdpTrafficDownload = useCallback(
    async (pageNumber: number) => {
      try {
        const response = await pdpService.getPdpTraffics({
          fromDate: formatDatetime(fromDate.getTime(), 'yyyy-MM-dd'),
          toDate: formatDatetime(toDate.getTime(), 'yyyy-MM-dd'),
          type: 'PDP',
          page: pageNumber,
          size: MAX_ITEM_PER_SHEET,
        });
        if (response.statusCode === 0) {
          const page = response.pageable.pageNumber;
          setPercent(page + 1);
          const startIndex = (page - 1) * MAX_ITEM_PER_SHEET;
          const newSheet = {
            sheetName: `${startIndex + 1} - ${startIndex + response.data.length}`,
            details: response.data.map((item, index) => ({
              STT: startIndex + index + 1,
              'Thời gian': formatDatetime(item.visitTime),
              'Thiết bị': item.userAgent,
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
    [toDate, fromDate, resetDownload]
  );

  const startDownload = useCallback(async () => {
    setOpenDialog(true);
    setPercent(0);
    const dataDownload = [];
    for (let i = 0; i < totalPageDownload; i++) {
      const res = await getPdpTrafficDownload(i + 1);
      dataDownload.push(res);
    }
    triggerDownloadReport(dataDownload);
  }, [getPdpTrafficDownload, totalPageDownload, triggerDownloadReport]);

  useEffect(() => {
    (!isAdmin || (isAdmin && pdpId)) && getPdpTraffic(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, pdpId, isAdmin]);

  const { order, orderBy, selected, filteredList, handleRequestSort } = useMuiTable({
    listData: pdpTraffic,
  });

  return (
    <Box py={2}>
      <H1 my={2} textTransform="uppercase" textAlign={'center'}>
        Số lượng tiếp cận thông tin công ty
      </H1>

      <Paragraph fontStyle="italic" fontSize={14} mb={3} textAlign="center" color="grey.600">
        {loading ? (
          <>
            <CircularProgress
              color="primary"
              size={20}
              sx={{ marginRight: '10px', marginBottom: '-5px' }}
            />
            Đang tải dữ liệu, vui lòng đợi trong giây lát
          </>
        ) : (
          <>Dữ liệu sẽ được cập nhật chính xác trong vòng 72h tới</>
        )}
      </Paragraph>

      <Grid container spacing={3} mb={4}>
        <Grid item xl={4} lg={4} md={4} xs={12}>
          <Card2
            title="Số lượt truy cập"
            amount={pdpReport?.totalVisitInDuration}
            loading={loading}
          ></Card2>
        </Grid>
        <Grid item xl={4} lg={4} md={4} xs={12}>
          <Card2
            title="Đơn giá dịch vụ"
            amount={pdpReport?.avgPricePerItem}
            currency
            loading={loading}
          ></Card2>
        </Grid>
        <Grid item xl={4} lg={4} md={4} xs={12}>
          <Card2
            title="Phí dịch vụ"
            amount={pdpReport?.totalVisitInDuration * pdpReport?.avgPricePerItem}
            currency
            loading={loading}
            description="* Chưa bao gồm VAT"
          ></Card2>
        </Grid>
      </Grid>

      <Card>
        <FlexBox justifyContent={'flex-end'} m={1}>
          <Button variant="contained" color="primary" onClick={startDownload} disabled={loading}>
            Tải báo cáo
          </Button>
        </FlexBox>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 1100 }}>
            <Table>
              <TableHeader
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                rowCount={pdpTraffic.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {loading ? (
                  <DRowSkeleton numberOfCol={3}></DRowSkeleton>
                ) : (
                  filteredList.map((item, index) => (
                    <StyledTableRow role="checkbox" key={index}>
                      <StyledTableCell align="left">
                        {(currentPage - 1) * 20 + index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {formatDatetime(item.visitTime)}
                      </StyledTableCell>
                      <StyledTableCell align="center">{item.userAgent}</StyledTableCell>
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
              getPdpTraffic(page);
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
