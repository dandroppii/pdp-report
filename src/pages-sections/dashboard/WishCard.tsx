import { Box, Card } from "@mui/material";
import { H3, H2, Paragraph } from "components/Typography";
import NextImage from "next/image";
import React from "react";
import { formatCurrency } from "utils/currency";

const WishCard = () => {
  return (
    <Card
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <H2 color="info.main" mb={0.5}>
        Xin chào KUCHEN
      </H2>
      <Paragraph mb={3} color="grey.600">
         Đây là doanh thu tháng 3 năm 2023
      </Paragraph>

      <Paragraph color="grey.600">Tổng doanh thu</Paragraph>
      <H3 mb={3} color="info.main">{formatCurrency(2837700)}</H3>

      <Paragraph color="grey.600">Doanh thu sau VAT(8%)</Paragraph>
      <H3 mb={1.5} color="info.main">{formatCurrency(2837700)}</H3>

      <Box
        sx={{
          right: 24,
          bottom: 0,
          position: "absolute",
          display: { xs: "none", sm: "block" },
        }}
      >
        <NextImage
          src="/assets/images/illustrations/dashboard/welcome.svg"
          width={195}
          height={171}
          alt="Welcome"
        />
      </Box>
    </Card>
  );
};

export default WishCard;
