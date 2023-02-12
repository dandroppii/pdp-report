import { Box, Grid } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { GetStaticProps } from "next";
import Card1 from "pages-sections/dashboard/Card1";
import WishCard from "pages-sections/dashboard/WishCard";
import { ReactElement } from "react";
import api from "utils/api/dashboard";

// =============================================================================
VendorDashboard.getLayout = function getLayout(page: ReactElement) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

type DashboardProps = {
  cardList: any[];
};

// =============================================================================

export default function VendorDashboard(props: DashboardProps) {
  const cardList = [
    {
      id: 1,
      title: "Traffic công ty tháng 3",
      traffic: 475,
      price: 3000,
      color: "info.main",
      status: ""
    },
    {
      id: 2,
      title: "Traffic sản phẩm tháng 3",
      traffic: 475,
      price: 3000,
      color: "info.main",
      status: ""
    },
  ]

  return (
    <Box py={4}>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <WishCard />
        </Grid>

        <Grid container item md={6} xs={12} spacing={3}>
          {cardList.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Card1
                title={item.title}
                color={item.color}
                price={item.price}
                traffic={item.traffic}
                status={item.status === "down" ? "down" : "up"}
              />
            </Grid>
          ))}
        </Grid>

        
      </Grid>
    </Box>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const cardList = await api.getAllCard();

  return { props: { cardList} };
};
