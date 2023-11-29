// ** React Imports
import { useRef, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useRouter } from 'next/router'
import { Formik } from 'formik'
import { Controller } from 'react-hook-form'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import axios from 'axios'

// ** Styled Components
const ResetPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: `${theme.palette.primary.main} !important`
}))

const ResetPasswordV2 = () => {
  // ** States
  const [values, setValues] = useState({
    newPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showConfirmNewPassword: false
  })

  // ** Hooks
  const theme = useTheme()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // Handle New Password
  const handleNewPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  // Handle Confirm New Password
  const handleConfirmNewPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const { locale } = useRouter()
  const formikRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [showError, setshowError] = useState(false)

  const schema = yup.object().shape({
    newPassword: yup
      .string()
      .min(6, `${locale === 'ar' ? 'الحقل اقل من 6 حروف' : 'The field is less than 6 characters'}`)
      .required(`${locale === 'ar' ? 'هذا الحقل فارغ' : 'This field is empty'}`),
    confirmPassword: yup
      .string()
      .min(6, `${locale === 'ar' ? 'الحقل اقل من 6 حروف' : 'The field is less than 6 characters'}`)
      .required(`${locale === 'ar' ? 'هذا الحقل فارغ' : 'This field is empty'}`)
  })

  const defaultValues = {
    confirmPassword: '',
    newPassword: ''
  }

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <ResetPasswordIllustration
            alt='reset-password-illustration'
            src={`/images/pages/auth-v2-reset-password-illustration-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                fill={theme.palette.primary.main}
                d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
              />
              <path
                fill='#161616'
                opacity={0.06}
                fillRule='evenodd'
                clipRule='evenodd'
                d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
              />
              <path
                fill='#161616'
                opacity={0.06}
                fillRule='evenodd'
                clipRule='evenodd'
                d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                fill={theme.palette.primary.main}
                d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
              />
            </svg>
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                {locale === 'ar' ? 'إعادة تعيين كلمة المرور 🔒' : 'Reset Password 🔒'}
              </Typography>
              {/* <Typography sx={{ display: 'flex' }}>
                for
                <Typography component='span' sx={{ ml: 1, fontWeight: 500 }}>
                  john.doe@email.com
                </Typography>
              </Typography> */}
            </Box>
            <Formik
              innerRef={formikRef}
              initialValues={{
                newPassword: '',
                confirmPassword: ''
              }}
              form
              validationSchema={schema}
            >
              {({ values, errors, handleChange, handleChangecolor, handleSubmit, setFieldValue, isValid }) => (
                <>
                  <form
                    onSubmit={e => {
                      e.preventDefault()

                      // if (!isValid) {
                      //   return setshowError(true)
                      // }
                      console.log(values)
                      setLoading(true)

                      axios
                        .post(`http://localhost:3002/api/auth/account/reset-password`, values, {
                          withCredentials: true
                        })
                        .then(response => {
                          console.log(values)
                        })
                        .catch(err => {
                          console.log(err.response?.data?.message)
                          if (err.response?.data?.message === 'Account does not exist') {
                            return setshowError(true)
                          }
                        })
                        .finally(_ => {
                          setLoading(false)
                        })
                    }}
                  >
                    <Controller
                      name='newPassword'
                      control={control}
                      rules={{ required: true }}
                      value={values.newPassword}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          fullWidth
                          autoFocus
                          label={locale === 'ar' ? '  كلمة المرور جديدة' : 'New Password'}
                          value={values.newPassword}
                          placeholder='············'
                          sx={{ display: 'flex', mb: 4 }}
                          id='auth-reset-password-v2-new-password'
                          onChange={e => {
                            handleConfirmNewPasswordChange('newPassword')
                            setFieldValue('newPassword', e.target.value)
                          }}
                          error={errors.newPassword && (showError ? true : values.newPassword.length !== 0)}
                          helperText={
                            Boolean(errors.newPassword && (showError ? true : values.newPassword.length !== 0)) &&
                            errors.newPassword
                          }
                          type={values.showNewPassword ? 'text' : 'password'}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                  onClick={handleClickShowNewPassword}
                                  onMouseDown={e => e.preventDefault()}
                                  aria-label='toggle password visibility'
                                >
                                  <Icon
                                    fontSize='1.25rem'
                                    icon={values.showNewPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                  />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    />
                    <Controller
                      name='confirmPassword'
                      control={control}
                      rules={{ required: true }}
                      value={values.confirmPassword}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          fullWidth
                          autoFocus
                          label={locale === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                          onBlur={onBlur}
                          type={values.showConfirmNewPassword ? 'text' : 'password'}
                          onChange={e => {
                            handleConfirmNewPasswordChange('confirmPassword')
                            setFieldValue('confirmPassword', e.target.value)
                          }}
                          placeholder='············'
                          sx={{ display: 'flex', mb: 4 }}
                          error={errors.confirmPassword && (showError ? true : values.confirmPassword.length !== 0)}
                          helperText={
                            Boolean(
                              errors.confirmPassword && (showError ? true : values.confirmPassword.length !== 0)
                            ) && errors.confirmPassword
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                  onMouseDown={e => e.preventDefault()}
                                  aria-label='toggle password visibility'
                                  onClick={handleClickShowConfirmNewPassword}
                                >
                                  <Icon
                                    fontSize='1.25rem'
                                    icon={values.showConfirmNewPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                  />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    />

                    <LoadingButton
                      loading={loading}
                      disabled={values.confirmPassword == '' || values.newPassword == ''}
                      fullWidth
                      type='submit'
                      variant='contained'
                      sx={{ mb: 4 }}
                    >
                      {locale === 'ar' ? 'تعيين كلمة مرور جديدة' : 'Set New Password'}
                    </LoadingButton>
                    <Typography
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}
                    >
                      <Typography component={LinkStyled} href='/login'>
                        <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                        <span>{locale === 'ar' ? 'العودة الي تسجيل الدخول ' : 'Back to login'}</span>
                      </Typography>
                    </Typography>
                  </form>
                </>
              )}
            </Formik>{' '}
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
ResetPasswordV2.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ResetPasswordV2
