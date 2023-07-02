import { Box, Button } from '@mui/material';
import { pdpService } from 'api';
import BazaarTextField from 'components/BazaarTextField';
import { FlexBox } from 'components/flex-box';
import { H1, RequireMark } from 'components/Typography';
import { useFormik } from 'formik';
import { useTranslations } from 'next-intl';
import EyeToggleButton from 'pages-sections/sessions/EyeToggleButton';
import { Wrapper } from 'pages-sections/sessions/Login';
import React, { useCallback, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { STATUS_CODE_SUCCESS } from 'utils/constants';
import * as yup from 'yup';

const PdpChangePassword = ({ onSuccess, onClose }: { onSuccess: any; onClose: any }) => {
  const t = useTranslations();
  const [loading, setLoading] = useState<boolean>(false);
  const [oldPasswordVisibility, setOldPasswordVisibility] = useState(false);
  const [newPasswordVisibility, setNewPasswordVisibility] = useState(false);
  const [reNewPasswordVisibility, setReNewPasswordVisibility] = useState(false);
  const toggleNewPasswordVisibility = useCallback(() => {
    setNewPasswordVisibility(visible => !visible);
  }, []);
  const toggleReNewPasswordVisibility = useCallback(() => {
    setReNewPasswordVisibility(visible => !visible);
  }, []);

  const toggleOldPasswordVisibility = useCallback(() => {
    setOldPasswordVisibility(visible => !visible);
  }, []);

  const handleFormSubmit = useCallback(
    async (values: any) => {
      try {
        setLoading(true);
        const res = await pdpService.pdpChangePdpPassword({
          oldPassword: values.oldPassword,
          newPassword: values.password,
        });
        setLoading(false);
        if (res.statusCode === STATUS_CODE_SUCCESS) {
          onSuccess && onSuccess(res);
        } else {
          toast.error(res.message || 'Đổi mật khẩu thất bại');
        }
      } catch (error) {
        setLoading(false);
        toast.error('Đổi mật khẩu thất bại');
      }
    },
    [onSuccess]
  );

  const handleCloseForm = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, dirty, isValid } =
    useFormik({
      initialValues: {
        oldPassword: '',
        password: '',
        rePassword: '',
      },
      onSubmit: handleFormSubmit,
      validationSchema: yup.object().shape({
        oldPassword: yup
          .string()
          .required(t('password_required'))
          .min(5, t('password_length_validation'))
          .max(50, t('password_length_validation')),
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
    <Wrapper elevation={3}>
      <form onSubmit={handleSubmit}>
        <H1 textAlign="center" mb={2}>
          Đổi mật khẩu
        </H1>

        <Box mb={4}>
          <BazaarTextField
            mb={1.5}
            fullWidth
            size="small"
            name="oldPassword"
            label={
              <>
                {t('old_password')}&nbsp;
                <RequireMark></RequireMark>
              </>
            }
            variant="outlined"
            autoComplete="new-password"
            placeholder={t('old_password_placeholder')}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.oldPassword}
            type={oldPasswordVisibility ? 'text' : 'password'}
            error={!!touched.oldPassword && !!errors.oldPassword}
            helperText={touched.oldPassword && errors.oldPassword}
            InputProps={{
              endAdornment: (
                <EyeToggleButton show={oldPasswordVisibility} click={toggleOldPasswordVisibility} />
              ),
            }}
          />
          <BazaarTextField
            mb={1.5}
            fullWidth
            size="small"
            name="password"
            label={
              <>
                {t('new_password')}&nbsp;
                <RequireMark></RequireMark>
              </>
            }
            variant="outlined"
            autoComplete="new-password"
            placeholder={t('new_password_placeholder')}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.password}
            type={newPasswordVisibility ? 'text' : 'password'}
            error={!!touched.password && !!errors.password}
            helperText={touched.password && errors.password}
            InputProps={{
              endAdornment: (
                <EyeToggleButton show={newPasswordVisibility} click={toggleNewPasswordVisibility} />
              ),
            }}
          />
          <BazaarTextField
            mb={1.5}
            fullWidth
            size="small"
            name="rePassword"
            label={
              <>
                {t('re_password')}&nbsp;
                <RequireMark></RequireMark>
              </>
            }
            variant="outlined"
            autoComplete="new-password"
            placeholder={t('re_password')}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.rePassword}
            type={reNewPasswordVisibility ? 'text' : 'password'}
            error={!!touched.rePassword && !!errors.rePassword}
            helperText={touched.rePassword && errors.rePassword}
            InputProps={{
              endAdornment: (
                <EyeToggleButton
                  show={reNewPasswordVisibility}
                  click={toggleReNewPasswordVisibility}
                />
              ),
            }}
          />
        </Box>
        <FlexBox justifyContent="center" gap={2}>
          <Button
            disabled={!(dirty && isValid && !loading)}
            type="submit"
            variant="contained"
            color="primary"
            sx={{ height: 44 }}
          >
            {t('change_password')}
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={handleCloseForm}
            sx={{ height: 44 }}
            disabled={loading}
          >
            Hủy
          </Button>
        </FlexBox>
      </form>
      <Toaster toastOptions={{ duration: 4000 }} />
    </Wrapper>
  );
};

export default PdpChangePassword;
