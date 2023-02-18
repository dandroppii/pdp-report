import { Box, Card, debounce, Grid, Stack, Table, TableContainer } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableHeader from 'components/data-table/TableHeader';
import TablePagination from 'components/data-table/TablePagination';
import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import Scrollbar from 'components/Scrollbar';
import { H1 } from 'components/Typography';
import useMuiTable from 'hooks/useMuiTable';
import { StyledTableCell, StyledTableRow } from 'pages-sections/admin';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import Card2 from 'pages-sections/dashboard/Card2';
import { formatDatetime } from 'utils/datetime';
import { GET_PRODUCT_TRAFFICS_RESPONSE } from 'constance/mockPdpData';
import { useAppContext } from 'contexts/AppContext';
import { ProductTrafficItem } from 'types/common';
import DRowSkeleton from 'pages-sections/admin/DOrderSkeleton';
import { ExternalLink } from 'components/layouts/vendor-dashboard/LayoutStyledComponents';

const tableHeading = [
  { id: 'no', label: 'No', align: 'left' },
  { id: 'productName', label: 'Sản phẩm', align: 'center' },
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
    state: { fromDate, toDate, pdpReport },
  } = useAppContext();

  const [pdpTraffic, setPdpTraffic] = useState<ProductTrafficItem[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const getProductTraffic = useCallback((pageNumber: number) => {
    setLoading(true);
    try {
      const response = GET_PRODUCT_TRAFFICS_RESPONSE;
      setLoading(false);
      if (response.statusCode === 0) {
        setPdpTraffic(response.data);
        setTotalPage(response.pageable.totalPages);
        setCurrentPage(pageNumber);
      }
    } catch (error) {
      setLoading(false);
    }
  }, []);

  const debounceChange = useCallback(debounce(getProductTraffic, 300), []);

  useEffect(() => {
    debounceChange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  const { order, orderBy, selected, filteredList, handleRequestSort } = useMuiTable({
    listData: pdpTraffic,
  });

  return (
    <Box py={4}>
      <H1 mb={4} textTransform="uppercase">
        Số lượng tiếp cận sản phẩm
      </H1>

      <Grid container spacing={3} mb={4}>
        <Grid item xl={4} lg={4} md={4} xs={12}>
          <Card2
            title="Lượt truy cập"
            amount={pdpReport?.collaboratorSummary?.product?.totalExpense}
          ></Card2>
        </Grid>
        <Grid item xl={4} lg={4} md={4} xs={12}>
          <Card2
            title="Đơn giá"
            amount={pdpReport?.collaboratorSummary?.product?.expensePerItem}
            currency
          ></Card2>
        </Grid>
        <Grid item xl={4} lg={4} md={4} xs={12}>
          <Card2
            title="Doanh thu"
            amount={
              pdpReport?.collaboratorSummary?.product?.expensePerItem *
              pdpReport?.collaboratorSummary?.product?.totalExpense
            }
            currency
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
                        {formatDatetime(item.startTime)}
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
