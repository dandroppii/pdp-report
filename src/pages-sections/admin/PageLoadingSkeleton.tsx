import { Card, CardHeader, Grid, Skeleton, Stack } from '@mui/material';
import { FC } from 'react';
import { StyledTableCell, StyledTableRow } from './StyledComponents';

const PageLoadingSkeleton: FC<any> = () => {
  return (
    <Stack
      spacing={1}
      direction="column"
      style={{
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 'none',
        padding: '0 40px',
      }}
    >
      <Stack
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <Skeleton variant="text" sx={{ width: '20%', height: 50 }} />
        <Skeleton variant="text" sx={{ width: '20%', height: 50 }} />
        <Skeleton variant="circular" sx={{ width: 50, height: 50 }} />
      </Stack>

      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <Skeleton variant="rounded" sx={{ width: '100%', height: 200 }} />
        </Grid>
        <Grid item md={6} xs={12}>
          <Skeleton variant="rounded" sx={{ width: '100%', height: 90, marginBottom: '20px' }} />
          <Skeleton variant="rounded" sx={{ width: '100%', height: 90 }} />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={3} xs={6}>
          <Skeleton variant="rounded" sx={{ width: '100%', height: 90, marginBottom: '20px' }} />
          <Skeleton variant="rounded" sx={{ width: '100%', height: 90 }} />
        </Grid>
        <Grid item md={3} xs={6}>
          <Skeleton variant="rounded" sx={{ width: '100%', height: 90, marginBottom: '20px' }} />
          <Skeleton variant="rounded" sx={{ width: '100%', height: 90 }} />
        </Grid>
        <Grid item md={3} xs={6}>
          <Skeleton variant="rounded" sx={{ width: '100%', height: 90, marginBottom: '20px' }} />
          <Skeleton variant="rounded" sx={{ width: '100%', height: 90 }} />
        </Grid>
        <Grid item md={3} xs={6}>
          <Skeleton variant="rounded" sx={{ width: '100%', height: 90, marginBottom: '20px' }} />
          <Skeleton variant="rounded" sx={{ width: '100%', height: 90 }} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default PageLoadingSkeleton;
