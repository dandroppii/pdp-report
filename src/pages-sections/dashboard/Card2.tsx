import { ArrowDropUp } from '@mui/icons-material';
import { Box, Card, Skeleton } from '@mui/material';
import { FlexBox } from 'components/flex-box';
import { H3, H6, Paragraph } from 'components/Typography';
import React, { FC } from 'react';
import CountUp from 'react-countup';
import { getCurrencySuffix } from 'utils/currency';
// =========================================================
type Card2Props = {
  title: string;
  percentage?: string;
  amount?: number;
  currency?: boolean;
  loading?: boolean;
};
// =========================================================

const Card2: FC<Card2Props> = ({ children, title, amount, currency, loading }) => {
  return (
    <Card
      sx={{
        p: 2,
        pr: 1,
        gap: 1,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box flexShrink={0} height="inherit">
        <FlexBox
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="inherit"
          gap={1}
        >
          <H6 color="grey.600">{title}</H6>
          <Box>
            <H3 color="info.main">
              {loading ? (
                <Skeleton variant="text" sx={{ width: 100 }} />
              ) : (
                <CountUp
                  end={amount}
                  duration={0.5}
                  suffix={` ${currency ? getCurrencySuffix() : ''}`}
                  separator="."
                />
              )}
            </H3>
          </Box>
        </FlexBox>
      </Box>

      <Box sx={{ '& > div': { minHeight: '0px !important' } }}>{children}</Box>
    </Card>
  );
};

export default Card2;
