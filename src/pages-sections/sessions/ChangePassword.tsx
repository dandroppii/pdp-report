import { Box, Button } from '@mui/material';
import { pdpService } from 'api';
import BazaarTextField from 'components/BazaarTextField';
import { FlexBox } from 'components/flex-box';
import { H1, RequireMark, Small } from 'components/Typography';
import { Formik, useFormik } from 'formik';
import { useTranslations } from 'next-intl';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ListPdpResponse } from 'types/common';
import { STATUS_CODE_SUCCESS } from 'utils/constants';
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

  const handleFormSubmit = useCallback(
    async (values: any) => {
      try {
        setLoading(true);
        const res = await pdpService.changePdpPassword({
          id: pdp?.userDetail?.id,
          password: values.password,
          userName: pdp?.userDetail?.username,
        });
        setLoading(false);
        if (res.statusCode === STATUS_CODE_SUCCESS) {
          onSuccess && onSuccess(res);
          toast.success('Đổi mật khẩu thành công');
        } else {
          toast.error(res.message || 'Đổi mật khẩu thất bại');
        }
      } catch (error) {
        setLoading(false);
        toast.error('Đổi mật khẩu thất bại');
      }
    },
    [pdp, onSuccess]
  );

  const handleCloseForm = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, dirty, isValid } =
    useFormik({
      initialValues: {
        password: '',
        rePassword: '',
      },
      onSubmit: handleFormSubmit,
      validationSchema: yup.object().shape({
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
  console.log('🚀 ~ file: ChangePassword.tsx:92 ~ values:', values, errors);

  return (
    <Wrapper elevation={3}>
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
    </Wrapper>
  );
};

export default ChangePassword;
