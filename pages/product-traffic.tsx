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
import { H1, H2, H3, H4, Paragraph, Span } from 'components/Typography';
import useMuiTable from 'hooks/useMuiTable';
import { StyledTableCell, StyledTableRow } from 'pages-sections/admin';
import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import Card2 from 'pages-sections/dashboard/Card2';
import { formatDatetime } from 'utils/datetime';
import { GET_PRODUCT_TRAFFICS_RESPONSE } from 'constance/mockPdpData';
import { useAppContext } from 'contexts/AppContext';
import { ProductTrafficItemSummary, TrafficItem } from 'types/common';
import DRowSkeleton from 'pages-sections/admin/DOrderSkeleton';
import { ExternalLink } from 'components/layouts/vendor-dashboard/LayoutStyledComponents';
import { pdpService } from 'api';
import { MAX_ITEM_PER_SHEET } from 'utils/constants';
import toast, { Toaster } from 'react-hot-toast';
import { convertToSlug } from 'utils/utils';
import { formatNumber } from 'utils/number';
import { exportToExcel } from 'react-json-to-excel';
import { useAuthContext } from 'contexts/AuthContext';
import { ContentWrapper } from './pdp-traffic';
import { FlexBox } from 'components/flex-box';
import BazaarSwitch from 'components/BazaarSwitch';
import { formatCurrency } from 'utils/currency';
import ReactToPrint from 'react-to-print';

const tableHeading = [
  { id: 'no', label: 'No', align: 'center', size: 'small' },
  { id: 'productName', label: 'Sản phẩm', align: 'left' },
  { id: 'startTime', label: 'Thời gian', align: 'center' },
  { id: 'userAgent', label: 'Thiết bị', align: 'center' },
];

