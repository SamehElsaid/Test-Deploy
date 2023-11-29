import { useState, useEffect, Fragment, forwardRef } from 'react'
import Fade from '@mui/material/Fade'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import axios from 'axios'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormHelperText,
  Switch,
  Tooltip
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { styled } from '@mui/material/styles'
import { Formik } from 'formik'
import { LoadingButton } from '@mui/lab'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import TableHeader from 'src/Components/TableHeader/TableHeader'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const steps = [
  {
    title: 'Branch Details'
  },
  {
    title: 'Address Info'
  },
  {
    title: 'Delivery Info'
  },

  {
    title: 'Working Hours '
  }
]

const Category = ({ apiData }) => {
  const initialData = {
    name_ar: '',
    name_en: '',
    image: '',
    description_ar: '',
    description_en: '',
    status: 'true'
  }

  // Initialize formData with initialData

  // ** State
  const [formData, setFormData] = useState(initialData)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [activeStep, setActiveStep] = useState(0)
  const [imgSrc, setImgSrc] = useState('/images/avatars/15.png')
  const [inputValue, setInputValue] = useState('')
  const [rowData, setRowData] = useState([])
  const [Editeddata, setEditeddata] = useState('')
  const [checked, setChecked] = useState(true)
  const [value, setValue] = useState('')
  const [filteredRows, setFilteredRows] = useState(rowData)
  const [loading, setLoading] = useState(false)
  const [showErro, setShowErro] = useState(false)
  const [BufferImage, setBufferImage] = useState('')
  const { messages } = useIntl()
  const { locale } = useRouter()
  const [showCategoryDelete, setShowCategoryDelete] = useState(false)
  const [CategoryId, setCategoryId] = useState('')

  const [Refresh, setRefresh] = useState(0)
  useEffect(() => {
    axios
      .get(`${process.env.API_URL}/api/category`, { withCredentials: true })
      .then(res => {
        const formattedData = res.data.map((row, index) => ({
          ...row,
          id: row._id || index // Use _id if available, otherwise use index
        }))
        console.log(formattedData)
        setRowData(formattedData)
      })
      .catch(err => {
        console.log(err)

        setRowData(false)
      })
  }, [Refresh])

  const CategoryScheme = yup.object().shape({
    // name_ar: yup.string().required(locale === 'ar' ? 'مهم' : 'req'),
    name_ar: yup.string().required(messages.required),
    name_en: yup.string().required(messages.required)
  })

  const setEdited = data => {
    axios
      .get(`${process.env.API_URL}/api/images/download/${data.image}`, {
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
  }

  const [loadingRows, setLoadingRows] = useState({})

  const Deleteing = data => {
    setLoadingRows(prevLoadingRows => ({
      ...prevLoadingRows,
      [data]: true
    }))

    // Simulate an asynchronous operation (e.g., an API call)
    setTimeout(() => {
      // Reset loading to false for the specific row when the operation is complete
      setLoadingRows(prevLoadingRows => ({
        ...prevLoadingRows,
        [data]: false
      }))
      axios
        .delete(`${process.env.API_URL}/api/category/${data}`, { withCredentials: true })
        .then(response => {
          // Handle the response
          console.log('Response:', response.data)
          if (response.status == 200) {
            console.log(response.data)
            toast.success(locale === 'ar' ? 'تم الالغاء بنجاح ' : 'Deleted successfully')

            setRefresh(Refresh + 1)
          }
        })
        .catch(error => {
          if (error.response?.data.message.includes('E11000 duplicate key error collection')) {
            toast.error('this category is already exist ')
          }
          console.log(error)
          if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Response Data:', error.response?.data)
            console.error('Status Code:', error.response?.status)
          } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received.')
          } else {
            // Something happened in setting up the request
            console.error('Error:', error.message)
          }
        })
    }, 3000)

    setShowCategoryDelete(false)
  }

  const columns = [
    {
      flex: 0.25,
      minWidth: 280,
      field: 'name_ar',
      headerName: locale === 'ar' ? 'الاسم بالعربية' : 'Arabic Name',
      renderCell: ({ row }) => {
        const { name_ar } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component={Link}
                href='/apps/user/view/account'
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {name_ar}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 170,
      field: 'name_en',
      headerName: locale === 'ar' ? 'الاسم بالانجليزيه' : 'English Name',

      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.name_en}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 170,
      field: 'color',
      headerName: locale === 'ar' ? 'الحالة ' : 'Status',
      renderCell: params => {
        const { row } = params

        return (
          <CustomChip
            rounded
            size='small'
            skin='light'
            color={row.status == 'active' ? 'success' : 'warning'}
            label={row.status}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: locale === 'ar' ? 'الاجراءات ' : 'Actions',

      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Invoice'>
            <IconButton
              size='small'
              onClick={() => {
                setShowCategoryDelete(true)
                setCategoryId(params.row._id)
              }}
              disabled={loadingRows[params.row._id]}
            >
              {loadingRows[params.row._id] ? (
                <CircularProgress size={20} color='inherit' />
              ) : (
                <Icon icon='tabler:trash' />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title='View'>
            <IconButton
              size='small'
              onClick={() => {
                console.log(params.row)

                if (params.row.image !== '/images/avatars/15.png') {
                  setEdited({ ...params.row })
                }

                setEditeddata({ ...params.row })
                setAddUserOpen(true)

                if (params.row.status == 'active') {
                  setChecked(true)
                  console.log(checked)
                } else {
                  setChecked(false)
                  console.log(checked)
                }

                // setChecked(Editeddata.status == 'active' ? true : false)

                // console.log(params.row)

                // formikRef.current ? formikRef.current.setValues(params.row) : console.log('nothing')
              }}
            >
              <Icon icon='tabler:edit' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const handleInputImageChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => {
        setImgSrc(reader.result)
      }
      reader.readAsDataURL(files[0])
      if (reader.result !== null) {
        setInputValue(reader.result)
      }
    }
  }

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    if (activeStep === steps.length - 1) {
      toast.success('Form Submitted')
    }
  }

  const handleReset = () => {
    setFormData(initialData)
    setAddUserOpen(false)
  }

  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/15.png')
  }

  const schema = yup.object().shape({
    email: yup.string().email().required()
  })

  const ImgStyled = styled('img')(({ theme }) => ({
    width: 100,
    height: 100,
    borderRadius: theme.shape.borderRadius
  }))

  const ButtonStyled = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  const ResetButtonStyled = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  const {
    reset: accountReset,
    control: accountControl,
    handleSubmit: handleAccountSubmit,
    formState: { errors: accountErrors }
  } = useForm({
    defaultValues: {},
    resolver: yupResolver(CategoryScheme)
  })

  const toggleAddUserDrawer = () => {
    setAddUserOpen(!addUserOpen)
    setEditeddata('')
    setImgSrc('/images/avatars/15.png')
  }
  const title = 'Add new Category'
  const Search = 'Search Category '

  const CustomCloseButton = styled(IconButton)(({ theme }) => ({
    top: 0,
    right: 0,
    color: 'grey.500',
    position: 'absolute',
    boxShadow: theme.shadows[2],
    transform: 'translate(10px, -10px)',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${theme.palette.background.paper} !important`,
    transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
    '&:hover': {
      transform: 'translate(7px, -5px)'
    }
  }))

  const SubmitData = async (values, actions) => {
    console.log(values, 'values are here ')
    console.log(values.logo, imgSrc, 'logo are here ')
    const newData = { ...values }

    newData.status = newData.status == true ? 'active' : 'inactive'
    if (newData.description_ar == '') delete newData.description_ar
    if (newData.description_en == '') delete newData.description_en
    if (newData.image == '') delete newData.image
    if (newData.image !== '/images/avatars/15.png') {
      try {
        const res = await axios
          .post(
            `${process.env.API_URL}/api/images/upload`,
            { image: values.image == Editeddata.image ? BufferImage : values.image },

            {
              withCredentials: true,
              onUploadProgress: progressEvent => {
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
              },
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          )
          .then(res => {
            newData.image = res.data
            if (Editeddata == '') {
              axios
                .post(`${process.env.API_URL}/api/category/`, newData, { withCredentials: true })
                .then(response => {
                  if (response.status == 200) {
                    toast.success(response.data.message)
                    setAddUserOpen(false)
                    setRefresh(Refresh + 1)
                  }
                })
                .catch(error => {
                  if (error.response.data.message.includes('E11000 duplicate key error collection')) {
                    toast.error(locale === 'ar' ? 'هذه الفئة موجودة بالفعل ' : 'this category is already exist ')
                  }
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
                  setLoading(false)
                })
                .finally(End => {
                  setLoading(false)
                })
            } else {
              axios
                .put(`${process.env.API_URL}/api/category/${Editeddata._id}`, newData, { withCredentials: true })
                .then(response => {
                  if (response.status == 200) {
                    toast.success(response.data.message)
                    setAddUserOpen(false)
                    setRefresh(Refresh + 1)
                  }
                })
                .catch(error => {
                  if (error?.response?.message?.includes('E11000 duplicate key error collection')) {
                    toast.error(locale === 'ar' ? 'هذه الفئة موجودة بالفعل ' : 'this category is already exist ')
                  }
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
                  setLoading(false)
                })
                .finally(End => {
                  setLoading(false)
                })
            }
          })
      } catch (e) {
        return console.log(e)
      }
    } else {
      if (Editeddata == '') {
        axios
          .post(`${process.env.API_URL}/api/category`, newData, { withCredentials: true })
          .then(response => {
            if (response.status == 200) {
              toast.success(response.data.message)
              setAddUserOpen(false)
              setRefresh(Refresh + 1)
            }
          })
          .catch(error => {
            if (error.response.data.message.includes('E11000 duplicate key error collection')) {
              toast.error(locale === 'ar' ? 'هذه الفئة موجودة بالفعل ' : 'this category is already exist ')
            }
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
            setLoading(false)
          })
          .finally(End => {
            setLoading(false)
          })
      } else {
        axios
          .put(`${process.env.API_URL}/api/category/${Editeddata._id}`, newData, { withCredentials: true })
          .then(response => {
            if (response.status == 200) {
              toast.success(response.data.message)
              setAddUserOpen(false)
              setRefresh(Refresh + 1)
            }
          })
          .catch(error => {
            if (error?.response?.message?.includes('E11000 duplicate key error collection')) {
              toast.error(locale === 'ar' ? 'هذه الفئة موجودة بالفعل ' : 'this category is already exist ')
            }
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
            setLoading(false)
          })
          .finally(End => {
            setLoading(false)
          })
      }
    }
  }

  const handleFilter = val => {
    setValue(val)

    const newFilteredRows = rowData.filter(row => {
      // Customize this logic based on your data structure and search requirements
      return val !== ''
        ? row.name_en.toLowerCase().includes(val.toLowerCase()) || row.name_ar.toLowerCase().includes(val.toLowerCase())
        : ''
    })

    setFilteredRows(newFilteredRows)
  }

  const handleDialogToggle = () => setShowCategoryDelete(!showCategoryDelete)

  const getStepContent = () => {
    return (
      <Formik
        initialValues={{
          name_ar: Editeddata == '' ? '' : Editeddata.name_ar,
          name_en: Editeddata == '' ? '' : Editeddata.name_en,
          image: Editeddata == '' ? imgSrc : Editeddata.image,
          description_ar: Editeddata == '' ? '' : Editeddata.description_ar,
          description_en: Editeddata == '' ? '' : Editeddata.description_en,
          status: Editeddata == '' ? true : Editeddata.status
        }}
        form
        onSubmit={e => {
          e.preventDefault()

          console.log(errors)
          console.log(values)
        }}
        validationSchema={CategoryScheme}
      >
        {({ values, errors, handleChange, handleChangecolor, handleSubmit, isValid, setFieldValue }) => (
          <>
            {console.log(errors)}
            {console.log(Editeddata)}
            <form
              className='auth'
              onSubmit={async e => {
                e.preventDefault()
                console.log(errors)
                if (!isValid) {
                  return setShowErro(true)
                }
                setLoading(true)
                SubmitData(values)
              }}
            >
              <Grid container className='controlChangeRtl' spacing={5}>
                <Grid item xs={12} sm={12}>
                  <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Controller
                        name='image'
                        control={accountControl}
                        render={({ field: { value, onChange } }) => (
                          <div>
                            <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Grid>
                                <ButtonStyled component='label' htmlFor='account-settings-upload-image'>
                                  <ImgStyled src={imgSrc} alt='Profile Pic' />
                                  <input
                                    hidden
                                    type='file'
                                    value={inputValue}
                                    accept='image/png, image/jpeg'
                                    sx={{ margin: 0 }}
                                    onChange={e => {
                                      {
                                        if (e.target.files[0]) {
                                          const resizedImage = e.target.files[0]
                                          console.log(resizedImage, 'iiiiimg')
                                          setImgSrc(resizedImage)
                                          setFieldValue('image', resizedImage)
                                          handleInputImageChange(e)
                                        }
                                      }
                                    }}
                                    id='account-settings-upload-image'
                                  />
                                </ButtonStyled>
                                {errors.image && (showErro ? true : values.image.length !== 0) && (
                                  <FormHelperText
                                    sx={{
                                      fontSize: '13px',
                                      color: '#EA5455',
                                      textAlign: locale === 'ar' ? 'right' : 'left'
                                    }}
                                  >
                                    {errors.image}
                                  </FormHelperText>
                                )}
                              </Grid>
                              <Grid sx={{ marginTop: '38px' }}>
                                <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputImageReset}>
                                  {locale === 'ar' ? ' اعاده تعيين' : 'Reset'}
                                </ResetButtonStyled>
                                <Typography sx={{ mt: 2, color: 'text.disabled' }}>
                                  {locale === 'ar'
                                    ? ' مسموح به PNG أو JPEG. الحد الأقصى للحجم 800 ألف. '
                                    : ' Allowed PNG or JPEG. Max size of 800K.'}
                                </Typography>
                              </Grid>
                            </Grid>
                          </div>
                        )}
                      />
                    </Box>
                  </CardContent>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='name_ar'
                    control={accountControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={values.name_ar}
                        label={locale === 'ar' ? 'الاسم بالعربيه' : 'Arabic Name'}
                        onChange={e => {
                          setFieldValue('name_ar', e.target.value)
                        }}
                        aria-describedby='stepper-linear-account-name_ar'
                        error={errors.name_ar && (showErro ? true : values.name_ar.length !== 0)}
                        helperText={
                          Boolean(errors.name_ar && (showErro ? true : values.name_ar.length !== 0)) && errors.name_ar
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
                        label={locale === 'ar' ? 'الاسم بالانجليزيه' : 'English Name'}
                        aria-describedby='stepper-linear-account-name_en'
                        onChange={e => setFieldValue('name_en', e.target.value)}
                        error={errors.name_en && (showErro ? true : values.name_en.length !== 0)}
                        helperText={
                          Boolean(errors.name_en && (showErro ? true : values.name_en.length !== 0)) && errors.name_en
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
                        label={locale === 'ar' ? 'الوصف بالانجليزيه' : 'English Description'}
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
                        label={locale === 'ar' ? 'الوصف بالعربيه' : 'Arabic Description'}
                        onChange={e => setFieldValue('description_ar', e.target.value)}
                        aria-describedby='stepper-linear-account-description_ar'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    labelPlacement='top'
                    sx={{ mr: 50 }}
                    label={locale === 'ar' ? 'الحالة ' : 'Status'}
                    control={
                      <Switch
                        checked={checked}
                        onChange={e => {
                          setChecked(e.target.checked)
                          setFieldValue('status', e.target.checked)

                          setEditeddata(Editeddata => ({
                            ...Editeddata,
                            status: e.target.checked ? 'active' : 'inactive'
                          }))
                          console.log(Editeddata)
                          console.log(e.target.checked)
                        }}
                      />
                    }
                  />
                </Grid>
              </Grid>
              <DialogActions
                sx={{
                  justifyContent: 'center',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                <LoadingButton
                  disabled={values.name_ar == '' || values.name_en == ''}
                  loading={loading}
                  variant='contained'
                  sx={{ mr: 1 }}
                  type='submit'
                >
                  {Editeddata == '' ? (locale === 'ar' ? 'ارسال' : 'Submit') : locale === 'ar' ? 'تعديل' : 'Update'}
                </LoadingButton>
                <Button variant='tonal' color='secondary' onClick={handleReset}>
                  {locale === 'ar' ? 'الغاء' : 'Cancel'}
                </Button>
              </DialogActions>
            </form>
          </>
        )}
      </Formik>
    )
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontalWithDetails.map((item, index) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatsHorizontalWithDetails {...item} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            title={title}
            type={'category'}
            Search={Search}
            handleFilter={handleFilter}
            branch='true'
            toggle={toggleAddUserDrawer}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={value == '' ? rowData : filteredRows}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            localeText={{
              MuiTablePagination: {
                labelDisplayedRows: ({ from, to, count }) =>
                  locale === 'ar' ? `${from} - ${to} من ${count}` : `${from} - ${to} of more than ${count}`,
                labelRowsPerPage: locale === 'ar' ? 'الصفوف لكل صفحة :' : 'Rows per page:'
              },
              columnMenuHideColumn: locale === 'ar' ? 'اخفاء هذا العمود' : 'Hide column',
              columnMenuManageColumns: locale === 'ar' ? 'التحكم في الاعمدة' : 'Manage columns'
            }}
          />
        </Card>
      </Grid>
      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        onClose={() => handleReset(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => handleReset(false)}
        open={addUserOpen}
      >
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            py: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`]
          }}
        >
          <CustomCloseButton onClick={handleReset}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Fragment>
            <Box>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h3' sx={{ mb: 3 }}>
                  {locale === 'ar' ? ' اضافة فئه جديد' : 'Add New Category'}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {locale === 'ar' ? 'إضافة فئة للمتجر الخاص بك' : 'Add Category for your Merchant'}
                </Typography>
              </Box>
              <CardContent>{getStepContent()}</CardContent>
            </Box>
          </Fragment>
        </DialogContent>
      </Dialog>
      <Dialog
        fullWidth
        maxWidth='sm'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        onClose={handleDialogToggle}
        open={showCategoryDelete}
      >
        <DialogContent
          sx={{
            textAlign: 'center',
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={handleDialogToggle}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Typography variant='h3' component='span' sx={{ mb: 2 }}>
            {locale === 'ar' ? 'حذف الفئة' : 'Delete Category'}
          </Typography>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary' }}>
              {locale === 'ar'
                ? 'هل أنت متأكد من أنك تريد حذف هذه الفئة'
                : 'Are you sure you want to delete this Category'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' color='error' sx={{ mr: 1 }} onClick={() => Deleteing(CategoryId)}>
            {locale === 'ar' ? 'حذف' : 'Delete'}
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleDialogToggle}>
            {locale === 'ar' ? 'الغاء' : 'Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default Category
