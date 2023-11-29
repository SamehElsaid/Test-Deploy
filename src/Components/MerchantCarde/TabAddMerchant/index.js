// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Switch, TextField } from '@mui/material'
import { REMOVE_merchantPopUp } from 'src/store/apps/addMerchantDialog'
import { useDispatch } from 'react-redux'
import { Formik } from 'formik'
import { defaultColorValues } from '@iconify/tools/lib/colors/attribs'
import axios from 'axios'
import { LoadingButton } from '@mui/lab'

const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/'
const apiUrl = 'http://localhost:3002/api/merchant'

// const apiUrl = 'https://localhost:3002/api/merchant'

const initialData = {
  description_ar: '',
  name_ar: '',
  description_en: '',
  name_en: '',
  logo: ''
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,

  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(2)
  }
}))

const TabAccount = props => {
  const { handleDialogToggle, setrefresh, refresh } = props

  // ** State
  const [inputValue, setInputValue] = useState('')
  const [userInput, setUserInput] = useState('yes')
  const [formData, setFormData] = useState(initialData)
  const [imgSrc, setImgSrc] = useState('/images/avatars/15.png')
  const [secondDialogOpen, setSecondDialogOpen] = useState(false)
  const [checked, setChecked] = useState(true)
  const [imageSrc, setImageSrc] = useState('/images/avatars/15.png')
  const [BufferImage, setBufferImage] = useState('')
  const dispatch = useDispatch()

  const defaultValues = {
    description_ar: '',
    name_ar: '',
    description_en: '',
    name_en: '',
    logo: ''
  }
  console.log(imgSrc, 'looooooooooogoooooooooooooooooooooooooo')

  useEffect(() => {
    if (props.item?.logo !== '') {
      axios
        .get(`${process.env.API_URL}/api/images/download/${props.item?.logo}?merchant=${props.item?.name_en}`, {
          responseType: 'arraybuffer',
          withCredentials: true
        })
        .then(response => {
          const imageSrc = `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`
          console.log(imageSrc)
          setBufferImage(response.data)
          setImgSrc(imageSrc)
        })
        .catch(error => {
          setImgSrc(false)
          console.log(error)
        })
    } else {
      setImgSrc('/images/avatars/15.png')
    }
  }, [])

  const handleClickClose = () => {
    dispatch(REMOVE_merchantPopUp())
  }

  const SetImageinFile = img => {
    axios
      .get(`${process.env.API_URL}/api/images/download/${img}`, {
        responseType: 'arraybuffer',
        withCredentials: true
      })
      .then(response => {
        const imageSrc = `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`
        setImageSrc(imageSrc)

        // setImageUrl(imageSrc)
      })
      .catch(error => {
        console.error('Error fetching image:', error)
      })
  }

  const showErrors = (field, valueLen, min) => {
    if (valueLen === 0) {
      return `${field} field is required`
    } else if (valueLen > 0 && valueLen < min) {
      return `${field} must be at least ${min} characters`
    } else {
      return ''
    }
  }

  const schema = yup.object().shape({
    name_en: yup
      .string()
      .min(3, obj => showErrors('name_en', obj.value.length, obj.min))
      .required(),
    name_ar: yup
      .string()
      .min(3, obj => showErrors('name_ar', obj.value.length, obj.min))
      .required()
  })

  const accountSchema = yup.object().shape({
    // arabicname: yup.string().required(locale === 'ar' ? 'مهم' : 'req'),
    name_ar: yup
      .string()
      .required('Arabic name is required')
      .matches(/^[؀-ۿ ١-٩ 0-9 \u0600-\u06FF\s]+$/, 'Please enter a valid Arabic name'),
    name_en: yup
      .string()
      .required('English name is required')
      .matches(/^[A-Za-z\s]+$/, 'Please enter a valid English name'),
    description_en: yup.string(),
    description_ar: yup.string(),
    logo: yup.string()
  })

  // ** Hook
  const {
    reset: accountReset,
    control: accountControl,
    handleSubmit: handleAccountSubmit,
    formState: { errors: accountErrors }
  } = useForm({
    defaultValues: {},
    resolver: yupResolver(accountSchema)
  })

  const handleClose = () => {
    setFormData(initialData)
    dispatch(REMOVE_merchantPopUp())
  }
  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const handleConfirmation = value => {
    handleClose()
    setUserInput(value)
    setSecondDialogOpen(true)
  }

  const handleInputImageChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])
      if (reader.result !== null) {
        setInputValue(reader.result)
      }
    }
  }

  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/15.png')
  }

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const [loading, setLoading] = useState(false)

  return (
    <Grid container spacing={6} show={handleDialogToggle}>
      <Grid item xs={12}>
        <Formik
          initialValues={{
            description_ar: props.item === undefined ? '' : props.item.description_ar,
            name_ar: props.item === undefined ? '' : props.item.name_ar,
            description_en: props.item === undefined ? '' : props.item.description_en,
            name_en: props.item === undefined ? '' : props.item.name_en,
            logo: props.item === undefined ? '' : props.item.logo
          }}
          form
          onSubmit={e => {
            e.preventDefault()
          }}
          validationSchema={accountSchema}
        >
          {({ values, errors, handleChange, handleChangecolor, handleSubmit, isValid, setFieldValue }) => (
            <>
              {console.log(errors)}
              <form
                className='auth'
                onSubmit={async e => {
                  e.preventDefault()
                  setLoading(true)
                  if (!isValid) {
                    return
                  }

                  // dispatch(SET_Coupon(values))
                  console.log(values, 'values are here ')
                  console.log(values.logo, imgSrc, 'logo are here ')
                  values.description_ar == '' ? delete values.description_ar : values.description_ar
                  values.description_en == '' ? delete values.description_en : values.description_en

                  console.log(values.logo)
                  console.log(props.item.logo)
                  try {
                    const res = await axios

                      .post(
                        `${process.env.API_URL}/api/images/upload?merchant=${values.name_en}`,
                        { image: values.logo == props.item.logo ? BufferImage : values.logo },

                        {
                          withCredentials: true,
                          onUploadProgress: progressEvent => {
                            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
                            localStorage.setItem('s', progress)
                          },
                          headers: {
                            'Content-Type': 'multipart/form-data'
                          }
                        }
                      )
                      .then(res => {
                        console.log(res.data)
                        setFieldValue('logo', res.data)
                        console.log(values)
                        const newData = { ...values }
                        newData.logo = res.data
                        if (props.item == undefined) {
                          axios
                            .post(`${apiUrl}`, newData)
                            .then(response => {
                              // Handle the response
                              console.log('Response:', response.data)
                            })
                            .catch(error => {
                              console.log(error)
                              if (error.response) {
                                // The request was made and the server responded with a status code
                                console.error('Response Data:', error.response.data)
                                console.error('Status Code:', error.response.status)
                              } else if (error.request) {
                                // The request was made but no response was received
                                console.error('No response received.')
                              } else {
                                // Something happened in setting up the request
                                console.error('Error:', error.message)
                              }
                            })
                            .finally(End => {
                              setLoading(false)
                            })
                        } else {
                          axios
                            .put(`http://localhost:3002/api/merchant/${props.item._id}`, newData, {
                              withCredentials: true
                            })
                            .then(response => {
                              // Handle the response
                              console.log('Response:', response.data)
                              toast.success(response.data.message)
                              setrefresh(refresh + 1)
                              handleClickClose(false)
                            })
                            .catch(error => {
                              console.log(error)
                              if (error.response) {
                                // The request was made and the server responded with a status code
                                console.error('Response Data:', error.response.data)
                                console.error('Status Code:', error.response.status)
                              } else if (error.request) {
                                // The request was made but no response was received
                                console.error('No response received.')
                              } else {
                                // Something happened in setting up the request
                                console.error('Error:', error.message)
                              }
                            })
                            .finally(End => {
                              setLoading(false)
                            })
                        }
                      })
                  } catch (e) {
                    console.log(e)
                    setLoading(false)

                    return toast.error(e.message)
                  }
                }}
              >
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Controller
                        name='logo'
                        control={accountControl}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <div>
                            {/* {imageSrc && <ImgStyled src={imageSrc} alt='Profile Pic' />} */}
                            <ImgStyled src={imgSrc} alt='Profile Pic' />

                            <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                              Upload New Photo
                              <input
                                hidden
                                type='file'
                                value={inputValue}
                                accept='image/png, image/jpeg'
                                onChange={e => {
                                  {
                                    if (e.target.files[0]) {
                                      const resizedImage = e.target.files[0]
                                      console.log(resizedImage, 'iiiiimg')
                                      setImgSrc(resizedImage)
                                      setFieldValue('logo', resizedImage)
                                      handleInputImageChange(e)
                                    }
                                  }
                                }}
                                id='account-settings-upload-image'
                              />
                            </ButtonStyled>
                            <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputImageReset}>
                              Reset
                            </ResetButtonStyled>
                            <Typography sx={{ mt: 4, color: 'text.disabled' }}>
                              Allowed PNG or JPEG. Max size of 800K.
                            </Typography>
                          </div>
                        )}
                      />
                    </Box>
                  </Grid>
                  {/* <Grid item xs={12} sm={8}>
                      <Divider />
                    </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='name_ar'
                      control={accountControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={values.name_ar}
                          label='Arabic Name'
                          onChange={e => {
                            setFieldValue('name_ar', e.target.value)
                          }}
                          aria-describedby='stepper-linear-account-name_ar'
                          error={Boolean(errors.name_ar)}
                          helperText={
                            Boolean(errors.name_ar) &&
                            (errors.name_ar === 'Please enter a valid Arabic name'
                              ? 'Please enter a valid Arabic name'
                              : errors.name_ar === 'Arabic name is required'
                              ? 'This field is required'
                              : null)
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='name_en'
                      control={accountControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          type='name_en'
                          value={values.name_en}
                          label='English Name'
                          aria-describedby='stepper-linear-account-name_en'
                          onChange={e => setFieldValue('name_en', e.target.value)}
                          error={Boolean(errors.name_en)}
                          helperText={
                            Boolean(errors.name_en) &&
                            (errors.name_en === 'Please enter a valid English name'
                              ? 'Please enter a valid English name'
                              : errors.name_en === 'English name is required'
                              ? 'This field is required'
                              : null)
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='description_en'
                      control={accountControl}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          type='text'
                          rows={4}
                          multiline
                          value={values.description_en}
                          label='English Description'
                          onChange={e => setFieldValue('description_en', e.target.value)}
                          aria-describedby='stepper-linear-account-description_en'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='description_ar'
                      control={accountControl}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          rows={4}
                          multiline
                          type='text'
                          value={values.description_ar}
                          label='Arabic Description'
                          onChange={e => setFieldValue('description_ar', e.target.value)}
                          aria-describedby='stepper-linear-account-description_ar'
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                {props.item !== undefined && (
                  <DialogActions
                    sx={{
                      justifyContent: 'center',
                      px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                      pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                  >
                    <LoadingButton loading={loading} variant='contained' sx={{ mr: 1 }} type='submit'>
                      Submit
                    </LoadingButton>
                    <Button variant='tonal' color='secondary' onClick={() => handleClickClose(false)}>
                      Cancel
                    </Button>
                  </DialogActions>
                )}
              </form>
            </>
          )}
        </Formik>
      </Grid>
    </Grid>
  )
}

export default TabAccount
