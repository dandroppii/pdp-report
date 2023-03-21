import {
  Box,
  Button,
  Card,
  CircularProgress,
  debounce,
  Dialog,
  DialogContent,
  Grid,
  LinearProgress,
  Stack,
  Table,
  TableContainer,
} from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableHeader from 'components/data-table/TableHeader';
import TablePagination from 'components/data-table/TablePagination';
import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import Scrollbar from 'components/Scrollbar';
import { H1, H2, Paragraph } from 'components/Typography';
import useMuiTable from 'hooks/useMuiTable';
import { StyledTableCell, StyledTableRow } from 'pages-sections/admin';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import Card2 from 'pages-sections/dashboard/Card2';
import { formatDatetime } from 'utils/datetime';
import { GET_PRODUCT_TRAFFICS_RESPONSE } from 'constance/mockPdpData';
import { useAppContext } from 'contexts/AppContext';
import { TrafficItem } from 'types/common';
import DRowSkeleton from 'pages-sections/admin/DOrderSkeleton';
import { ExternalLink } from 'components/layouts/vendor-dashboard/LayoutStyledComponents';
import { pdpService } from 'api';
import { MAX_ITEM_PER_SHEET } from 'utils/constants';
import toast, { Toaster } from 'react-hot-toast';
import { convertToSlug } from 'utils/utils';
import { exportToExcel } from 'react-json-to-excel';
import { useAuthContext } from 'contexts/AuthContext';
import { ContentWrapper } from './pdp-traffic';
import { FlexBox } from 'components/flex-box';

const tableHeading = [
  { id: 'no', label: 'No', align: 'left' },
  { id: 'productName', label: 'Sản phẩm', align: 'left' },
  { id: 'startTime', label: 'Thời gian', align: 'center' },
  { id: 'userAgent', label: 'Thiết bị', align: 'center' },
];

// =============================================================================
ProductTraffic.getLayout = function getLayout(page: ReactElement) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

type ProductTrafficProps = {};

// =============================================================================

export default function ProductTraffic({}: ProductTrafficProps) {
  const {
    state: { fromDate, toDate, productReport },
  } = useAppContext();
  const { user } = useAuthContext();
  const [productTraffic, setProductTraffic] = useState<TrafficItem[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPageDownload, setTotalPageDownload] = useState<number>(100);
  const [percent, setPercent] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const resetDownload = useCallback(() => {
    setPercent(0);
    setOpenDialog(false);
  }, []);

  const getProductTraffic = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
      try {
        const response = await pdpService.getPdpTraffics({
          fromDate: formatDatetime(fromDate.getTime(), 'yyyy-MM-dd'),
          toDate: formatDatetime(toDate.getTime(), 'yyyy-MM-dd'),
          type: 'PRODUCT',
          page: pageNumber,
        });
        setLoading(false);
        if (response.statusCode === 0) {
          setProductTraffic(response.data);
          setTotalPage(response.pageable.totalPages);
          setCurrentPage(pageNumber);
          setTotalPageDownload(Math.ceil(response.pageable.totalElements / MAX_ITEM_PER_SHEET));
        }
      } catch (error) {
        setLoading(false);
      }
    },
    [toDate, fromDate]
  );

  const triggerDownloadReport = useCallback(
    data => {
      try {
        const fileName = `traffic_san_pham_${convertToSlug(
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
                  'Số lượt truy cập': productReport?.totalVisitInDuration,
                  'Đơn giá dịch vụ': productReport?.avgPricePerItem,
                  'Phí dịch vụ':
                    productReport?.totalVisitInDuration * productReport?.avgPricePerItem,
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
    [fromDate, toDate, user.fullName, resetDownload, productReport]
  );

  const getProductTrafficDownload = useCallback(
    async (pageNumber: number) => {
      try {
        const response = await pdpService.getPdpTraffics({
          fromDate: formatDatetime(fromDate.getTime(), 'yyyy-MM-dd'),
          toDate: formatDatetime(toDate.getTime(), 'yyyy-MM-dd'),
          type: 'PRODUCT',
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
              'Sản phẩm': item.productName,
              'Link sản phẩm': item.productLink,
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
      const res = await getProductTrafficDownload(i + 1);
      dataDownload.push(res);
    }
    triggerDownloadReport(dataDownload);
  }, [getProductTrafficDownload, totalPageDownload, triggerDownloadReport]);

  useEffect(() => {
    getProductTraffic(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  const { order, orderBy, selected, filteredList, handleRequestSort } = useMuiTable({
    listData: productTraffic,
  });

  return (
    <Box py={2}>
      <H1 my={2} textTransform="uppercase" textAlign={'center'}>
        Số lượng tiếp cận thông tin sản phẩm
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
            amount={productReport?.totalVisitInDuration}
            loading={loading}
          ></Card2>
        </Grid>
        <Grid item xl={4} lg={4} md={4} xs={12}>
          <Card2
            title="Đơn giá dịch vụ"
            amount={productReport?.avgPricePerItem}
            currency
            loading={loading}
          ></Card2>
        </Grid>
        <Grid item xl={4} lg={4} md={4} xs={12}>
          <Card2
            title="Phí dịch vụ"
            amount={productReport?.totalVisitInDuration * productReport?.avgPricePerItem}
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
          <TableContainer>
            <Table>
              <TableHeader
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                rowCount={productTraffic.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {loading ? (
                  <DRowSkeleton numberOfCol={4}></DRowSkeleton>
                ) : (
                  filteredList.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="left">
                        {(currentPage - 1) * 20 + index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <ExternalLink
                          color="blue.main"
                          href={item.productLink}
                          rel="noopener noreferrer"
                          target="_blank"
                          title={item.productName}
                        >
                          {item.productName}
                        </ExternalLink>
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
              getProductTraffic(page);
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
    </Box>
  );
}
