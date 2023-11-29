// ** React Imports
import { useState } from 'react'
import Link from 'next/link'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSettings } from 'src/@core/hooks/useSettings'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import axios from 'axios'
import { SET_ACTIVE_USER } from 'src/store/apps/authSlice/authSlice'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import { useIntl } from 'react-intl'
import toast from 'react-hot-toast'

const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
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
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const defaultValues = {
  password: '',
  email: ''
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useDispatch()
  const { locale } = useRouter()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { messages } = useIntl()
  const { skin } = settings

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(`${locale === 'ar' ? 'هذا الحقل غير صحيح' : 'This field is invalid'}`)
      .required(`${locale === 'ar' ? 'هذا الحقل فارغ' : 'This field is empty'}`),
    password: yup
      .string()
      .min(6, `${locale === 'ar' ? 'الحقل اقل من 6 حروف' : 'The field is less than 6 characters'}`)
      .required(`${locale === 'ar' ? 'هذا الحقل فارغ' : 'This field is empty'}`)
  })

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
  console.log(errors)

  const onSubmit = data => {
    setLoading(true)
    const SentData = { ...data }
    delete SentData.rememberMe

    axios
      .post(`${process.env.API_URL}/api/auth/account/login`, SentData, { withCredentials: true })
      .then(async response => {
        dispatch(SET_ACTIVE_USER(response.data.profile))
        router.push(`/${locale}/merchant`)
      })
      .catch(err => {
        console.log(err.response?.data?.message)
        if (err.response?.data?.message === 'Account does not exist') {
          setError('email', {
            message: locale === 'ar' ? 'الحساب أو كلمة المرور غير صحيحة' : 'Email or password is incorrect'
          })
          setError('password', {
            message: locale === 'ar' ? 'الحساب أو كلمة المرور غير صحيحة' : 'Email or password is incorrect'
          })
        }
        if (err.response?.data?.message === 'Password is incorrect') {
          setError('email', {
            message: locale === 'ar' ? 'الحساب أو كلمة المرور غير صحيحة' : 'Email or password is incorrect'
          })
          setError('password', {
            message: locale === 'ar' ? 'الحساب أو كلمة المرور غير صحيحة' : 'Email or password is incorrect'
          })
        }
        if (err.response?.data?.message === 'This account is registered with social login') {
          toast.error(
            locale == 'ar'
              ? 'هذا الحساب مسجل مع تسجيل الدخول الاجتماعي'
              : 'This account is registered with social login'
          )
        }
      })
      .finally(_ => {
        setLoading(false)
      })
  }

  const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

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
          <LoginIllustration alt='login-illustration' src={`/images/pages/${imageSource}-${theme.palette.mode}.png`} />
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
                {messages.hello}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{messages.start}</Typography>
            </Box>

            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label={locale === 'ar' ? 'الايميل' : 'Email'}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder=''
                      error={Boolean(errors.email)}
                      {...(errors.email && { helperText: errors.email.message })}
                    />
                  )}
                />
              </Box>
              <Box sx={{ mb: 1.5 }}>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label={locale === 'ar' ? 'الرقم السري' : 'Password'}
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      {...(errors.password && { helperText: errors.password.message })}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>
              <Box
                sx={{
                  mb: 1.75,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography component={LinkStyled} href='/forgot-password'>
                  {locale === 'ar' ? 'نسيت الرقم السري؟' : 'Forgot Password?'}
                </Typography>
              </Box>
              {console.log(errors.password)}
              <LoadingButton
                disabled={
                  errors?.email?.message == 'This field is empty' ||
                  errors?.password?.message == 'The field is less than 6 characters'
                }
                loading={loading}
                fullWidth
                type='submit'
                variant='contained'
                sx={{ mb: 4 }}
              >
                {locale === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </LoadingButton>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mx: 2 }}>
                  {locale === 'ar' ? ' لا تمتلك حساب' : "You don't have account "}
                </Typography>
                <Typography href='/register' component={LinkStyled}>
                  {locale === 'ar' ? 'انشاء حساب' : 'Create an account'}
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
