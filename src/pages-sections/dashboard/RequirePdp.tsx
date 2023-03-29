import { Card } from '@mui/material';
import { H3 } from 'components/Typography';
import NextImage from 'next/image';
import React from 'react';

const RequirePdp = () => {
  return (
    <Card
      sx={{
        my: 5,
        p: 3,
        height: '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <NextImage
        src="/assets/images/illustrations/dashboard/welcome.svg"
        width={195}
        height={171}
        alt="Welcome"
      />
      <H3  mt={2} textAlign="center">
        Vui lòng chọn nhà cung cấp để xem thông tin
      </H3>
    </Card>
  );
};

export default RequirePdp;
