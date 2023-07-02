import { Avatar, Box, Dialog, IconButton, Menu, MenuItem, styled } from '@mui/material';
import { H6, Small } from 'components/Typography';
import { useAppContext } from 'contexts/AppContext';
import { useAuthContext } from 'contexts/AuthContext';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import PdpChangePassword from './ChangePasswordPopover';

// styled components
const Divider = styled(Box)(({ theme }) => ({
  margin: '0.5rem 0',
  border: `1px dashed ${theme.palette.grey[200]}`,
}));

const AccountPopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { logout, user } = useAuthContext();
  const handleClose = () => setAnchorEl(null);
  const handleClick = event => setAnchorEl(event.currentTarget);
  const [openDialogChangePassword, setOpenDialogChangePassword] = useState<boolean>(false);

  const handleOpenDialog = useCallback(() => {
    setOpenDialogChangePassword(true);
  }, []);

  return (
    <Box>
      <IconButton
        sx={{ padding: 0 }}
        aria-haspopup="true"
        onClick={handleClick}
        aria-expanded={open ? 'true' : undefined}
        aria-controls={open ? 'account-menu' : undefined}
      >
        <Avatar alt={user?.fullName} src="/assets/images/pdp_logo.png" />
      </IconButton>

      <Menu
        open={open}
        id="account-menu"
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            boxShadow: 2,
            minWidth: 200,
            borderRadius: '8px',
            overflow: 'visible',
            border: '1px solid',
            borderColor: 'grey.200',
            '& .MuiMenuItem-root:hover': {
              backgroundColor: 'grey.200',
            },
            '&:before': {
              top: 0,
              right: 14,
              zIndex: 0,
              width: 10,
              height: 10,
              content: '""',
              display: 'block',
              position: 'absolute',
              borderTop: '1px solid',
              borderLeft: '1px solid',
              borderColor: 'grey.200',
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box px={2} pt={1}>
          <H6>{user?.name}</H6>
          <Small color="grey.500">{user?.email}</Small>
        </Box>
        <Divider />
        <MenuItem onClick={handleOpenDialog}>Đổi mật khẩu</MenuItem>
        <Divider />
        <MenuItem onClick={logout}>Đăng xuất</MenuItem>
      </Menu>
      <Dialog open={openDialogChangePassword} maxWidth={false} sx={{ zIndex: 100 }}>
        <PdpChangePassword
          onSuccess={() => {
            setOpenDialogChangePassword(false);
            toast.success('Đổi mật khẩu thành công');
          }}
          onClose={() => {
            setOpenDialogChangePassword(false);
          }}
        />
      </Dialog>
    </Box>
  );
};

export default AccountPopover;
