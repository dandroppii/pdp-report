import { Card, Grid, Skeleton } from '@mui/material';
import { H2, Paragraph, H5, H6 } from 'components/Typography';
import React from 'react';
import { useMemo } from 'react';
import { useAuthContext } from 'contexts/AuthContext';
import { useAppContext } from 'contexts/AppContext';

const CompanyCard = () => {
  const {
    state: { pdpProfileLoading, pdpProfile },
  } = useAppContext();
  const { user, isPdpLoading, isAdmin } = useAuthContext();

  const profile = useMemo(() => (isAdmin ? pdpProfile : user), [pdpProfile, isAdmin, user]);
  const isLoading = useMemo(
    () => pdpProfileLoading || isPdpLoading,
    [isPdpLoading, pdpProfileLoading]
  );

  const info = useMemo(() => {
    return [
      {
        title: 'Tên công ty',
        value: profile?.fullName,
      },
      {
        title: 'Email liên hệ',
        value: profile?.email,
      },
      {
        title: 'Số điện thoại liên hệ',
        value: profile?.phone,
      },
      {
        title: 'Địa chỉ',
        value: profile?.address,
      },
    ];
  }, [profile]);
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
            <H6 color="grey.600">{item.title}</H6>
            <H5 color="grey.600" fontWeight={500}>
              {isLoading ? <Skeleton variant="text" sx={{ width: 100 }} /> : item.value}
            </H5>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default CompanyCard;
