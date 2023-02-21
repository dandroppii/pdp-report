import { Skeleton } from '@mui/material';
import { FC } from 'react';
import { StyledTableCell, StyledTableRow } from './StyledComponents';

const DRowSkeleton: FC<{ numberOfCol: number }> = ({ numberOfCol }) => {
  const cols = new Array(numberOfCol).fill(1);
  const rows = new Array(15).fill(1);
  return (
    <>
      {rows.map((i, idx) => (
        <StyledTableRow sx={{ my: '1rem', padding: '6px 18px' }} key={`skeleton_${i}_${idx}`}>
          {cols.map((_item, idx) => (
            <StyledTableCell align="left" key={`row_${idx}`}>
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '100%' }} />
            </StyledTableCell>
          ))}
        </StyledTableRow>
      ))}
    </>
  );
};

export default DRowSkeleton;
