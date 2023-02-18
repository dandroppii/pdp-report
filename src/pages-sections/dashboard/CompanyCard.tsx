import { Box, Card, Grid } from '@mui/material';
import { H3, H2, Paragraph, H4 } from 'components/Typography';
import NextImage from 'next/image';
import React from 'react';
import { currencies, formatCurrency, getCurrencySuffix } from 'utils/currency';
import CountUp from 'react-countup';
import { useAppContext } from 'contexts/AppContext';
import { formatDatetime } from 'utils/datetime';
import { useMemo } from 'react';

const CompanyCard = () => {
  const {
    state: { pdpInformations, pdpReport, fromDate, toDate },
  } = useAppContext();

  const info = useMemo(() => {
    return [
      {
        title: 'Tên công ty',
        value: pdpInformations?.fullName,
      },
      {
        title: 'Email',
        value: pdpInformations?.email,
      },
      {
        title: 'Số điện thoại',
        value: pdpInformations?.phone,
      },
      {
        title: 'Địa chỉ',
        value: pdpInformations?.address,
      },
    ];
  }, [pdpInformations]);
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
      <H2 color="info.main" mb={3}>
        THÔNG TIN CÔNG TY
      </H2>

      <Grid container spacing={2}>
        {info?.map((item, index) => (
          <Grid item md={6} xs={12} key={index}>
            <Paragraph color="grey.600">{item.title}</Paragraph>
            <H4 fontWeight={500}>{item.value}</H4>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default CompanyCard;
