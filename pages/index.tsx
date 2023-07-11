import { Box, CircularProgress, Grid } from '@mui/material';
import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import { Paragraph } from 'components/Typography';
import { useAppContext } from 'contexts/AppContext';
import { useAuthContext } from 'contexts/AuthContext';
import { sumBy } from 'lodash';
import DPageSkeleton from 'pages-sections/admin/PageLoadingSkeleton';
import Card1 from 'pages-sections/dashboard/Card1';
import CompanyCard from 'pages-sections/dashboard/CompanyCard';
import Revenue from 'pages-sections/dashboard/Revenue';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { ReactElement } from 'react';

// =============================================================================
VendorDashboard.getLayout = function getLayout(page: ReactElement) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

type DashboardProps = {
  cardList: any[];
};

// =============================================================================

export default function VendorDashboard() {
  const {
    state: { pdpReport, productReport, pdpReportLoading, productReportLoading, pdpProfileLoading },
  } = useAppContext();

  const isLoading = useMemo(
    () => pdpReportLoading || productReportLoading || pdpProfileLoading,
    [pdpReportLoading, productReportLoading, pdpProfileLoading]
  );

  const cardList = useMemo(() => {
    const pdpSummaryItems = pdpReport.mcoSummaryItems || [];
    const productSummaryItems = productReport.mcoSummaryItems || [];
    const pdpAmount = sumBy(pdpSummaryItems, i => i.quantity * i.priceAverage);
    const productAmount = sumBy(productSummaryItems, i => i.quantity * i.priceAverage);
    return [
      {
        id: 1,
        title: 'Số lượng tiếp cận thông tin công ty',
        traffic: pdpReport?.totalVisitInDuration,
        amount: pdpAmount,
        color: 'info.main',
        status: '',
      },
      {
        id: 2,
        title: 'Số lượng tiếp cận thông tin sản phẩm',
        traffic: productReport?.totalVisitInDuration,
        amount: productAmount,
        color: 'info.main',
        status: '',
      },
    ];
  }, [pdpReport, productReport]);

  return (
    <Box py={2}>
      <Paragraph fontStyle="italic" fontSize={14} mb={2} textAlign="center" color="grey.600">
        {isLoading ? (
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
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <Revenue />
        </Grid>

        <Grid container item md={6} xs={12} spacing={2}>
          {cardList.map(item => (
            <Grid item xs={12} key={item.id}>
              <Card1
                title={item.title}
                color={item.color}
                amount={item.amount}
                traffic={item.traffic}
                status={item.status === 'down' ? 'down' : 'up'}
              />
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12}>
          <CompanyCard />
        </Grid>
      </Grid>
    </Box>
  );
}
