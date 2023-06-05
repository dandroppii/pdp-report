import { Card, CardProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import BazaarButton from 'components/BazaarButton';
import BazaarTextField from 'components/BazaarTextField';
import { H1, Small } from 'components/Typography';
import { useAuthContext } from 'contexts/AuthContext';
import { useFormik } from 'formik';
import { useTranslations } from 'next-intl';
import React, { useCallback, useState } from 'react';
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

const Login = () => {
  const t = useTranslations();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuthContext();
  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility(visible => !visible);
  }, []);

  const handleFormSubmit = async (values: any) => {
    try {
      setLoading(true);
      const res = await login(values.username, values.password);
      !res && setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, dirty, isValid } =
    useFormik({
      initialValues: {
        username: '',
        password: '',
      },
      onSubmit: handleFormSubmit,
      validationSchema: yup.object({
        username: yup.string().required(t('username_required')),
        password: yup
          .string()
          .required(t('password_required'))
          .min(5, t('password_length_validation'))
          .max(50, t('password_length_validation')),
      }),
    });

  return (
    <Wrapper elevation={3} passwordVisibility={passwordVisibility}>
      <form onSubmit={handleSubmit}>
        <H1 textAlign="center" mb={4}>
          Đăng nhập
        </H1>
        <BazaarTextField
          mb={1.5}
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

        <BazaarButton
          fullWidth
          type="submit"
          color="primary"
          variant="contained"
          sx={{ mb: '1.65rem', height: 44 }}
          disabled={!(dirty && isValid) || loading}
        >
          Đăng nhập
        </BazaarButton>
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

export default Login;
