import { Card, Select, styled, useTheme } from '@mui/material';
import { FlexBetween } from 'components/flex-box';
import { H2, Paragraph } from 'components/Typography';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { analyticsChartOptions } from './chartsOptions';

// apext chart instance
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const categories = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

// styled component
const StyledSelect = styled(Select)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  color: theme.palette.grey[600],
  '& fieldset': { border: '0 !important' },
  '& .MuiSelect-select': { padding: 0, paddingRight: '8px !important' },
}));

const Analytics = ({
  title,
  series,
  descriptions,
  isCurrency,
  hideLabel,
}: {
  title: string;
  series: {
    name: string;
    data: number[];
  }[];
  descriptions: string;
  isCurrency?: boolean;
  hideLabel?: boolean;
}) => {
  const theme = useTheme();
  const maxValue = useMemo(() => {
    const values = [];
    series.forEach(s => {
      values.push(...s.data);
    });
    const max = Math.max(...values);
    const length = `${Math.ceil(max)}`.length;
    const div = +`1${new Array(length - 1 || 1).fill(0).join('')}`;
    return Math.ceil(max / div) * div;
  }, [series]);

  return (
    <Card
      sx={{
        p: 3,
      }}
    >
      <FlexBetween>
        <H2>{title}</H2>
      </FlexBetween>
      <Paragraph color="grey.600" fontStyle={'italic'}>
        * Dữ liệu sẽ được cập nhật chính xác vào cuối tháng
      </Paragraph>
      <Paragraph color="grey.600" fontStyle={'italic'}>
        {descriptions}
      </Paragraph>

      <ReactApexChart
        type="bar"
        width={1000}
        height={300}
        series={series}
        options={analyticsChartOptions(theme, categories, maxValue, isCurrency, hideLabel)}
      />
    </Card>
  );
};

export default Analytics;
