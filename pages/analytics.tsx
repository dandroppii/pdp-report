import { Box, Grid } from '@mui/material';
import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import React, { ReactElement, useMemo } from 'react';
import { formatDatetime } from 'utils/datetime';
import { useState } from 'react';
import { PdpReport } from 'types/common';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { format, lastDayOfMonth } from 'date-fns';
import Analytics from 'pages-sections/dashboard/Analytics';
import { pdpService } from 'api';
import { useAppContext } from 'contexts/AppContext';

AnalyticsPage.getLayout = function getLayout(page: ReactElement) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

type AnalyticsPageProps = {};

// =============================================================================

const getListTime = () => {
  const listMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const currentYear = new Date().getFullYear();
  const listTime = listMonth.map(time => ({
    fromDate: formatDatetime(new Date(`${time}/1/${currentYear}`).getTime(), 'yyyy-MM-dd'),
    toDate: format(lastDayOfMonth(new Date(`${time}/1/${currentYear}`).getTime()), 'yyyy-MM-dd'),
  }));

  return listTime;
};

export default function AnalyticsPage({}: AnalyticsPageProps) {
  const listTimeAnalytics = getListTime();
  const [pdpReport, setPdpReport] = useState<PdpReport[]>([]);
  const [productReport, setProductReport] = useState<PdpReport[]>([]);
  const {
    state: { selectedPdp },
  } = useAppContext();
  const currentYear = new Date().getFullYear();

  const pdpReportSeries = useMemo(() => {
    return [
      {
        name: 'Lượt tiếp cận',
        data: pdpReport.map(i => i.totalVisitInDuration),
      },
    ];
  }, [pdpReport]);

  const productReportSeries = useMemo(() => {
    return [
      {
        name: 'Lượt tiếp cận',
        data: productReport.map(i => i.totalVisitInDuration),
      },
    ];
  }, [productReport]);

  const revenue = useMemo(() => {
    return [
      {
        name: 'Phí dịch vụ tiếp cận thông tin công ty',
        data: pdpReport.map(i => i.revenueInDuration),
      },
      {
        name: 'Phí dịch vụ tiếp cận thông tin sản phẩm',
        data: productReport.map(i => i.revenueInDuration),
      },
    ];
  }, [productReport, pdpReport]);

  const getProductReport = useCallback(
    async (fromDate: string, toDate: string) => {
      try {
        const response = await pdpService.getPdpReport({
          fromDate,
          toDate,
          type: 'PRODUCT',
          supplierId: selectedPdp?.id,
        });
        return response.data || {};
      } catch (error) {
        return {};
      }
    },
    [selectedPdp?.id]
  );

  const getPdpReport = useCallback(
    async (fromDate: string, toDate: string) => {
      try {
        const response = await pdpService.getPdpReport({
          fromDate,
          toDate,
          type: 'PDP',
          supplierId: selectedPdp?.id,
        });
        return response.data || {};
      } catch (error) {
        return {};
      }
    },
    [selectedPdp?.id]
  );

  useEffect(() => {
    const obsProduct = listTimeAnalytics.map(({ fromDate, toDate }) =>
      getProductReport(fromDate, toDate)
    );

    const promiseProduct = Promise.all(obsProduct)
      .then((res: PdpReport[]) => {
        setProductReport(res);
      })
      .catch(() => {});

    const obsPdp = listTimeAnalytics.map(({ fromDate, toDate }) => getPdpReport(fromDate, toDate));
    Promise.all(obsPdp)
      .then((res: PdpReport[]) => {
        setPdpReport(res);
      })
      .catch(() => {});
    return () => {
      promiseProduct.finally();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box py={2}>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          sx={{
            '@media print': {
              'page-break-after': 'always',
              display: 'block',
            },
          }}
        >
          <Analytics
            title={`Số lượng tiếp cận thông tin công ty trong năm ${currentYear}`}
            series={pdpReportSeries}
            descriptions="* Đơn vị: lượt"
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            '@media print': {
              'page-break-after': 'always',
              display: 'block',
            },
          }}
        >
          <Analytics
            title={`Số lượng tiếp cận thông tin sản phẩm trong năm ${currentYear}`}
            series={productReportSeries}
            descriptions="* Đơn vị: lượt"
          />
        </Grid>

        <Grid item xs={12}>
          <Analytics
            title={`Phí dịch vụ trong năm ${currentYear}`}
            series={revenue}
            descriptions="* Đơn vị: đồng"
            isCurrency
            hideLabel
          />
        </Grid>
      </Grid>
    </Box>
  );
}
