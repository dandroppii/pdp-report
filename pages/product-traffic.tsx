import { Box, Card, debounce, Grid, Stack, Table, TableContainer } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableHeader from 'components/data-table/TableHeader';
import TablePagination from 'components/data-table/TablePagination';
import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import Scrollbar from 'components/Scrollbar';
import { H1, Paragraph } from 'components/Typography';
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

  const [productTraffic, setProductTraffic] = useState<TrafficItem[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

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
        }
      } catch (error) {
        setLoading(false);
      }
    },
    [toDate, fromDate]
  );

  const debounceChange = useCallback(debounce(getProductTraffic, 300), []);

  useEffect(() => {
    debounceChange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  const { order, orderBy, selected, filteredList, handleRequestSort } = useMuiTable({
    listData: productTraffic,
  });

  return (
    <Box py={2}>
      <H1 my={2} textTransform="uppercase" textAlign={'center'}>
        Số lượng tiếp cận sản phẩm
      </H1>

      <Paragraph fontStyle="italic" fontSize={14} mb={3} textAlign="center" color="grey.600">
        Dữ liệu sẽ được cập nhật chính xác trong vòng 72h tới
      </Paragraph>

      <Grid container spacing={3} mb={4}>
        <Grid item xl={4} lg={4} md={4} xs={12}>
          <Card2
            title="Lượt truy cập"
            amount={productReport?.totalVisitInDuration}
            loading={loading}
          ></Card2>
        </Grid>
        <Grid item xl={4} lg={4} md={4} xs={12}>
          <Card2
            title="Đơn giá trung bình"
            amount={productReport?.avgPricePerItem}
            currency
            loading={loading}
          ></Card2>
        </Grid>
        <Grid item xl={4} lg={4} md={4} xs={12}>
          <Card2
            title="Doanh thu chưa VAT"
            amount={productReport?.totalVisitInDuration * productReport?.avgPricePerItem}
            currency
            loading={loading}
          ></Card2>
        </Grid>
      </Grid>

      <Card>
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
            onChange={(_e, page) => {
              debounceChange(page);
            }}
            count={totalPage}
            page={currentPage}
          />
        </Stack>
      </Card>
    </Box>
  );
}
