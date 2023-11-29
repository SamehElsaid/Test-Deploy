// ** React Imports
import { useRef, useState } from 'react'
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
import { Formik } from 'formik'

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

const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
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

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const defaultValues = {
  password: '',
  email: ''
}

// ** MUI Components
import Button from '@mui/material/Button'

const ForgotPassword = () => {
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
  const formikRef = useRef(null)
  const [showError, setshowError] = useState(false)

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(`${locale === 'ar' ? 'هذا الحقل غير صحيح' : 'This field is invalid'}`)
      .required(`${locale === 'ar' ? 'هذا الحقل فارغ' : 'This field is empty'}`)
  })

  const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
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
    color: theme.palette.primary.main,
    fontSize: theme.typography.body1.fontSize
  }))

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
          <ForgotPasswordIllustration
            alt='forgot-password-illustration'
            src={`/images/pages/auth-v2-forgot-password-illustration-${theme.palette.mode}.png`}
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
              <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                {locale === 'ar' ? 'نسيت كلمة المرور؟ 🔒' : 'Forgot Password? 🔒'}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {locale === 'ar'
                  ? 'أدخل بريدك الإلكتروني وسنرسل لك تعليمات لإعادة تعيين كلمة المرور الخاصة بك'
                  : 'Enter your email and we&prime;ll send you instructions to reset your password'}
              </Typography>
            </Box>
            <Formik
              innerRef={formikRef}
              initialValues={{
                email: ''
              }}
              form
              validationSchema={schema}
            >
              {({ values, errors, handleChange, handleChangecolor, handleSubmit, setFieldValue, isValid }) => (
                <>
                  <form
                    onSubmit={e => {
                      e.preventDefault()
                      setLoading(true)

                      console.log(values)

                      axios
                        .post(`${process.env.API_URL}/api/auth/account/forgot-password`, values, {
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
                      name='email'
                      control={control}
                      rules={{ required: true }}
                      value={values.email}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          fullWidth
                          autoFocus
                          label={locale === 'ar' ? 'الايميل' : 'Email'}
                          onBlur={onBlur}
                          onChange={e => {
                            setFieldValue('email', e.target.value)
                          }}
                          sx={{ display: 'flex', mb: 4 }}
                          placeholder='john.doe@gmail.com'
                          error={errors.email && (showError ? true : values.email == '')}
                          helperText={Boolean(errors.email && (showError ? true : values.email == '')) && errors.email}
                        />
                      )}
                    />
                    <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                      {locale === 'ar' ? 'إرسال رابط إعادة التعيين' : 'Send reset link'}
                    </Button>
                    <Typography
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}
                    >
                      <LinkStyled href='/pages/auth/login-v2'>
                        <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                        <span>{locale === 'ar' ? 'العودة الي تسجيل الدخول ' : 'Back to login'}</span>
                      </LinkStyled>
                    </Typography>
                  </form>
                </>
              )}
            </Formik>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ForgotPassword.guestGuard = true

export default ForgotPassword
