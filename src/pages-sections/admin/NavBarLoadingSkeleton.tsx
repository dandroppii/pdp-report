import { Skeleton, Stack } from '@mui/material';
import { FC } from 'react';
import { StyledTableCell, StyledTableRow } from './StyledComponents';

const NavBarLoadingSkeleton: FC<any> = () => {
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
      }}
    >
      <Skeleton variant="text" sx={{ fontSize: 'rem', width: '100%', height: 50 }} />
      <Skeleton variant="text" sx={{ fontSize: 'rem', width: '100%', height: 50 }} />
      <Skeleton variant="text" sx={{ fontSize: 'rem', width: '100%', height: 50 }} />
      <Skeleton variant="text" sx={{ fontSize: 'rem', width: '100%', height: 50 }} />
      <Skeleton variant="text" sx={{ fontSize: 'rem', width: '100%', height: 50 }} />
      <Skeleton variant="text" sx={{ fontSize: 'rem', width: '100%', height: 50 }} />
      <Skeleton variant="text" sx={{ fontSize: 'rem', width: '100%', height: 50 }} />
      <Skeleton variant="text" sx={{ fontSize: 'rem', width: '100%', height: 50 }} />
    </Stack>
  );
};

export default NavBarLoadingSkeleton;
