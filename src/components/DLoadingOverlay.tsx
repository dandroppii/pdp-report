import { Box, styled } from '@mui/material';

import { FC } from 'react';

const StyledLoading = styled('div')(({ theme }) => ({
  transform: 'scale(0.5)',
  '@keyframes square-animation': {
    '0%': {
      left: '0',
      top: '0',
    },

    '10.5%': {
      left: '0',
      top: '0',
    },

    '12.5%': {
      left: '16px',
      top: '0',
    },

    '23%': {
      left: '16px',
      top: '0',
    },

    '25%': {
      left: '32px',
      top: '0',
    },

    '35.5%': {
      left: '32px',
      top: '0',
    },

    '37.5%': {
      left: '32px',
      top: '16px',
    },

    '48%': {
      left: '32px',
      top: '16px',
    },

    '50%': {
      left: '16px',
      top: '16px',
    },

    '60.5%': {
      left: '16px',
      top: '16px',
    },

    '62.5%': {
      left: '16px',
      top: '32px',
    },

    '73%': {
      left: '16px',
      top: '32px',
    },

    '75%': {
      left: '0',
      top: '32px',
    },

    '85.5%': {
      left: '0',
      top: '32px',
    },

    '87.5%': {
      left: '0',
      top: '16px',
    },

    '98%': {
      left: '0',
      top: '16px',
    },

    '100%': {
      left: '0',
      top: '0',
    },
  },
  '.loader': {
    position: 'relative',
    width: '48px',
    height: '48px',
    transform: 'rotate(45deg)',
  },

  '.loader-square': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '14px',
    height: '14px',
    margin: '2px',
    'border-radius': 0,
    background: theme.palette.primary.main,
    'background-size': 'cover',
    'background-position': 'center',
    'background-attachment': 'fixed',
    animation: 'square-animation 10s ease-in-out infinite both',
  },

  '.loader-square:nth-of-type(0)': {
    'animation-delay': '0s',
  },

  '.loader-square:nth-of-type(1)': {
    'animation-delay': '-1.4285714286s',
  },

  '.loader-square:nth-of-type(2)': {
    'animation-delay': '-2.8571428571s',
  },

  '.loader-square:nth-of-type(3)': {
    'animation-delay': '-4.2857142857s',
  },

  '.loader-square:nth-of-type(4)': {
    'animation-delay': '-5.7142857143s',
  },

  '.loader-square:nth-of-type(5)': {
    'animation-delay': '-7.1428571429s',
  },

  '.loader-square:nth-of-type(6)': {
    'animation-delay': '-8.5714285714s',
  },

  '.loader-square:nth-of-type(7)': {
    'animation-delay': '-10s',
  },
}));

const DLoadingOverlay: FC<any> = ({ loading }: { loading: boolean }) => {
  return loading ? (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(225,225,225, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}
    >
      <StyledLoading>
        <div className="loader">
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
        </div>
      </StyledLoading>
    </Box>
  ) : (
    <></>
  );
};

export default DLoadingOverlay;
