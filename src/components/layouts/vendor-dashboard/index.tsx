import { Box, styled } from '@mui/material';
import { FlexBetween } from 'components/flex-box';
import { Paragraph } from 'components/Typography';
import { useAppContext } from 'contexts/AppContext';
import { useAuthContext } from 'contexts/AuthContext';
import NavBarLoadingSkeleton from 'pages-sections/admin/NavBarLoadingSkeleton';
import DPageSkeleton from 'pages-sections/admin/PageLoadingSkeleton';
import RequirePdp from 'pages-sections/dashboard/\bRequirePdp';
import { Fragment, useState } from 'react';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

// styled components
const BodyWrapper = styled(Box)<{ compact: number }>(({ theme, compact }) => ({
  transition: 'margin-left 0.3s',
  marginLeft: compact ? '86px' : '280px',
  [theme.breakpoints.down('lg')]: { marginLeft: 0 },
  backgroundColor: 'theme.grey.100',
}));

const InnerWrapper = styled(Box)(({ theme }) => ({
  transition: 'all 0.3s',
  [theme.breakpoints.up('lg')]: { maxWidth: 1200, margin: 'auto' },
  [theme.breakpoints.down(1550)]: { paddingLeft: '2rem', paddingRight: '2rem' },
}));

const VendorDashboardLayout = ({ children, adminFeature = false }) => {
  const [sidebarCompact, setSidebarCompact] = useState(0);
  const [showMobileSideBar, setShowMobileSideBar] = useState(0);
  const { isLogin, isLoading, isAdmin } = useAuthContext();
  const {
    state: { selectedPdp },
  } = useAppContext();

  // handle sidebar toggle for desktop device
  const handleCompactToggle = () => setSidebarCompact(state => (state ? 0 : 1));
  // handle sidebar toggle in mobile device
  const handleMobileDrawerToggle = () => setShowMobileSideBar(state => (state ? 0 : 1));

  return isLoading ? (
    <Box style={{ flex: 1, height: '100%', padding: 50 }}>
      <FlexBetween>
        <Box width={200}>
          <NavBarLoadingSkeleton></NavBarLoadingSkeleton>
        </Box>
        <Box style={{ flex: 1 }}>
          <DPageSkeleton></DPageSkeleton>
        </Box>
      </FlexBetween>
    </Box>
  ) : (
    <Fragment>
      <DashboardSidebar
        sidebarCompact={sidebarCompact}
        showMobileSideBar={showMobileSideBar}
        setSidebarCompact={handleCompactToggle}
        setShowMobileSideBar={handleMobileDrawerToggle}
      />

      <BodyWrapper compact={sidebarCompact ? 1 : 0}>
        <DashboardNavbar handleDrawerToggle={handleMobileDrawerToggle} />
        <InnerWrapper>
          {!isAdmin || (isAdmin && (selectedPdp?.id || adminFeature)) ? children : <RequirePdp />}
        </InnerWrapper>
      </BodyWrapper>
    </Fragment>
  );
};

export default VendorDashboardLayout;
