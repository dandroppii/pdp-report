import {
  Box,
  Card,
  Dialog,
  Table,
  TableContainer,
  styled,
  Button,
  Autocomplete,
  TextField,
} from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableHeader from 'components/data-table/TableHeader';
import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import Scrollbar from 'components/Scrollbar';
import { H1 } from 'components/Typography';
import SearchInput from 'components/SearchInput';
import useMuiTable from 'hooks/useMuiTable';
import { StyledTableCell, StyledTableRow } from 'pages-sections/admin';
import React, { ReactElement, useMemo } from 'react';
import { useAppContext } from 'contexts/AppContext';
import { useState } from 'react';
import { ListPdpResponse } from 'types/common';
import { useCallback } from 'react';
import { useEffect } from 'react';
import DRowSkeleton from 'pages-sections/admin/DOrderSkeleton';
import { pdpService } from 'api';
import { useAuthContext } from 'contexts/AuthContext';
import { searchString } from 'utils/utils';
import { STATUS_CODE_SUCCESS } from 'utils/constants';
import { FlexBox } from 'components/flex-box';
import toast, { Toaster } from 'react-hot-toast';
import BazaarSwitch from 'components/BazaarSwitch';
import CreateMcoReportAccount from 'pages-sections/sessions/CreateMcoReportAccount';
import { useRouter } from 'next/router';
import ChangePassword from 'pages-sections/sessions/ChangePassword';
import DLoadingOverlay from 'components/DLoadingOverlay';

const tableHeading = [
  { id: 'id', label: 'ID', align: 'left', size: 'small' },
  { id: 'name', label: 'Tên đầy đủ', align: 'center' },
  { id: 'userName', label: 'Tên đăng nhập', align: 'center' },
  { id: 'phone', label: 'Số điện thoại', align: 'center' },
  { id: 'email', label: 'Email', align: 'center' },
  { id: 'status', label: 'Active', align: 'center' },
  { id: 'action', label: 'Thao tác', align: 'center' },
];

// =============================================================================
Management.getLayout = function getLayout(page: ReactElement) {
  return <VendorDashboardLayout adminFeature={true}>{page}</VendorDashboardLayout>;
};
// =============================================================================

export const ContentWrapper = styled(Box)(({ theme }) => ({
  textAlign: 'center',

  '& .carousel:hover': {
    cursor: 'pointer',
    '& .carousel__back-button': { opacity: 1, left: 10 },
    '& .carousel__next-button': { opacity: 1, right: 10 },
  },
  '& .carousel__next-button, & .carousel__back-button': {
    opacity: 0,
    boxShadow: 'none',
    transition: 'all 0.3s',
    background: 'transparent',
    color: theme.palette.primary.main,
    ':disabled': { color: theme.palette.grey[500] },
    ':hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
    },
  },
  '& .carousel__back-button': { left: 0 },
  '& .carousel__next-button': { right: 0 },
}));

type ManagementProps = {};

// =============================================================================

const statusList = [
  {
    status: 0,
    label: 'All',
  },
  {
    status: 1,
    label: 'Active',
  },
  {
    status: 2,
    label: 'Inactive',
  },
];

