import { RemoveRedEye } from "@mui/icons-material";
import { Box, Card, Grid, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import Card1 from "pages-sections/dashboard/Card1";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import Scrollbar from "components/Scrollbar";
import { H1 } from "components/Typography";
import currency from "currency.js";
import useMuiTable from "hooks/useMuiTable";
import { GetStaticProps } from "next";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "pages-sections/admin";
import React, { ReactElement } from "react";
import api from "utils/api/dashboard";
import Card2 from "pages-sections/dashboard/Card2";
import { formatCurrency } from "utils/currency";
import { formatDatetime } from "utils/datetime";
import { ExternalLink } from "components/layouts/vendor-dashboard/LayoutStyledComponents";

const tableHeading = [
  { id: "no", label: "No", align: "left" },
  { id: "productName", label: "Sản phẩm", align: "left" },
  { id: "startTime", label: "Thời gian", align: "left" },
  { id: "userAgent", label: "Thiết bị", align: "left" },
];

// =============================================================================
ProductTraffic.getLayout = function getLayout(page: ReactElement) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

type ProductTrafficProps = { productTraffic: any[] };

// =============================================================================

export default function ProductTraffic({ productTraffic }: ProductTrafficProps) {
  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort,
  } = useMuiTable({ listData: productTraffic });

  return (
    <Box py={4}>
      <H1 mb={4} textTransform="uppercase">Số lượng tiếp cận thông tin sản phẩm</H1>


      <Grid container spacing={3} mb={4}>
        <Grid item xl={4} lg={4} md={4} xs={12}>
          <Card2 title="Lượt truy cập" amount={475}>
          </Card2>
        </Grid>
        <Grid item xl={4} lg={4} md={4} xs={12}>
          <Card2 title="Đơn giá" amount={3000} currency>
          </Card2>
        </Grid>
        <Grid item xl={4} lg={4} md={4} xs={12}>
          <Card2 title="Doanh thu" amount={3000000} currency>
          </Card2>
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
                rowCount={productTraffic.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {filteredList.map((item, index) => (
                  <StyledTableRow role="checkbox" key={index}>
                    <StyledTableCell align="left">{item.no}</StyledTableCell>
                    <StyledTableCell align="left">
                      <ExternalLink
                      color="blue.main"
                        href={item.productUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                        title={item.productName}
                      >{item.productName}</ExternalLink>
                      </StyledTableCell>
                    <StyledTableCell align="center">
                      {formatDatetime(item.startTime)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.userAgent}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination
            onChange={handleChangePage}
            count={Math.ceil(productTraffic.length / rowsPerPage)}
          />
        </Stack>
      </Card>
    </Box>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const productTraffic = await api.getProductTraffic();
  return { props: { productTraffic } };
};
