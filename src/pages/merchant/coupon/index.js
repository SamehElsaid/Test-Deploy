// ** React Imports
import { useState, useEffect, Fragment, forwardRef } from 'react'
import Fade from '@mui/material/Fade'
import 'react-datepicker/dist/react-datepicker.css'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
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
  InputAdornment,
  Switch,
  Tooltip
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { styled } from '@mui/material/styles'
import { Formik } from 'formik'
import DatePicker from 'react-datepicker'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { LoadingButton } from '@mui/lab'
import TableHeader from 'src/Components/TableHeader/TableHeader'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const Copon = ({ apiData, popperPlacement }) => {
  // Initialize formData with initialData

  // ** State
  const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [checked, setChecked] = useState(true)
  const [Branches, setBranchData] = useState([])
  const [Coupons, setCouponData] = useState([])
  const [Merchants, setMerchantData] = useState([])
  const [showErro, setShowErro] = useState(false)
  const [loading, setloading] = useState(false)
  const [EGP, setEgp] = useState('%')
  const { messages } = useIntl()
  const [Editeddata, setEditeddata] = useState('')
  const [Refresh, setRefresh] = useState(0)
  const [filteredRows, setFilteredRows] = useState(Coupons)
  const [showCouponDelete, setShowCouponDelete] = useState(false)
  const [CouponId, setCouponId] = useState('')
  const [date, setDate] = useState(Editeddata === '' ? new Date() : new Date(Editeddata.expiration_date))

  const initialData = {
    title_ar: Editeddata == '' ? '' : Editeddata.title_ar,
    title_en: Editeddata == '' ? '' : Editeddata.title_en,
    code: Editeddata == '' ? '' : Editeddata.code,
    discount: Editeddata == '' ? '' : Editeddata.discount,
    discount_type: Editeddata == '' ? 'percentage' : Editeddata.discount_type,
    status: Editeddata == '' ? 'active' : Editeddata.discount_type,
    branch: Editeddata == '' ? (Branches.length !== 0 ? Branches[0]._id : '') : Editeddata.branch._id,
    expiration_date: Editeddata == '' ? new Date() : Editeddata.expiration_date
  }
  const [formData, setFormData] = useState(initialData)
  console.log(new Date(Editeddata.expiration_date))

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  const { locale } = useRouter()
  const handleDialogToggle = () => setShowCouponDelete(!showCouponDelete)

  const handleFilter = val => {
    setValue(val)

    const newFilteredRows = Coupons.filter(row => {
      // Customize this logic based on your data structure and search requirements
      return val !== '' ? row.code.toLowerCase().includes(val.toLowerCase()) : ''
    })

    setFilteredRows(newFilteredRows)

    // Update the filtered rows
  }

  const CustomInput = forwardRef((props, ref) => {
    return (
      <CustomTextField
        fullWidth
        {...props}
        inputRef={ref}
        label={locale === 'ar' ? ' تاريخ الانتهاء ' : 'ُExpiration Date'}
        autoComplete='off'
      />
    )
  })

  const columns = [
    {
      flex: 0.275,
      minWidth: 290,
      field: 'code',
      headerName: locale === 'ar' ? 'الكود' : 'Code',
      renderCell: params => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.code}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.275,
      minWidth: 290,
      field: 'branch',
      headerName: locale === 'ar' ? 'الفرع' : 'Branch',
      renderCell: params => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.branch?.name_en}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.275,
      minWidth: 290,
      field: 'status',
      headerName: 'Status',
      headerName: locale === 'ar' ? 'الحالة' : 'Status',
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
      flex: 0.2,
      minWidth: 120,
      headerName: 'Actions',
      headerName: locale === 'ar' ? 'اجراءات' : 'Actions',

      valueGetter: params => new Date(params.value),
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Invoice'>
            <IconButton
              size='small'
              onClick={() => {
                setShowCouponDelete(true)
                setCouponId(params.row._id)
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
                if (params.row.status == 'active') {
                  setChecked(true)
                  console.log(checked)
                } else {
                  setChecked(false)
                  console.log(checked)
                }

                setEditeddata(params.row)
                setAddUserOpen(true)
                console.log(params.row)

                // const TableData = {
                //   sub_items: params.row
                // }
                // setOptionsList(TableData.sub_items.options)
                // console.log(TableData)

                // formikRef.current ? formikRef.current.setValues(TableData) : console.log('nothing')
              }}
            >
              <Icon icon='tabler:edit' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  // Handle Stepper

  const handleReset = () => {
    setFormData(initialData)
    setAddUserOpen(false)
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
        .delete(`${process.env.API_URL}/api/coupon/${data}`)
        .then(response => {
          // Handle the response
          console.log('Response:', response.data)
          if (response.status == 200) {
            toast.success(response.data.message)
            setRefresh(Refresh + 1)
          }
        })
        .catch(error => {
          if (error.response?.data.message.includes('E11000 duplicate key error collection')) {
            toast.error(locale === 'ar' ? 'هذا الكوبون موجودة بالفعل ' : 'this coupon is already exist ')
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
    setShowCouponDelete(false)
  }

  const CoponScheme = yup.object().shape({
    // code: yup.string().required(locale === 'ar' ? 'مهم' : 'req'),
    title_ar: yup.string().required(messages.required),
    title_en: yup.string().required(messages.required),
    code: yup.string().required(messages.required),
    discount: yup.number().required(messages.required),
    discount_type: yup.string().required(messages.required),
    branch: yup.string().required(messages.required)
  })

  const {
    reset: accountReset,
    control: accountControl,
    handleSubmit: handleAccountSubmit,
    formState: { errors: accountErrors }
  } = useForm({
    defaultValues: {},
    resolver: yupResolver(CoponScheme)
  })

  useEffect(() => {
    axios
      .get(`${process.env.API_URL}/api/coupon`, { withCredentials: true })
      .then(res => {
        const coupon = res.data
        console.log(coupon, 'coupons')

        setCouponData(coupon)
      })
      .catch(err => {
        console.log(err)
      })
  }, [Refresh])
  useEffect(() => {
    axios
      .get(`${process.env.API_URL}/api/branch`, { withCredentials: true })
      .then(res => {
        const branch = res.data
        console.log(branch, 'branch')

        setBranchData(branch)
        if (Editeddata !== '') {
          setDate(new Date(Editeddata.expiration_date))
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [Editeddata])

  useEffect(() => {
    axios
      .get(`${process.env.API_URL}/api/merchant`, { withCredentials: true })
      .then(res => {
        const merchant = res.data
        console.log(merchant, 'merchant')

        setMerchantData(merchant)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  const title = 'Add new Coupon'
  const Search = 'Search Coupon '

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

  const getStepContent = () => {
    return (
      <Formik
        initialValues={{
          title_ar: Editeddata == '' ? '' : Editeddata.title_ar,
          title_en: Editeddata == '' ? '' : Editeddata.title_en,
          code: Editeddata == '' ? '' : Editeddata.code,
          discount: Editeddata == '' ? '' : Editeddata.discount,
          discount_type: Editeddata == '' ? 'percentage' : Editeddata.discount_type,
          status: Editeddata == '' ? 'active' : Editeddata.discount_type,
          branch: Editeddata == '' ? (Branches.length !== 0 ? Branches[0]._id : '') : Editeddata.branch._id,
          expiration_date: Editeddata == '' ? new Date() : new Date(Editeddata.expiration_date)
        }}
        form
        onSubmit={(values, { resetForm }) => {
          setloading(true)
          onSubmit(values)
        }}
        validationSchema={CoponScheme}
      >
        {({ values, errors, handleChange, handleChangecolor, handleSubmit, isValid, setFieldValue }) => (
          <>
            {console.log(errors)}
            {console.log(values)}
            <form
              className='auth'
              onSubmit={e => {
                e.preventDefault()
                console.log(errors)
                console.log(values)
                if (!isValid) {
                  return
                }

                if (Editeddata == '') {
                  axios
                    .post(`${process.env.API_URL}/api/coupon`, values, { withCredentials: true })
                    .then(response => {
                      if (response.status == 200) {
                        toast.success(response.data.message)

                        setAddUserOpen(false)
                        setRefresh(Refresh + 1)
                      }
                    })
                    .catch(error => {
                      if (error.response?.data.message.includes('E11000 duplicate key error collection')) {
                        return toast.error('this coupon is already exist ')
                      }
                      toast.error(error.message)
                    })
                    .finally(End => {
                      setloading(false)
                    })
                } else {
                  const SubmitedData = { ...values }
                  delete SubmitedData.branch
                  axios
                    .put(`${process.env.API_URL}/api/coupon/${Editeddata._id}`, SubmitedData, { withCredentials: true })
                    .then(response => {
                      if (response.status == 200) {
                        toast.success(response.data.message)
                        setAddUserOpen(false)
                        setRefresh(Refresh + 1)
                      }
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
                      setloading(false)
                    })
                }

                // console.log(values)
                handleSubmit()
              }}
            >
              <Grid container spacing={7}>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    value={values.title_ar}
                    label={locale === 'ar' ? 'العنوان بالعربية' : 'Title (Ar)'}
                    onChange={e => {
                      setFieldValue('title_ar', e.target.value)
                    }}
                    error={errors.title_ar && (showErro ? true : values.title_ar.length !== 0)}
                    helperText={
                      Boolean(errors.title_ar && (showErro ? true : values.title_ar.length !== 0)) && errors.title_ar
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    type='text'
                    value={values.title_en}
                    label={locale === 'ar' ? 'العنوان بالانجليزية' : 'Title(En)'}
                    aria-describedby='stepper-linear-account-title_en'
                    onChange={e => setFieldValue('title_en', e.target.value)}
                    error={errors.title_en && (showErro ? true : values.title_en !== '')}
                    helperText={
                      Boolean(errors.title_en && (showErro ? true : values.title_en !== '')) && errors.title_en
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='code'
                    control={accountControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={values.code}
                        label={locale === 'ar' ? ' الكود' : 'Code'}
                        onChange={e => {
                          setFieldValue('code', e.target.value)
                        }}
                        aria-describedby='stepper-linear-account-code'
                        error={errors.code && (showErro ? true : values.code.length !== '')}
                        helperText={Boolean(errors.code && (showErro ? true : values.code.length !== 0)) && errors.code}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <div>
                    <Controller
                      name='expiration_date'
                      control={accountControl}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DatePicker
                          selected={date}
                          showYearDropdown
                          showMonthDropdown
                          id='form-layouts-tabs-date'
                          placeholderText='DD=MM-YYYY'
                          customInput={<CustomInput />}
                          onChange={date => {
                            setDate(date)
                            console.log(date)
                            setFieldValue('expiration_date', date)
                          }}
                          className='custom-datepicker'
                          sx={{ backgroundColor: '#2f3349', zIndex: 999 }}
                        />
                      )}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <div className='controlChangeRtl'>
                    <CustomAutocomplete
                      fullWidth
                      value={Branches.find(ele => ele._id === values.branch)}
                      options={Branches}
                      getOptionLabel={option => option[`name_${locale}`] || ''}
                      onChange={(e, newValue) => {
                        if (newValue?._id) {
                          setFieldValue('branch', newValue._id)
                        }
                      }}
                      renderInput={params => (
                        <CustomTextField
                          error={errors.branch && (showErro ? true : values.branch.length !== 0)}
                          helperText={
                            Boolean(errors.branch && (showErro ? true : values.branch.length !== 0)) && errors.branch
                          }
                          {...params}
                          label={locale === 'ar' ? 'الفرع' : 'Branch'}
                        />
                      )}
                    />
                  </div>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controller
                    name='discount'
                    control={accountControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='number'
                        value={values.discount}
                        label={locale === 'ar' ? 'خصم' : 'Discount'}
                        sx={{ zIndex: 0 }}
                        onChange={e => setFieldValue('discount', e.target.value)}
                        aria-describedby='stepper-linear-account-discount'
                        error={errors.discount && (showErro ? true : values.discount.length !== 0)}
                        helperText={
                          Boolean(errors.discount && (showErro ? true : values.discount.length !== 0)) &&
                          errors.discount
                        }
                        InputProps={{
                          endAdornment: <InputAdornment position='end'>{EGP}</InputAdornment>
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controller
                    name='discount_type'
                    control={accountControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        select
                        type='text'
                        value={values.discount_type}
                        label={locale === 'ar' ? 'نوع الخصم' : 'Discount Type'}
                        onChange={e => {
                          setFieldValue('discount_type', e.target.value)
                          setEgp(values.discount_type == 'amount' ? '%' : 'EGP')
                        }}
                      >
                        <MenuItem value='percentage'>percentage</MenuItem>
                        <MenuItem value='amount'>amount</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ mt: 4 }}>
                    <Controller
                      name='status'
                      control={accountControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          labelPlacement='right'
                          sx={({ paddingTop: '20px' }, { '& .MuiTypography-root': { color: 'text.secondary' } })}
                          label={
                            locale === 'ar'
                              ? values.status
                                ? 'نشط'
                                : 'غير نشط'
                              : values.status
                              ? 'Active'
                              : 'InActive'
                          }
                          control={
                            <Switch
                              checked={checked}
                              onChange={e => {
                                setChecked(!e.target.checked)
                                setFieldValue('status', e.target.checked == true ? 'active' : 'inactive')
                                console.log(e.target.checked)
                              }}
                              defaultChecked
                            />
                          }
                        />
                      )}
                    />
                  </Box>
                </Grid>
              </Grid>
              <DialogActions
                sx={{
                  justifyContent: 'center',
                  mt: 4,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                <LoadingButton loading={loading} variant='contained' sx={{ mr: 1 }} type='submit'>
                  Submit
                </LoadingButton>
                <Button variant='tonal' color='secondary' onClick={() => handleReset()}>
                  Cancel
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
            Search={Search}
            type='coupon'
            handleFilter={handleFilter}
            branch='true'
            toggle={toggleAddUserDrawer}
            rows={value == '' ? Coupons : filteredRows}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={value == '' ? Coupons : filteredRows}
            getRowId={row => row._id}
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
        onClose={handleReset}
        onBackdropClick={handleReset}
        TransitionComponent={Transition}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
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
                  {locale === 'ar' ? ' اضافة كوبون جديد' : ' Add New Coupon'}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {locale === 'ar' ? ' اضافة كوبون لطلبك' : 'Add Coupon for your Order'}
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
        open={showCouponDelete}
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
            {locale === 'ar' ? 'حذف الكوبون' : 'Delete Coupon'}
          </Typography>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary' }}>
              {locale === 'ar'
                ? 'هل أنت متأكد من أنك تريد حذف هذه الكوبون'
                : 'Are you sure you want to delete this Coupon'}
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
          <Button variant='contained' color='error' sx={{ mr: 1 }} onClick={() => Deleteing(CouponId)}>
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

export default Copon
