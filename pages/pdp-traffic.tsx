import { Box, Card, Grid, Stack, Table, TableContainer } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableHeader from 'components/data-table/TableHeader';
import TablePagination from 'components/data-table/TablePagination';
import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import Scrollbar from 'components/Scrollbar';
import { H1, Paragraph } from 'components/Typography';
import useMuiTable from 'hooks/useMuiTable';
import { StyledTableCell, StyledTableRow } from 'pages-sections/admin';
import React, { ReactElement } from 'react';
import Card2 from 'pages-sections/dashboard/Card2';
import { formatDatetime } from 'utils/datetime';
import { useAppContext } from 'contexts/AppContext';
import { useState } from 'react';
import { PDPTrafficItem } from 'types/common';
import { useCallback } from 'react';
import { GET_PDP_TRAFFICS_RESPONSE } from 'constance/mockPdpData';
import { useEffect } from 'react';
import DRowSkeleton from 'pages-sections/admin/DOrderSkeleton';
import { pdpService } from 'api';

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

type PdpTrafficProps = {};

// =============================================================================

export default function PdpTraffic({}: PdpTrafficProps) {
  const {
    state: { fromDate, toDate, pdpReport },
  } = useAppContext();

  const [pdpTraffic, setPdpTraffic] = useState<PDPTrafficItem[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const getPdpTraffic = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
      try {
        const response = await pdpService.getPdpTraffics({
          fromDate: formatDatetime(fromDate.getTime(), 'yyyy-MM-dd'),
          toDate: formatDatetime(toDate.getTime(), 'yyyy-MM-dd'),
          type: 'PDP',
          page: pageNumber,
        });
        setLoading(false);
        if (response.statusCode === 0) {
          setPdpTraffic(response.data);
          setTotalPage(response.pageable.totalPages);
          setCurrentPage(pageNumber);
        }
      } catch (error) {
        setLoading(false);
      }
    },
    [toDate, fromDate]
  );

  useEffect(() => {
    getPdpTraffic(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  const { order, orderBy, selected, filteredList, handleRequestSort } = useMuiTable({
    listData: pdpTraffic,
  });

  return (
    <Box py={2}>
      <H1 my={2} textTransform="uppercase" textAlign={'center'}>
        Số lượng tiếp cận thông tin công ty
      </H1>

      <Paragraph fontStyle="italic" fontSize={14} mb={3} textAlign="center" color="grey.600">
        Dữ liệu sẽ được cập nhật chính xác trong vòng 72h tới
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
    </Box>
  );
}
