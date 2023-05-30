import { Pagination, PaginationProps, Stack, styled, Typography } from '@mui/material';

export const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    fontSize: 14,
    fontWeight: 500,
    color: theme.palette.grey[900],
    border: `1px solid transparent`,
  },
  '& .MuiPaginationItem-page:hover': {
    borderRadius: 20,
    backgroundColor: 'transparent',
    color: theme.palette.info.main,
    border: `1px solid ${theme.palette.info.main}`,
  },
  '& .MuiPaginationItem-page.Mui-selected': {
    borderRadius: 20,
    backgroundColor: 'transparent',
    color: theme.palette.info.main,
    border: `1px solid ${theme.palette.info.main}`,
    ':hover': { backgroundColor: 'transparent' },
  },
  '& .MuiPaginationItem-previousNext': {
    margin: 10,
    borderRadius: 20,
    color: theme.palette.info.main,
    border: `1px solid ${theme.palette.info.main}`,
    '&:hover': { backgroundColor: 'transparent' },
  },
}));

interface SizeProps {
  size: number;
  total: number;
  onSizeChanged: (size: number) => void;
}

const TablePaginationWithNumberOfShow = (props: {
  sizeProps: SizeProps;
  pagingProps: PaginationProps;
}) => (
  <Stack alignItems="space-between" my={4}>
    <Typography variant="body1">
      Hiển thị {(props.pagingProps.page - 1) * props.sizeProps.size + 1} -{' '}
      {props.pagingProps.page * props.sizeProps.size} trên ${props.sizeProps.total}
    </Typography>
    <StyledPagination {...props.pagingProps} />
  </Stack>
);

export default TablePaginationWithNumberOfShow;
