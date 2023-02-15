import { Search } from "@mui/icons-material";
import { Box, Button, styled, TextField, Theme, useMediaQuery } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import InputBase from "@mui/material/InputBase";
import Toolbar from "@mui/material/Toolbar";
import { FlexBox, FlexRowCenter } from "components/flex-box";
import Toggle from "components/icons/Toggle";
import { useRouter } from "next/router";
import { FC } from "react";
import AccountPopover from "./popovers/AccountPopover";
import { DatePicker } from '@mui/x-date-pickers-pro';
import { Paragraph } from "components/Typography";


// custom styled components
const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  zIndex: 11,
  paddingTop: "1rem",
  paddingBottom: "1rem",
  backgroundColor: "#ffffff",
  boxShadow: theme.shadows[2],
  color: theme.palette.text.primary,
}));

const StyledToolBar = styled(Toolbar)(() => ({
  "@media (min-width: 0px)": {
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: "auto",
  },
}));

const ToggleWrapper = styled(FlexRowCenter)(({ theme }) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  cursor: "pointer",
  borderRadius: "8px",
  backgroundColor: theme.palette.grey[100],
}));

const CustomButton = styled(Button)(({ theme }) => ({
  minHeight: 40,
  flexShrink: 0,
  marginLeft: 16,
  padding: "0 20px",
  borderRadius: "8px",
  backgroundColor: theme.palette.grey[100],
  [theme.breakpoints.down("xs")]: { display: "none" },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: 200,
  padding: "5px 10px",
  borderRadius: "8px",
  color: theme.palette.grey[500],
  backgroundColor: theme.palette.grey[100],
  [theme.breakpoints.down("md")]: { display: "none" },
}));

// ===================================================================
type DashboardNavbarProps = {
  handleDrawerToggle: () => void;
};
// ===================================================================

const DashboardNavbar: FC<DashboardNavbarProps> = ({ handleDrawerToggle }) => {
  const router = useRouter();
  const downLg = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  return (
    <DashboardNavbarRoot position="sticky">
      <Container maxWidth="xl">
        <StyledToolBar disableGutters>
          {downLg && (
            <ToggleWrapper onClick={handleDrawerToggle}>
              <Toggle />
            </ToggleWrapper>
          )}

          <Box flexGrow={1} />

          <FlexBox alignItems="center" gap={2}>
          <Paragraph> Từ </Paragraph>
          <DatePicker 
              minDate={new Date('2021-03-01')}
              maxDate={new Date('2023-03-01')}
              value={new Date('2023-03-01')}
              onChange={() => { }}
              dayOfWeekFormatter={(day) => {
                console.log("🚀 ~ file: DashboardNavbar.tsx:152 ~ day", day)
                return day.toUpperCase()}}
              renderInput={(params) => <TextField {...params} helperText={null}
              />}
            ></DatePicker>
            <Paragraph> đến </Paragraph>

            <DatePicker 
              minDate={new Date('2021-03-01')}
              maxDate={new Date('2023-03-01')}
              value={new Date('2023-03-01')}
              onChange={() => { }}
              dayOfWeekFormatter={(day) => {
                console.log("🚀 ~ file: DashboardNavbar.tsx:152 ~ day", day)
                return day.toUpperCase()}}
              renderInput={(params) => <TextField {...params} helperText={null}
              />}
            ></DatePicker>
            <AccountPopover />
          </FlexBox>
        </StyledToolBar>
      </Container>
    </DashboardNavbarRoot>
  );
};
              

export default DashboardNavbar;
