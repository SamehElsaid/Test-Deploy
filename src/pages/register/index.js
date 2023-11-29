import { useRef, useState } from 'react'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useSettings } from 'src/@core/hooks/useSettings'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Router, { useRouter } from 'next/router'
import axios from 'axios'
import toast from 'react-hot-toast'
import PhoneInput from 'react-phone-number-input'
import { FormControl, FormHelperText } from '@mui/material'
import { Formik } from 'formik'
import { LoadingButton } from '@mui/lab'
import { useIntl } from 'react-intl'

const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 600,
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

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [policy_accepted, checkPolicy] = useState(false)

  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const { skin } = settings
  const imageSource = skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration'
  const { locale } = useRouter()
  const router = useRouter()

  const defaultValues = {
    mobile: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    policy_accepted: ''
  }
  const phoneRegExp = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/

  const [showError, setshowError] = useState(false)
  const [loading, setLoading] = useState(false)
  const { messages } = useIntl()

  const emailRegex =
    /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i

  const schema = yup.object().shape({
    email: yup
      .string()
      .matches(emailRegex, `${locale === 'ar' ? 'هذا الحقل غير صحيح' : 'This field is invalid'}`)
      .required(messages.required),
    password: yup
      .string()
      .min(
        3,
        locale === 'ar' ? 'يجب ان يكون الرقم السري اكثر من 3 حروف او ارقام' : 'password must be at least 3 characters'
      )
      .required(messages.required),
    first_name: yup.string().required(messages.required),
    last_name: yup.string().required(messages.required),
    mobile: yup
      .string()
      .matches(phoneRegExp, `${locale === 'ar' ? 'رقم الهاتف غير صحيح' : 'Phone number is not valid'}`)
  })

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const changeCheckPolicy = () => {
    checkPolicy(!policy_accepted)
  }

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
          <RegisterIllustration
            alt='register-illustration'
            src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
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
                {locale === 'ar' ? 'المغامرة تبدأ من هنا 🚀 ' : 'Adventure starts here 🚀 '}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {locale === 'ar' ? 'اجعل إدارة تطبيقك سهلة وممتعة!' : 'Make your app management easy and fun!'}
              </Typography>
            </Box>
            <Formik
              initialValues={{
                email: '',
                first_name: '',
                last_name: '',
                password: '',
                mobile: '',
                policy_accepted: ''
              }}
              form
              validationSchema={schema}
            >
              {({ values, errors, setFieldValue, setErrors, isValid }) => (
                <>
                  <form
                    onSubmit={e => {
                      e.preventDefault()
                      if (!isValid) {
                        return setshowError(true)
                      }
                      setLoading(true)

                      const da = { ...values }

                      const dataSent = {
                        profile: {
                          email: da.email,
                          mobile: da.mobile,
                          name: {
                            first_name: da.first_name,
                            last_name: da.last_name
                          }
                        },
                        password: da.password,
                        policy_accepted: policy_accepted
                      }
                      axios
                        .post(`${process.env.API_URL}/api/auth/account/register`, dataSent)
                        .then(response => {
                          if (response.status == 200) {
                            toast.success(response.data.message)
                            router.push('/login')
                          }
                        })
                        .catch(error => {
                          console.log(error.response.data)
                          if (error.response.data.message.includes('Account already exists')) {
                            return toast.error(locale === 'ar' ? 'هذا الحساب مسجل من قبل' : error.response.data.message)
                          }

                          return toast.error(error?.response?.data?.message)
                        })
                        .finally(_ => {
                          setLoading(false)
                        })
                    }}
                  >
                    <Controller
                      name='first_name'
                      value={values.first_name}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          type='text'
                          sx={{ mb: 4 }}
                          onChange={e => {
                            setFieldValue('first_name', e.target.value)
                          }}
                          label={locale === 'ar' ? 'الاسم الاول' : 'First Name'}
                          placeholder='Jhon'
                          error={errors.first_name && (showError ? true : values.first_name.length !== 0)}
                          helperText={
                            Boolean(errors.first_name && (showError ? true : values.first_name.length !== 0)) &&
                            errors.first_name
                          }
                        />
                      )}
                    />
                    <Controller
                      name='last_name'
                      value={values.last_name}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          type='text'
                          sx={{ mb: 4 }}
                          onChange={e => {
                            setFieldValue('last_name', e.target.value)
                          }}
                          label={locale === 'ar' ? 'الاسم الاخير' : 'Last Name'}
                          placeholder='doe'
                          error={errors.last_name && (showError ? true : values.last_name.length !== 0)}
                          helperText={
                            Boolean(errors.last_name && (showError ? true : values.last_name.length !== 0)) &&
                            errors.last_name
                          }
                        />
                      )}
                    />
                    <label className='PhoneLabel'>{locale === 'ar' ? 'رقم الهاتف ' : 'Phone Number'}</label>
                    <div style={{ display: 'flex' }}>
                      <PhoneInput
                        style={{
                          border: values.mobile == undefined && '1px solid #EA5455'
                        }}
                        defaultCountry='EG'
                        className={`phoneNumber ${values.mobile == undefined ? 'error' : ''}`}
                        placeholder='123-456-7890'
                        value={values.mobile}
                        onChange={e => {
                          setFieldValue('mobile', e)
                        }}
                      />
                    </div>
                    {errors.mobile && values.mobile?.length !== 0 && (
                      <FormHelperText sx={{ fontSize: '13px', color: '#EA5455' }}>{errors.mobile}</FormHelperText>
                    )}

                    <Controller
                      name='email'
                      control={control}
                      value={values.email}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          fullWidth
                          autoFocus
                          sx={{ marginTop: '15px', mb: 4 }}
                          label={locale === 'ar' ? 'البريد الالكترونى' : 'Email'}
                          onBlur={onBlur}
                          onChange={e => {
                            setFieldValue('email', e.target.value)
                          }}
                          placeholder='admin@gmail.com'
                          error={errors.email && (showError ? true : values.email.length !== 0)}
                          helperText={
                            Boolean(errors.email && (showError ? true : values.email.length !== 0)) && errors.email
                          }
                        />
                      )}
                    />
                    <Controller
                      name='password'
                      control={control}
                      value={values.password}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          fullWidth
                          sx={{ mb: 4 }}
                          onBlur={onBlur}
                          label={locale === 'ar' ? 'كلمة السر' : 'Password'}
                          onChange={e => {
                            setFieldValue('password', e.target.value)
                          }}
                          id='auth-login-v2-password'
                          error={errors.password && (showError ? true : values.password.length !== 0)}
                          helperText={
                            Boolean(errors.password && (showError ? true : values.password.length !== 0)) &&
                            errors.password
                          }
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

                    <FormControl required sx={{ mt: 4 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            required
                            checked={policy_accepted}
                            onChange={e => {
                              changeCheckPolicy()
                              setFieldValue('policy_accepted', e.target.value)
                            }}
                          />
                        }
                        sx={{
                          mb: -2,
                          mt: 1.5,
                          '& .MuiFormControlLabel-label': { fontSize: theme.typography.body2.fontSize }
                        }}
                        label={
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 1,
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography sx={{ color: 'text.secondary' }}>
                              {locale === 'ar' ? 'أوافق' : 'I agree to'}{' '}
                            </Typography>
                            <LinkStyled component={LinkStyled} href='/Terms&Conditions'>
                              {locale === 'ar' ? 'سياسة الخصوصية والشروط' : ' privacy policy & terms'}
                            </LinkStyled>
                          </Box>
                        }
                      />
                    </FormControl>
                    <LoadingButton
                      loading={loading}
                      fullWidth
                      type='submit'
                      disabled={
                        !(
                          !errors.email &&
                          values.email.length !== 0 &&
                          !errors.first_name &&
                          values.first_name.length !== 0 &&
                          !errors.last_name &&
                          values.last_name.length !== 0 &&
                          !errors.mobile &&
                          values.mobile?.length !== 0 &&
                          !errors.password &&
                          values.password?.length !== 0 &&
                          policy_accepted
                        )
                      }
                      variant='contained'
                      sx={{ mb: 4, mt: 4 }}
                    >
                      {locale === 'ar' ? 'تسجيل' : 'Sign up'}
                    </LoadingButton>
                    <Box
                      sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}
                    >
                      <Typography sx={{ color: 'text.secondary' }}>
                        {locale === 'ar' ? 'هل لديك حساب بالفعل؟' : 'Already have an account?'}
                      </Typography>
                      <Typography component={LinkStyled} href='/login'>
                        {locale === 'ar' ? ' قم بتسجيل الدخول بدلاً من ذلك' : 'Sign in instead'}
                      </Typography>
                    </Box>
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
Register.getLayout = page => <BlankLayout>{page}</BlankLayout>
Register.guestGuard = true

export default Register
