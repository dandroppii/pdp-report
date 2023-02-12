import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Card } from "@mui/material";
import { FlexBetween, FlexBox } from "components/flex-box";
import { H3, H6, Paragraph } from "components/Typography";
import React, { FC } from "react";
import { formatCurrency } from "utils/currency";

// ========================================================
type Card1Props = {
  color: string;
  title: string;
  traffic: number;
  price: number;
  status?: "up" | "down";
};
// ========================================================

const Card1: FC<Card1Props> = (props) => {
  const { title, traffic, price } = props;

  return (
    <Card sx={{ p: 2 }}>
      <FlexBetween alignItems={"flex-end"} mb={2}>
        <H6 color="grey.600">
          {title}
        </H6>
        <H3 color="info.main">{traffic}</H3>
      </FlexBetween>
      <FlexBetween alignItems={"flex-end"}>
        <H6 color="grey.600">
          Doanh thu
        </H6>
        <H3 color="info.main">{formatCurrency(price * traffic)}</H3>
      </FlexBetween>
    </Card>
  );
};

// set default props for status and color
Card1.defaultProps = { status: "up", color: "info.main" };

export default Card1;
