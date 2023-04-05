import { Autocomplete, Button, Card, CardProps, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { pdpService } from 'api';
import BazaarButton from 'components/BazaarButton';
import BazaarTextField from 'components/BazaarTextField';
import { FlexBox } from 'components/flex-box';
import { H1, Small } from 'components/Typography';
import { useAppContext } from 'contexts/AppContext';
import { useAuthContext } from 'contexts/AuthContext';
import { useFormik } from 'formik';
import { useTranslations } from 'next-intl';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ListPdp } from 'types/common';
import { STATUS_CODE_SUCCESS } from 'utils/constants';
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

const CreateMcoReportAccount = ({
  onSuccess,
  onClose,
  listPdp,
}: {
  onSuccess: any;
  onClose: any;
  listPdp: {
    name: string;
    id: string;
  }[];
}) => {
  const t = useTranslations();
  const { getListPdp } = useAppContext();
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
      const res = await pdpService.createAccount({
        userName: values.username,
        fullName: values.fullName,
        password: values.password,
      });

      setLoading(false);
      if (res.statusCode === STATUS_CODE_SUCCESS && res?.data) {
        const resMapping = await pdpService.mapAccountWithPdp({
          userName: values.username,
          supplierId: values.pdp?.id,
        });
        if (resMapping.statusCode === STATUS_CODE_SUCCESS && resMapping?.data) {
          onSuccess && onSuccess(res);
          getListPdp();
          toast.success('Tạo tài khoản thành công');
        } else {
          toast.error(resMapping.message);
        }
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.message || 'Tạo tài khoản thất bại');
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
          value={values.pdp}
          getOptionLabel={(option: any) => option.name}
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
          autoComplete="new-password"
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
          autoComplete="new-password"
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
          autoComplete="new-password"
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
            disabled={!(dirty && isValid && !loading)}
          >
            Tạo mới
          </BazaarButton>
          <Button
            color="primary"
            variant="outlined"
            onClick={handleCloseForm}
            sx={{ mb: '1.65rem', height: 44 }}
            disabled={loading}
          >
            Hủy
          </Button>
        </FlexBox>
      </form>
    </Wrapper>
  );
};

export default CreateMcoReportAccount;