export default function Management({}: ManagementProps) {
  const {
    dispatch,
    state: { listPdpFull, listPdpLoading },
  } = useAppContext();
  const { isAdmin } = useAuthContext();
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    status: number;
    label: string;
  }>();
  const [pdpSelected, setPdpSelected] = useState<ListPdpResponse>();
  const [listPdp, setListPdp] = useState<ListPdpResponse[]>(listPdpFull);
  const listPdpCreatedAccountIds = useMemo(() => {
    return listPdpFull?.map(i => i.id);
  }, [listPdpFull]);

  const [listPdpNotYetCreateAccount, setListPdpNotYetCreateAccount] = useState<
    {
      name: string;
      id: string;
    }[]
  >([]);
  const [openDialogChangePassword, setOpenDialogChangePassword] = useState<boolean>(false);
  const [search, setSearch] = useState<string>();

  const { order, orderBy, selected, filteredList, handleRequestSort } = useMuiTable({
    listData: listPdp,
  });

  const getListPdpNotYetCreateAccount = useCallback(async () => {
    setPageLoading(true);
    try {
      const res = await pdpService.getListPdpNotYetCreateAccount(listPdpCreatedAccountIds);

      setPageLoading(false);
      if (res.statusCode === STATUS_CODE_SUCCESS) {
        const listPdp = res.data
          ?.map(i => ({
            name: i.fullName,
            id: i.id,
          }))
          .filter(i => i.name);
        setListPdpNotYetCreateAccount(listPdp);
      }
    } catch (error) {
      setPageLoading(false);
    }
  }, [listPdpCreatedAccountIds]);

  const handleAddNewPdp = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const handleChangePdpStatus = useCallback(
    async (item, status) => {
      setPageLoading(true);
      try {
        const res = await pdpService.changePdpStatus({
          id: item.id,
          status: status,
        });

        setPageLoading(false);
        if (res.statusCode === STATUS_CODE_SUCCESS) {
          const newListPdpFull = listPdpFull.map(pdp => ({
            ...pdp,
            status: pdp.id === item.id ? status : pdp.status,
          }));
          dispatch({ type: 'SET_LIST_PDP_FULL', payload: newListPdpFull });
          toast.success('Thay đổi trạng thái thành công');
        } else {
          toast.error('Thay đổi trạng thái thất bại. Vui lòng thử lại sau');
        }
      } catch (error) {
        setPageLoading(false);
        toast.error('Thay đổi trạng thái thất bại. Vui lòng thử lại sau');
      }
    },
    [listPdpFull, dispatch]
  );

  const handleChangePdpPassword = useCallback((pdp: ListPdpResponse) => {
    setOpenDialogChangePassword(true);
    setPdpSelected(pdp);
  }, []);

  const handleFilterSearch = useCallback(() => {
    const searchPdp = search ? searchString(listPdpFull, search, 'fullName') : listPdpFull;
    const filterPdp = status?.status
      ? searchPdp.filter(p => p.status === status.status)
      : searchPdp;
    setListPdp(filterPdp);
    console.log('🚀 ~ file: management.tsx:204 ~ handleFilterSearch ~ filterPdp:', filterPdp);
  }, [listPdpFull, search, status]);

  const handleFilterStatus = useCallback(
    s => {
      setStatus(s);
      handleFilterSearch();
    },
    [handleFilterSearch]
  );

  const handleSearch = useCallback(
    s => {
      setSearch(s);
      handleFilterSearch();
    },
    [handleFilterSearch]
  );

  useEffect(() => {
    !isAdmin && router?.isReady && router.push('/');
  }, [isAdmin, router]);

  useEffect(() => {
    setListPdp(listPdpFull);
    handleFilterSearch();
  }, [listPdpFull, handleFilterSearch]);

  useEffect(() => {
    getListPdpNotYetCreateAccount();
  }, [getListPdpNotYetCreateAccount]);

  return (
    <Box py={2} sx={{ position: 'relative' }}>
      <DLoadingOverlay loading={pageLoading} />
      <H1 my={2} textTransform="uppercase" textAlign={'center'} color="grey.900">
        Quản lý nhà cung cấp
      </H1>

      <Card>
        <FlexBox justifyContent={'flex-end'} m={1}>
          <Box mr={2}>
            <SearchInput
              placeholder="Nhập tên nhà cung cấp"
              value={search}
              onChange={e => {
                handleSearch(e?.target?.value);
              }}
            />
          </Box>
          <Box mr={2}>
            <Autocomplete
              size="medium"
              sx={{
                width: 200,
                '.MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
                  paddingBottom: '10px',
                  paddingTop: '10px',
                },
                label: {
                  top: '3px',
                },
              }}
              options={statusList}
              value={status}
              getOptionLabel={(option: any) => option.label}
              onChange={(_, value) => {
                handleFilterStatus(value);
              }}
              renderInput={params => (
                <TextField label="Chọn trạng thái" {...params} helperText={null} />
              )}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNewPdp}
            disabled={listPdpLoading || !listPdpNotYetCreateAccount?.length}
          >
            Tạo tài khoản
          </Button>
        </FlexBox>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 1100 }}>
            <Table>
              <TableHeader
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                rowCount={listPdpFull.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {listPdpLoading ? (
                  <DRowSkeleton numberOfCol={7}></DRowSkeleton>
                ) : (
                  filteredList.map((item, index) => (
                    <StyledTableRow role="checkbox" key={index}>
                      <StyledTableCell align="left">{index + 1}</StyledTableCell>
                      <StyledTableCell align="center">{item.fullName}</StyledTableCell>
                      <StyledTableCell align="center">{item.userDetail?.username}</StyledTableCell>
                      <StyledTableCell align="center">{item.phone}</StyledTableCell>
                      <StyledTableCell align="center">{item.email}</StyledTableCell>
                      <StyledTableCell align="center">
                        <BazaarSwitch
                          color="info"
                          checked={item.status === 1}
                          onChange={e => {
                            const newStatus = item.status === 1 ? 2 : 1;
                            handleChangePdpStatus(item, newStatus);
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ width: 150 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleChangePdpPassword(item)}
                        >
                          Đổi mật khẩu
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>

      <Dialog open={openDialog} maxWidth={false} sx={{ zIndex: 100 }}>
        <CreateMcoReportAccount
          listPdp={listPdpNotYetCreateAccount}
          onSuccess={() => {
            setOpenDialog(false);
          }}
          onClose={() => {
            setOpenDialog(false);
          }}
        />
      </Dialog>
      <Dialog open={openDialogChangePassword} maxWidth={false} sx={{ zIndex: 100 }}>
        <ChangePassword
          pdp={pdpSelected}
          onSuccess={() => {
            setOpenDialogChangePassword(false);
          }}
          onClose={() => {
            setOpenDialogChangePassword(false);
          }}
        />
      </Dialog>
      <Toaster toastOptions={{ duration: 4000 }} />
    </Box>
  );
}
