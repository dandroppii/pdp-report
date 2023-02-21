import { Card, Grid, Skeleton } from '@mui/material';
import { H2, Paragraph, H5 } from 'components/Typography';
import React from 'react';
import { useMemo } from 'react';
import { useAuthContext } from 'contexts/AuthContext';

const CompanyCard = () => {
  const { user, isPdpLoading } = useAuthContext();

  const info = useMemo(() => {
    return [
      {
        title: 'Tên công ty',
        value: user?.fullName,
      },
      {
        title: 'Email liên hệ',
        value: user?.email,
      },
      {
        title: 'Số điện thoại liên hệ',
        value: user?.phone,
      },
      {
        title: 'Địa chỉ',
        value: user?.address,
      },
    ];
  }, [user]);
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
            <H5 color="grey.600" fontWeight={500}>
              {isPdpLoading ? <Skeleton variant="text" sx={{ width: 100 }} /> : item.value}
            </H5>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default CompanyCard;
