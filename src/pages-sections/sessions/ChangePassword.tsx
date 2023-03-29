import { Box, Button } from '@mui/material';
import BazaarTextField from 'components/BazaarTextField';
import { FlexBox } from 'components/flex-box';
import { H1, RequireMark, Small } from 'components/Typography';
import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import React, { useCallback, useState } from 'react';
import { ListPdpResponse } from 'types/common';
import * as yup from 'yup';
import EyeToggleButton from './EyeToggleButton';
import { Wrapper } from './Login';

const ChangePassword = ({
  onSuccess,
  onClose,
  pdp,
}: {
  onSuccess: any;
  onClose: any;
  pdp: ListPdpResponse;
}) => {
  const t = useTranslations();
  const [loading, setLoading] = useState<boolean>(false);
  const [newPasswordVisibility, setNewPasswordVisibility] = useState(false);
  const [reNewPasswordVisibility, setReNewPasswordVisibility] = useState(false);
  const toggleNewPasswordVisibility = useCallback(() => {
    setNewPasswordVisibility(visible => !visible);
  }, []);
  const toggleReNewPasswordVisibility = useCallback(() => {
    setReNewPasswordVisibility(visible => !visible);
  }, []);

  const checkoutSchema = yup.object().shape({
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
  });

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

  return (
    <Wrapper elevation={3}>
      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <H1 textAlign="center" mb={2}>
              Đổi mật khẩu
            </H1>
            <Small
              mb={4}
              fontSize={12}
              display="block"
              fontWeight={600}
              color="grey.800"
              textAlign="center"
            >
              Đổi mật khẩu cho nhà cung cấp {pdp?.fullName}
            </Small>
            <Box mb={4}>
              <BazaarTextField
                mb={1.5}
                fullWidth
                size="small"
                name="newPassword"
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
                value={values.newPassword}
                type={newPasswordVisibility ? 'text' : 'password'}
                error={!!touched.newPassword && !!errors.newPassword}
                helperText={touched.newPassword && errors.newPassword}
                InputProps={{
                  endAdornment: (
                    <EyeToggleButton
                      show={newPasswordVisibility}
                      click={toggleNewPasswordVisibility}
                    />
                  ),
                }}
              />
              <BazaarTextField
                mb={1.5}
                fullWidth
                size="small"
                name="reNewPassword"
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
                value={values.reNewPassword}
                type={reNewPasswordVisibility ? 'text' : 'password'}
                error={!!touched.reNewPassword && !!errors.reNewPassword}
                helperText={touched.reNewPassword && errors.reNewPassword}
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
                disabled={loading}
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
              >
                Hủy
              </Button>
            </FlexBox>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};

const initialValues = {
  newPassword: '',
  reNewPassword: '',
};

export default ChangePassword;
