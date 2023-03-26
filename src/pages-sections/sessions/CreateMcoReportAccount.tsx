import { Autocomplete, Button, Card, CardProps, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import BazaarButton from 'components/BazaarButton';
import BazaarTextField from 'components/BazaarTextField';
import { FlexBox } from 'components/flex-box';
import { H1, Small } from 'components/Typography';
import { useAppContext } from 'contexts/AppContext';
import { useAuthContext } from 'contexts/AuthContext';
import { useFormik } from 'formik';
import { useTranslations } from 'next-intl';
import React, { useCallback, useState } from 'react';
import { ListPdp } from 'types/common';
import * as yup from 'yup';
import EyeToggleButton from './EyeToggleButton';

const fbStyle = { background: '#3B5998', color: 'white' };
const googleStyle = { background: '#4285F4', color: 'white' };

type WrapperProps = { passwordVisibility?: boolean };
export const IS_ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]+$/;
export const Wrapper = styled<React.FC<WrapperProps & CardProps>>(
  ({ children, passwordVisibility, ...rest }) => <Card {...rest}>{children}</Card>
)<CardProps>(({ theme, passwordVisibility }) => ({
  width: 500,
  padding: '2rem 3rem',
  [theme.breakpoints.down('sm')]: { width: '100%' },
  '.passwordEye': {
    color: passwordVisibility ? theme.palette.grey[600] : theme.palette.grey[400],
  },
  '.facebookButton': { marginBottom: 10, ...fbStyle, '&:hover': fbStyle },
  '.googleButton': { ...googleStyle, '&:hover': googleStyle },
  '.agreement': { marginTop: 12, marginBottom: 24 },
}));

const CreateMcoReportAccount = ({ onSuccess, onClose }: { onSuccess: any; onClose: any }) => {
  const t = useTranslations();
  const {
    state: { listPdp, selectedPdp },
    dispatch,
  } = useAppContext();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [rePasswordVisibility, setRePasswordVisibility] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility(visible => !visible);
  }, []);

  const toggleRePasswordVisibility = useCallback(() => {
    setRePasswordVisibility(visible => !visible);
  }, []);

  const handleFormSubmit = async (values: any) => {
    try {
      setLoading(true);
      const res = {};
      setLoading(false);
      onSuccess && onSuccess(res);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCloseForm = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    dirty,
    isValid,
    setFieldValue,
  } = useFormik({
    initialValues: {
      username: '',
      password: '',
      rePassword: '',
      pdp: null,
    },
    onSubmit: handleFormSubmit,
    validationSchema: yup.object({
      username: yup.string().required(t('username_required')),
      pdp: yup.object().nullable().required(t('pdp_required')),
      password: yup
        .string()
        .required(t('password_required'))
        .min(5, t('password_length_validation'))
        .max(50, t('password_length_validation')),
      rePassword: yup
        .string()
        .required(t('re_password_required'))
        .min(5, t('password_length_validation'))
        .max(50, t('password_length_validation'))
        .oneOf([yup.ref('password'), null], t('confirm_password_validation')),
    }),
  });

  return (
    <Wrapper elevation={3} passwordVisibility={passwordVisibility}>
      <form onSubmit={handleSubmit}>
        <H1 textAlign="center" mb={4}>
          Tạo tài khoản
        </H1>

        <Autocomplete
          fullWidth
          options={listPdp}
          value={selectedPdp}
          getOptionLabel={(option: ListPdp) => option.name}
          onChange={(_, value: ListPdp) => {
            setFieldValue('pdp', value);
          }}
          renderInput={params => (
            <BazaarTextField
              label="Chọn nhà cung cấp"
              {...params}
              error={!!touched.pdp && !!errors.pdp}
              helperText={touched.pdp && errors.pdp}
              placeholder="Chọn nhà cung cấp"
            />
          )}
        />

        <BazaarTextField
          mb={1.5}
          mt={1.5}
          fullWidth
          name="username"
          size="small"
          variant="outlined"
          onBlur={handleBlur}
          value={values.username}
          onChange={handleChange}
          label="Tên đăng nhập"
          placeholder="Nhập tên đăng nhập"
          error={!!touched.username && !!errors.username}
          helperText={touched.username && errors.username}
        />

        <BazaarTextField
          mb={2}
          fullWidth
          size="small"
          name="password"
          label="Mật khẩu"
          autoComplete="on"
          variant="outlined"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password}
          placeholder="*********"
          type={passwordVisibility ? 'text' : 'password'}
          error={!!touched.password && !!errors.password}
          helperText={touched.password && errors.password}
          InputProps={{
            endAdornment: (
              <EyeToggleButton show={passwordVisibility} click={togglePasswordVisibility} />
            ),
          }}
        />

        <BazaarTextField
          mb={2}
          fullWidth
          size="small"
          name="rePassword"
          label="Nhập lại mật khẩu"
          autoComplete="on"
          variant="outlined"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.rePassword}
          placeholder="*********"
          type={rePasswordVisibility ? 'text' : 'password'}
          error={!!touched.rePassword && !!errors.rePassword}
          helperText={touched.rePassword && errors.rePassword}
          InputProps={{
            endAdornment: (
              <EyeToggleButton show={rePasswordVisibility} click={toggleRePasswordVisibility} />
            ),
          }}
        />

        <FlexBox gap={2} justifyContent="center">
          <BazaarButton
            type="submit"
            color="primary"
            variant="contained"
            sx={{ mb: '1.65rem', height: 44 }}
            disabled={!(dirty && isValid)}
          >
            Tạo mới
          </BazaarButton>
          <Button
            color="primary"
            variant="outlined"
            onClick={handleCloseForm}
            sx={{ mb: '1.65rem', height: 44 }}
          >
            Hủy
          </Button>
        </FlexBox>
      </form>
    </Wrapper>
  );
};

const initialValues = {
  email: '',
  password: '',
};

const formSchema = yup.object().shape({
  password: yup.string().required('Password is required'),
  email: yup.string().email('invalid email').required('Email is required'),
});

export default CreateMcoReportAccount;
