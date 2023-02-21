import { Box, Card, Skeleton } from '@mui/material';
import { H3, H2, Paragraph, H6 } from 'components/Typography';
import NextImage from 'next/image';
import React, { useMemo } from 'react';
import { currencies, formatCurrency, getCurrencySuffix } from 'utils/currency';
import CountUp from 'react-countup';
import { useAppContext } from 'contexts/AppContext';
import { formatDatetime } from 'utils/datetime';
import { useAuthContext } from 'contexts/AuthContext';

const Revenue = () => {
  const {
    state: { pdpReport, fromDate, toDate, productReport, pdpReportLoading, productReportLoading },
  } = useAppContext();

  const report = useMemo(() => {
    return {
      revenue:
        pdpReport?.avgPricePerItem * pdpReport?.totalVisitInDuration +
        productReport?.avgPricePerItem * productReport?.totalVisitInDuration,
    };
  }, [pdpReport, productReport]);

  const { user } = useAuthContext();
  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <H2 color="info.main" mb={0.5}>
        Xin chào {user?.name}
      </H2>
      <Paragraph mb={2} color="grey.600">
        Đây là doanh thu từ {formatDatetime(new Date(fromDate).getTime(), 'dd/MM/yyyy')} đến{' '}
        {formatDatetime(new Date(toDate).getTime(), 'dd/MM/yyyy')}
      </Paragraph>

      <H6 color="grey.600">Tổng Phí dịch vụ (chưa VAT)</H6>

      <H3 mb={2} color="info.main">
        {pdpReportLoading || productReportLoading ? (
          <Skeleton variant="text" sx={{ width: '40%' }} />
        ) : (
          <CountUp
            end={report?.revenue || 0}
            duration={0.5}
            suffix={` ${getCurrencySuffix()}`}
            separator="."
          />
        )}
      </H3>
      <H6 color="grey.600">VAT</H6>
      <H3 mb={2} color="info.main">
        {pdpReportLoading || productReportLoading ? (
          <Skeleton variant="text" sx={{ width: '40%' }} />
        ) : (
          <CountUp
            end={report?.revenue * 0.1 || 0}
            duration={0.5}
            suffix={` ${getCurrencySuffix()}`}
            separator="."
          />
        )}
      </H3>
      <H6 color="grey.600">Tổng tiền thanh toán</H6>
      <H3 color="info.main">
        {pdpReportLoading || productReportLoading ? (
          <Skeleton variant="text" sx={{ width: '40%' }} />
        ) : (
          <CountUp
            end={report?.revenue * 0.9 || 0}
            duration={0.5}
            suffix={` ${getCurrencySuffix()}`}
            separator="."
          />
        )}
      </H3>

      <Box
        sx={{
          right: 24,
          bottom: 0,
          position: 'absolute',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <NextImage
          src="/assets/images/illustrations/dashboard/welcome.svg"
          width={195}
          height={171}
          alt="Welcome"
        />
      </Box>
    </Card>
  );
};

export default Revenue;
