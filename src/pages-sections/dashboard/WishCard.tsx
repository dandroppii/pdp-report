import { Box, Card } from "@mui/material";
import { H3, H2, Paragraph } from "components/Typography";
import NextImage from "next/image";
import React from "react";
import { currencies, formatCurrency, getCurrencySuffix } from "utils/currency";
import CountUp from 'react-countup';
import { useAppContext } from "contexts/AppContext";
import { formatDatetime } from "utils/datetime";


const WishCard = () => {
  const { state: { pdpInformations, pdpReport, fromDate, toDate } } = useAppContext()
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
        Xin chào {pdpInformations.name}
      </H2>
      <Paragraph mb={2} color="grey.600">
        Đây là doanh thu từ {formatDatetime(fromDate, 'dd/MM/yyyy')} đến  {formatDatetime(toDate, 'dd/MM/yyyy')}
      </Paragraph>

      <Paragraph color="grey.600">Tổng doanh thu</Paragraph>
      <H3 mb={2} color="info.main">
        <CountUp end={pdpReport?.collaboratorSummary?.revenue} duration={0.5} suffix={` ${getCurrencySuffix()}`} separator="." />
      </H3>

      <Paragraph color="grey.600">Doanh thu sau VAT({8}%)</Paragraph>
      <H3 color="info.main"><CountUp end={pdpReport?.collaboratorSummary?.revenue * 0.92} duration={0.5} suffix={` ${getCurrencySuffix()}`} separator="." /></H3>

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
