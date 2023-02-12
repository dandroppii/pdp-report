import { ArrowDropUp } from "@mui/icons-material";
import { Box, Card } from "@mui/material";
import { FlexBox } from "components/flex-box";
import { H3, H6, Paragraph } from "components/Typography";
import React, { FC } from "react";

// =========================================================
type Card2Props = {
  title: string;
  percentage?: string;
  amount?: string | number;
};
// =========================================================

const Card2: FC<Card2Props> = ({ children, title, amount, percentage }) => {
  return (
    <Card
      sx={{
        p: 2,
        pr: 1,
        gap: 1,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box flexShrink={0} height="inherit">
        <FlexBox
          flexDirection="column"
          justifyContent="center"
          alignItems= "center"
          height="inherit"
          gap={1}
        >
          <H6 color="grey.600">{title}</H6>
          <Box>
            <H3 color="info.main">{amount}</H3>
          </Box>
        </FlexBox>
      </Box>

      <Box sx={{ "& > div": { minHeight: "0px !important" } }}>{children}</Box>
    </Card>
  );
};

export default Card2;