const tableHeadingBasic = [
  { id: 'no', label: 'No', align: 'center', size: 'small' },
  { id: 'productName', label: 'Sản phẩm', align: 'left' },
  { id: 'totalVisit', label: 'Số lượt truy cập', align: 'center' },
  { id: 'cost', label: 'Phí dịch vụ', align: 'right' },
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
    state: { fromDate, toDate, productReport, selectedPdp },
  } = useAppContext();
  const { user, isAdmin } = useAuthContext();
  const [productTraffic, setProductTraffic] = useState<TrafficItem[]>([]);
  const [productTrafficSummary, setProductTrafficSummary] = useState<ProductTrafficItemSummary[]>(
    []
  );
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBasicMode, setIsBasicMode] = useState<boolean>(true);
  const [totalPageDownload, setTotalPageDownload] = useState<number>(100);
  const [percent, setPercent] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const contentPrintRef = useRef();

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
          supplierId: selectedPdp?.id,
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
    [toDate, fromDate, selectedPdp]
  );

  const getProductTrafficSummary = useCallback(async () => {
    setLoading(true);
    try {
      const response = await pdpService.getProductTrafficsSummary({
        fromDate: formatDatetime(fromDate.getTime(), 'yyyy-MM-dd'),
        toDate: formatDatetime(toDate.getTime(), 'yyyy-MM-dd'),
        supplierId: selectedPdp?.id,
      });
      setLoading(false);
      if (response.statusCode === 0) {
        setProductTrafficSummary(response.data);
      }
    } catch (error) {
      setLoading(false);
    }
  }, [toDate, fromDate, selectedPdp]);

  const triggerDownloadReport = useCallback(
    (data, index, isOneFile) => {
      try {
        const fileName = isOneFile
          ? `traffic_san_pham_${convertToSlug(user?.fullName)}_report_tu_${formatDatetime(
              fromDate.getTime(),
              'yyyyMMdd'
            )}_den_${formatDatetime(toDate.getTime(), 'yyyyMMdd')}`
          : `traffic_san_pham_${convertToSlug(user?.fullName)}_report_tu_${formatDatetime(
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
                    'Số lượt truy cập': productReport?.totalVisitInDuration,
                    'Đơn giá dịch vụ': productReport?.avgPricePerItem,
                    'Phí dịch vụ':
                      productReport?.totalVisitInDuration * productReport?.avgPricePerItem,
                  },
                ],
              },
              ...data,
            ];
        exportToExcel(exportData, fileName, true);
        resetDownload();
        toast.success('Tải báo cáo thành công!');
      } catch (error) {
        console.log('🚀 ~ file: product-traffic.tsx:131 ~ ProductTraffic ~ error:', error);
        toast.error(error.message);
        resetDownload();
      }
    },
    [fromDate, toDate, user?.fullName, resetDownload, productReport]
  );

  const triggerDownloadBasicReport = useCallback(() => {
    try {
      const fileName = `traffic_san_pham_${convertToSlug(
        user?.fullName
      )}_report_tu_${formatDatetime(fromDate.getTime(), 'yyyyMMdd')}_den_${formatDatetime(
        toDate.getTime(),
        'yyyyMMdd'
      )}`;
      const newSheet = {
        sheetName: `Số lượt tiếp cận`,
        details: productTrafficSummary.map((item, index) => ({
          STT: index + 1,
          'Sản phẩm': item.productName,
          'Số lượt truy cập': item.totalCount,
          'Phí dịch vụ': item.totalCount * item.price,
        })),
      };

      const exportData = [
        {
          sheetName: 'Tổng quan',
          details: [
            {
              'Số lượt truy cập': productReport?.totalVisitInDuration,
              'Đơn giá dịch vụ': productReport?.avgPricePerItem,
              'Phí dịch vụ': productReport?.totalVisitInDuration * productReport?.avgPricePerItem,
            },
          ],
        },
        newSheet,
      ];
      exportToExcel(exportData, fileName, true);
      resetDownload();
      toast.success('Tải báo cáo thành công!');
    } catch (error) {
      console.log('🚀 ~ file: product-traffic.tsx:131 ~ ProductTraffic ~ error:', error);
      toast.error(error.message);
      resetDownload();
    }
  }, [fromDate, toDate, user?.fullName, resetDownload, productReport, productTrafficSummary]);

  const getProductTrafficDownload = useCallback(
    async (pageNumber: number) => {
      try {
        const response = await pdpService.getPdpTraffics({
          fromDate: formatDatetime(fromDate.getTime(), 'yyyy-MM-dd'),
          toDate: formatDatetime(toDate.getTime(), 'yyyy-MM-dd'),
          type: 'PRODUCT',
          page: pageNumber,
          size: MAX_ITEM_PER_SHEET,
          supplierId: selectedPdp?.id,
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
        console.log('🚀 ~ file: product-traffic.tsx:167 ~ error:', error);
        toast.error('Lỗi khi tải dữ liệu. Vui lòng thử lại sau vài phút!');
        resetDownload();
      }
    },
    [toDate, fromDate, resetDownload, selectedPdp?.id]
  );

  const startDownload = useCallback(async () => {
    try {
      setOpenDialog(true);
      setPercent(0);
      const dataDownload = [];
      for (let i = 0; i < totalPageDownload; i++) {
        const index = Math.round(i / 40);
        const res = await getProductTrafficDownload(i + 1);
        if (dataDownload[index]) {
          dataDownload[index].push(res);
        } else {
          dataDownload[index] = [res];
        }
      }
      dataDownload.forEach((data, index) => {
        triggerDownloadReport(data, index, dataDownload.length === 1);
      });
    } catch (error) {
      console.log('🚀 ~ file: product-traffic.tsx:192 ~ startDownload ~ error:', error);
    }
  }, [getProductTrafficDownload, totalPageDownload, triggerDownloadReport]);

  useEffect(() => {
    if (!isAdmin || (isAdmin && selectedPdp)) {
      getProductTraffic(1);
      getProductTrafficSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, selectedPdp, isAdmin]);

  const { order, orderBy, selected, filteredList, handleRequestSort } = useMuiTable({
    listData: productTraffic,
  });

  const {
    order: orderBasic,
    orderBy: orderByBasic,
    selected: selectedBasic,
    filteredList: filteredListBasic,
    handleRequestSort: handleRequestSortBasic,
  } = useMuiTable({
    listData: productTrafficSummary,
    pageSize: productTrafficSummary?.length,
  });

  return (
    <Box py={2}>
      <H1 my={2} textTransform="uppercase" textAlign={'center'} color="grey.900">
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
          <Box mr={2}>
            Xem chi tiết{' '}
            <BazaarSwitch
              color="info"
              checked={!isBasicMode}
              onChange={e => {
                setIsBasicMode(!e?.target?.checked);
              }}
            />
          </Box>
          {isBasicMode ? (
            <>
              <ReactToPrint
                documentTitle="Số lượng tiếp cận thông tin sản phẩm"
                content={() => contentPrintRef.current}
                trigger={() => (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={loading || !productTrafficSummary.length}
                  >
                    In báo cáo(pdf)
                  </Button>
                )}
              />
              <Button
                sx={{ ml: 2 }}
                variant="contained"
                color="primary"
                onClick={triggerDownloadBasicReport}
                disabled={loading || !productTrafficSummary.length}
              >
                Tải báo cáo(xlsx)
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={startDownload}
              disabled={loading || !productTraffic.length}
            >
              Tải báo cáo(xlsx)
            </Button>
          )}
        </FlexBox>
        {isBasicMode ? (
          <>
            <Scrollbar>
              <Box
                ref={(element: any) => (contentPrintRef.current = element)}
                sx={{
                  '@media print': {
                    padding: '30px',
                    table: {},
                    '.MuiTableHead-root': {
                      backgroundColor: 'transparent !important',
                    },
                    '.MuiTableContainer-root': {
                      marginTop: '30px',
                    },
                    'th, tr, td': {
                      border: '1px solid !important',
                      color: '#2B3445 !important',
                    },
                    a: {
                      color: '#2B3445 !important',
                      whiteSpace: 'normal',
                    },
                    h3: {
                      display: 'block',
                      marginTop: '30px',
                    },
                    '.print': {
                      display: 'block',
                    },
                  },
                }}
              >
                <H3
                  my={2}
                  textTransform="uppercase"
                  textAlign={'center'}
                  color="grey.900"
                  sx={{ display: 'none' }}
                >
                  Số lượng tiếp cận thông tin sản phẩm từ <br />
                  {formatDatetime(fromDate.getTime(), 'dd/MM/yyyy')} đến{' '}
                  {formatDatetime(toDate.getTime(), 'dd/MM/yyyy')}
                </H3>

                <Span className="print" sx={{ display: 'none' }}>
                  Số lượt truy cập:{' '}
                  <strong>{formatNumber(productReport?.totalVisitInDuration)}</strong> lượt
                </Span>
                <Span className="print" sx={{ display: 'none' }}>
                  Đơn giá dịch vụ: <strong>{formatCurrency(productReport?.avgPricePerItem)}</strong>
                </Span>
                <Span className="print" sx={{ display: 'none' }}>
                  Phí dịch vụ:{' '}
                  <strong>
                    {formatCurrency(
                      productReport?.avgPricePerItem * productReport?.totalVisitInDuration
                    )}
                  </strong>
                </Span>
                <TableContainer>
                  <Table>
                    <TableHeader
                      order={orderBasic}
                      hideSelectBtn
                      orderBy={orderByBasic}
                      heading={tableHeadingBasic}
                      rowCount={productTrafficSummary.length}
                      numSelected={selectedBasic.length}
                      onRequestSort={handleRequestSortBasic}
                    />

                    <TableBody>
                      {loading ? (
                        <DRowSkeleton numberOfCol={4}></DRowSkeleton>
                      ) : (
                        filteredListBasic.map((item, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell align="center" size="small" sx={{ width: '5%' }}>
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell align="left" sx={{ width: '50%' }}>
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
                            <StyledTableCell align="center" sx={{ width: '25%' }}>
                              {formatNumber(item.totalCount)}
                            </StyledTableCell>
                            <StyledTableCell align="right" sx={{ width: '20%' }}>
                              {formatCurrency(item.totalCount * item.price)}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Scrollbar>
          </>
        ) : (
          <>
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
          </>
        )}
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
