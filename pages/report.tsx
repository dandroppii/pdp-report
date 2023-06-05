import {
  Box,
  Card,
  Dialog,
  DialogContent,
  LinearProgress,
  Table,
  TableContainer,
  styled,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableHeader from 'components/data-table/TableHeader';
import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import Scrollbar from 'components/Scrollbar';
import { H1, H2, Paragraph } from 'components/Typography';
import useMuiTable from 'hooks/useMuiTable';
import { StyledTableCell, StyledTableRow } from 'pages-sections/admin';
import React, { ReactElement, useMemo } from 'react';
import { useAppContext } from 'contexts/AppContext';
import { useState } from 'react';
import { ReportItem } from 'types/common';
import { useCallback } from 'react';
import { useEffect } from 'react';
import DRowSkeleton from 'pages-sections/admin/DOrderSkeleton';
import { useAuthContext } from 'contexts/AuthContext';
import { FlexBox } from 'components/flex-box';
import { toast, Toaster } from 'react-hot-toast';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { useRouter } from 'next/router';
import { formatCmsDetailItem, formatCmsItem } from 'utils/reports';
import { Renderer } from 'xlsx-renderer';
import { saveAs } from 'file-saver';
import { cloneDeep, sumBy } from 'lodash';
import { pdpService } from 'api';
import { STATUS_CODE_SUCCESS } from 'utils/constants';

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
  const { isAdmin } = useAuthContext();
  const [cmsList, setCmsList] = useState<ReportItem[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [percent, setPercent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingRecalculate, setLoadingRecalculate] = useState<{ [key: string]: boolean }>({});
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const router = useRouter();

  const currentYear = useMemo(() => {
    return currentTime?.getFullYear();
  }, [currentTime]);

  const resetDownload = useCallback(() => {
    setPercent(0);
    setOpenDialog(false);
  }, []);

  const getCmsList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await pdpService.getCms(currentYear);
      setLoading(false);
      if (response.statusCode === 0) {
        const formatCmsData = formatCmsItem(response.data);
        setCmsList(formatCmsData);
      }
    } catch (error) {
      setLoading(false);
    }
  }, [currentYear]);

  const startDownload = useCallback(
    async (item: ReportItem) => {
      try {
        setOpenDialog(true);
        setPercent(0);
        const dataDownload = [];
        const res = await pdpService.getCmsDetail(item.id, 1);
        if (res.statusCode === STATUS_CODE_SUCCESS) {
          res?.data?.length && dataDownload.push(...res?.data);
          setPercent(Math.round((1 / res.pageable.totalPages) * 100));
          for (let i = 2; i <= res.pageable.totalPages; i++) {
            const resp = await pdpService.getCmsDetail(item.id, i);
            if (res.statusCode === STATUS_CODE_SUCCESS) {
              resp?.data?.length && dataDownload.push(...resp.data);
              const percenta = Math.round((i / res.pageable.totalPages) * 100);
              setPercent(percenta);
            }
          }
        }
        const totalCommission = sumBy(dataDownload, 'income');
        const totalTax = sumBy(dataDownload, 'tax');
        const totalIncomeAfterTax = sumBy(dataDownload, 'incomeAfterTax');
        const totalPdpTraffic = sumBy(dataDownload, 'pdpTraffic');
        const totalProductTraffic = sumBy(dataDownload, 'productTraffic');
        const now = new Date();

        const fileName = item.fileName;
        const formatData = formatCmsDetailItem(dataDownload);
        const data = {
          day: now.getDate(),
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          reportMonth: item.month,
          reportYear: currentYear,
          data: formatData,
          totalCommission,
          totalTax,
          totalProductTraffic,
          totalIncomeAfterTax,
          totalPdpTraffic,
        };
        fetch('./CMS.xlsx', {
          method: 'GET',
        })
          .then(response => response.arrayBuffer())
          .then(buffer => new Renderer().renderFromArrayBuffer(buffer, data))
          .then(report => report.xlsx.writeBuffer())
          .then(buffer => {
            resetDownload();
            saveAs(new Blob([buffer]), `${fileName}.xlsx`);
            getCmsList();
            toast.success('Tải báo cáo thành công!');
          })
          .catch(err => {
            resetDownload();
            toast.error(err?.message);
          });
      } catch (error) {
        resetDownload();
        toast.error(error?.message);
      }
    },
    [currentYear, getCmsList, resetDownload]
  );

  const handleRecalculateCms = useCallback(
    async (item: ReportItem, index: number) => {
      try {
        toast.loading('Đang tính toán lại số liệu!', {
          duration: 30000,
          id: item.id,
          ariaProps: { role: 'alert', 'aria-live': 'off' },
        });
        setLoadingRecalculate({ ...loadingRecalculate, [item.id]: true });
        const res = await pdpService.recalculateCms(item.id);
        setLoadingRecalculate({ ...loadingRecalculate, [item.id]: false });
        if (res.statusCode === STATUS_CODE_SUCCESS) {
          let newCmsList = cloneDeep(cmsList);
          const newCmsItem = formatCmsItem([res.data])[0];
          newCmsList[index] = newCmsItem;
          setCmsList(newCmsList);
          toast.success('Tính toán lại số liệu thành công!');
          toast.dismiss(item.id);
        }
      } catch (error) {
        setLoadingRecalculate({ ...loadingRecalculate, [item.id]: false });
        toast.error(error.message);
        toast.dismiss(item.id);
      }
    },
    [cmsList, loadingRecalculate]
  );

  useEffect(() => {
    currentYear && getCmsList();
  }, [currentYear]);

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
            value={currentTime}
            minDate={new Date('01/01/2023')}
            maxDate={new Date()}
            onChange={v => {
              setCurrentTime(v);
            }}
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
                      <StyledTableCell align="left">{index + 1}</StyledTableCell>
                      <StyledTableCell align="center">
                        {item.month}/{currentYear}
                      </StyledTableCell>
                      <StyledTableCell align="center">{item.fileName}</StyledTableCell>
                      <StyledTableCell align="center">{item.lastTimeDownload}</StyledTableCell>
                      <StyledTableCell align="center">{item.lastTimeRecalculate}</StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          disabled={loadingRecalculate[item.id]}
                          sx={{ mr: 1 }}
                          onClick={() => startDownload(item)}
                        >
                          Tải báo cáo
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={loadingRecalculate[item.id]}
                          sx={{ borderRadius: '8px' }}
                          onClick={() => handleRecalculateCms(item, index)}
                        >
                          {loadingRecalculate[item.id] ? (
                            <CircularProgress color="primary" size={12} sx={{ mr: 1 }} />
                          ) : (
                            <></>
                          )}
                          {loadingRecalculate[item.id] ? (
                            <>Đang tính toán lại</>
                          ) : (
                            <>Tính toán lại</>
                          )}
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
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
            <LinearProgress variant="buffer" value={percent} valueBuffer={percent} />
          </Box>
        </DialogContent>
      </Dialog>
      <Toaster toastOptions={{ duration: 4000 }} />
    </Box>
  );
}
