import { Autocomplete, Box, styled, TextField, Theme, useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { FlexBox, FlexRowCenter } from 'components/flex-box';
import Toggle from 'components/icons/Toggle';
import { FC, useCallback } from 'react';
import AccountPopover from './popovers/AccountPopover';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { Paragraph } from 'components/Typography';
import { useAppContext } from 'contexts/AppContext';
import { ListPdp } from 'types/common';
import { useAuthContext } from 'contexts/AuthContext';

// custom styled components
const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  zIndex: 11,
  paddingTop: '1rem',
  paddingBottom: '1rem',
  backgroundColor: '#ffffff',
  boxShadow: theme.shadows[2],
  color: theme.palette.text.primary,
  '@media print': {
    display: 'none',
  },
}));

const StyledToolBar = styled(Toolbar)(() => ({
  '@media (min-width: 0px)': {
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: 'auto',
  },
}));

const ToggleWrapper = styled(FlexRowCenter)(({ theme }) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  cursor: 'pointer',
  borderRadius: '8px',
  backgroundColor: theme.palette.grey[100],
}));

// ===================================================================
type DashboardNavbarProps = {
  handleDrawerToggle: () => void;
};
``;
// ===================================================================

const DashboardNavbar: FC<DashboardNavbarProps> = ({ handleDrawerToggle }) => {
  const {
    state: {
      fromDate,
      toDate,
      pdpReportLoading,
      productReportLoading,
      listPdp,
      selectedPdp,
      listPdpLoading,
    },
    dispatch,
  } = useAppContext();

  const { isAdmin } = useAuthContext();
  const downLg = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const handeChangePdp = useCallback(
    (pdp: ListPdp) => {
      dispatch({ type: 'SET_SELECTED_PDP', payload: pdp });
    },
    [dispatch]
  );

  const handeChangeFromDate = useCallback(
    (date: Date) => {
      dispatch({ type: 'SET_FROM_DATE', payload: date });
    },
    [dispatch]
  );

  const handeChangeToDate = useCallback(
    (date: Date) => {
      dispatch({ type: 'SET_TO_DATE', payload: date });
    },
    [dispatch]
  );

  return (
    <DashboardNavbarRoot position="sticky">
      <Container maxWidth="xl">
        <StyledToolBar disableGutters>
          {downLg && (
            <ToggleWrapper onClick={handleDrawerToggle}>
              <Toggle />
            </ToggleWrapper>
          )}

          <FlexBox alignItems="center" flex={1} gap={2} justifyContent="flex-end">
            {isAdmin ? (
              <Autocomplete
                disabled={pdpReportLoading || productReportLoading || listPdpLoading}
                fullWidth
                sx={{ maxWidth: 300 }}
                options={listPdp}
                value={selectedPdp}
                getOptionLabel={(option: ListPdp) => option.name}
                onChange={(_, value: ListPdp) => {
                  handeChangePdp(value);
                }}
                renderInput={params => (
                  <TextField label="Chọn nhà cung cấp" {...params} helperText={null} />
                )}
              />
            ) : (
              <></>
            )}

            <Box sx={{ minWidth: 200 }}>
              <DatePicker
                // minDate={new Date('2021-03-01')}
                label="Từ ngày"
                disabled={pdpReportLoading || productReportLoading}
                maxDate={toDate}
                value={fromDate}
                onChange={handeChangeFromDate}
                dayOfWeekFormatter={day => {
                  return day.toUpperCase();
                }}
                renderInput={params => <TextField {...params} helperText={null} />}
              ></DatePicker>
            </Box>
            <Box sx={{ minWidth: 200 }}>
              <DatePicker
                label="đến ngày"
                disabled={pdpReportLoading || productReportLoading}
                minDate={fromDate}
                maxDate={new Date()}
                value={toDate}
                onChange={handeChangeToDate}
                dayOfWeekFormatter={day => {
                  return day.toUpperCase();
                }}
                renderInput={params => <TextField {...params} helperText={null} />}
              ></DatePicker>
            </Box>
            <AccountPopover />
          </FlexBox>
        </StyledToolBar>
      </Container>
    </DashboardNavbarRoot>
  );
};

export default DashboardNavbar;
