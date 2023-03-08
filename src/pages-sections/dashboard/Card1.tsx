import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Card, Skeleton } from '@mui/material';
import { FlexBetween, FlexBox } from 'components/flex-box';
import { H3, H6, Paragraph, Span } from 'components/Typography';
import React, { FC } from 'react';
import { formatCurrency, getCurrencySuffix } from 'utils/currency';
import CountUp from 'react-countup';
import { useAppContext } from 'contexts/AppContext';

// ========================================================
type Card1Props = {
  color: string;
  title: string;
  traffic: number;
  price: number;
  status?: 'up' | 'down';
};
// ========================================================

const Card1: FC<Card1Props> = props => {
  const { title, traffic, price } = props;
  const {
    state: { pdpReportLoading, productReportLoading },
  } = useAppContext();

  return (
    <Card sx={{ p: 2 }}>
      <FlexBetween alignItems={'flex-end'} mb={2}>
        <H6 color="grey.600">{title}</H6>
        <FlexBox alignItems={'flex-end'}>
          <H3 color="info.main">
            {pdpReportLoading || productReportLoading ? (
              <Skeleton variant="text" sx={{ width: 100 }} />
            ) : (
              <CountUp end={traffic} duration={0.05} separator="." />
            )} lượt
          </H3>
        </FlexBox>
      </FlexBetween>
      <FlexBetween alignItems={'flex-end'}>
        <H6 color="grey.600">Phí dịch vụ (chưa VAT)</H6>
        <H3 color="info.main">
          {pdpReportLoading || productReportLoading ? (
            <Skeleton variant="text" sx={{ width: 100 }} />
          ) : (
            <CountUp
              end={price * traffic}
              duration={0.05}
              suffix={` ${getCurrencySuffix()}`}
              separator="."
            />
          )}
        </H3>
      </FlexBetween>
    </Card>
  );
};

// set default props for status and color
Card1.defaultProps = { status: 'up', color: 'info.main' };

export default Card1;
