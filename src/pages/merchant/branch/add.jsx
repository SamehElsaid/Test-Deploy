import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import dynamic from 'next/dynamic'
import Spinner from 'src/@core/components/spinner'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { BsCalendarDate } from 'react-icons/bs'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Formik } from 'formik'
import { useRouter } from 'next/router'
import { Skeleton, FormHelperText, Tooltip, FormControlLabel, Switch } from '@mui/material'
import PhoneInput from 'react-phone-number-input'
import axios from 'axios'
import { BiCurrentLocation, BiPhoneCall } from 'react-icons/bi'
import { Stack, styled } from '@mui/system'
import { useIntl } from 'react-intl'
import { DataGrid } from '@mui/x-data-grid'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { MuiColorInput } from 'mui-color-input'
import { LoadingButton } from '@mui/lab'
import { v4 as uuidv4 } from 'uuid'
import PickersTime from 'src/Components/DateTimePicker'

const CustomizerSpacing = styled(Button)(({ theme }) => ({
  width: '35px ',
  minWidth: '35px ',
  height: '35px',
  backgroundColor: 'white',
  border: '2px solid #ccc',
  borderRadius: '4px',
  boxShadow: '0px 4px 18px 0px rgba(15, 20, 34, 0.1)',
  position: 'absolute',
  right: '10px',
  top: '45px',
  fontSize: '22px',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'black',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#f4f4f4'
  }
}))

const CustomizerSpacingTwo = styled(Button)(({ theme }) => ({
  width: '35px ',
  minWidth: '35px ',
  height: '35px',
  backgroundColor: 'white',
  border: '2px solid #ccc',
  borderRadius: '4px',
  boxShadow: '0px 4px 18px 0px rgba(15, 20, 34, 0.1)',
  position: 'absolute',
  right: '10px',
  top: '70px',
  fontSize: '22px',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'black',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#f4f4f4'
  }
}))

const Add = () => {
  const [location, setLoaction] = useState(false)
  const [loadingApp, setLoadingApp] = useState(true)
  const [loading, setLoading] = useState(false)
  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const { messages } = useIntl()
  const router = useRouter()
  const { locale } = useRouter()
  const [menu, setMenu] = useState('loading')
  const [initialValues, setInitialValues] = useState(null)
  const [checked, setChecked] = useState(true)

  const {
    query: { epwi }
  } = useRouter()

  const selectMyMap = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          setLoaction([latitude, longitude])
          setTimeout(() => {
            setLoading(true)
          }, 2000)
        },
        _ => {
          if (!loading) {
            setLoaction([30.033333, 31.233334])
          } else {
            toast.error(locale === 'ar' ? 'من فضلك قم بالسامح لنا بتحديد موقعك' : 'Please allow your location')
          }
          setTimeout(() => {
            setLoading(true)
          }, 2000)
        }
      )
    } else {
      toast.error('Geolocation is not supported by your browser.')
      setLoading(true)
    }
  }

  const steps = [
    {
      title: locale === 'ar' ? 'تفاصيل الفرع' : 'Branch Details'
    },
    {
      title: locale === 'ar' ? 'معلومات العنوان' : 'Address Info'
    },
    {
      title: locale === 'ar' ? 'معلومات التوصيل' : 'Delivery Info'
    },

    {
      title: locale === 'ar' ? 'ساعات العمل' : 'Working Hours '
    }
  ]

  const createColumns = (locale, messages, setFieldValue, data) => [
    {
      flex: 0.8,
      minWidth: 200,
      field: 'arabicName',
      sortable: false,
      disableColumnMenu: true,
      headerName: locale === 'ar' ? 'رقم الهاتف' : 'Phone',
      renderCell: ({ row }) => {
        return (
          <Box key={row.id} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component={'div'}
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary'
                }}
              >
                {row.phone}
              </Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.2,
      minWidth: 100,
      sortable: false,
      disableColumnMenu: true,
      field: locale === 'ar' ? 'حذف' : 'Delete',
      renderCell: ({ row: { id } }) => {
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: locale === 'ar' ? 'start' : 'start',
              marginInlineStart: 'auto'
            }}
          >
            <Tooltip title={locale === 'ar' ? 'حذف' : 'Delete'}>
              <IconButton
                size='small'
                onClick={() => {
                  const newData = [...data]
                  const FilterData = newData.filter(old => old.id !== id)
                  setFieldValue('phones', FilterData)
                }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    }
  ]

  const getMenu = async () => {
    try {
      const res = await axios.get(`${process.env.API_URL}/api/menu/all`, { withCredentials: true })
      if (res.data.length === 0) {
        toast.error(locale === 'ar' ? 'من فظلك قم باضافة قائمة قبل فتح فرع' : 'Please create menu first')
        await router.push(`/${locale}/merchant/menu`)
      } else {
        setMenu(res.data)
      }

      return res.data
    } catch (err) {
      toast.error(locale === 'ar' ? 'من فظلك قم باضافة قائمة قبل فتح فرع' : 'Please create menu first')
      await router.push(`/${locale}/merchant/menu`)
    }

    return err
  }

  useEffect(() => {
    getMenu().then(res => {
      if (epwi) {
        axios.get(`${process.env.API_URL}/api/branch/${epwi}`, { withCredentials: true }).then(branch => {
          if (branch.data.status == 'active') {
            setChecked(true)
          } else {
            setChecked(false)
          }
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
          const LastData = []
          const myDays = []
          branch.data.working_hours.forEach(ele => {
            LastData.push(ele.day)
          })
          days.forEach(ele => {
            if (!LastData.includes(ele)) {
              myDays.push(ele)
            }
          })

          setLoaction(branch.data.address.location.coordinates)

          setInitialValues({
            mapErro: false,
            loading: false,
            id: branch.data._id,
            name_ar: branch.data.name_ar,
            name_en: branch.data.name_en,
            color: branch.data.color,
            tax_type: branch.data.tax_type,
            tax: branch.data.tax,
            menu: branch.data.menu,
            phone: '',
            status: branch.data.status,
            phones: branch.data.phones.map(ele => {
              return { phone: ele, id: uuidv4() }
            }),
            country: branch.data.address.country,
            state: branch.data.address.state,
            city: branch.data.address.city,
            street: branch.data.address.street,
            additional_info: branch.data.address.additional_info,
            location: branch.data.address.location,
            tax: branch.data.tax,
            tax_type: branch.data.tax_type,
            delivery_cost: branch.data.delivery_cost,
            extra_km_fee: branch.data.extra_km_fee,
            max_delivery_distance: branch.data.max_delivery_distance,
            delivery_area: {
              type: 'Polygon',
              coordinates: branch.data.delivery_area.coordinates.map(ele => {
                return [
                  ...ele.map(num => {
                    return { lat: num[0], lng: num[1] }
                  })
                ]
              })
            },
            old_delivery_area: {
              type: 'Polygon',
              coordinates: branch.data.delivery_area.coordinates.map(ele => {
                return [
                  ...ele.map(num => {
                    return { lat: num[0], lng: num[1] }
                  })
                ]
              })
            },
            delivery_time: branch.data.delivery_time,
            workingHours: branch.data.working_hours.map(ele => {
              return { days: [ele.day], from: ele.from, to: ele.to, id: uuidv4() }
            }),
            DaysTime: myDays,
            days: [],
            time_from: '',
            time_to: '',
            NewDays: branch.data.working_hours
          })
          setLoadingApp(false)
        })
      } else {
        setInitialValues({
          loading: false,
          mapErro: false,
          name_ar: '',
          name_en: '',
          tax: '',
          tax_type: 'percentage',
          menu: res[0]?._id,
          color: '#fff',
          phone: '',
          phones: [],
          status: 'active',
          state: '',
          city: '',
          additional_info: '',
          street: '',
          country: '',
          showErro: false,
          location: {
            type: 'Point',
            coordinates: []
          },
          delivery_cost: '',
          delivery_time: '',
          DaysTime: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          extra_km_fee: '',
          max_delivery_distance: '',
          workingHours: [],
          delivery_area: {
            type: 'Polygon',
            coordinates: []
          },
          days: [],
          time_from: '',
          time_to: ''
        })
        selectMyMap()
        setLoadingApp(false)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, router, epwi])

  const MenuProps = {
    PaperProps: {
      style: {
        width: 250,
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
      }
    }
  }

  const phoneRegExp = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/

  const MapWithNoSSR = dynamic(() => import('src/Components/Location/Map'), { ssr: false })
  const PolygonMapWithNoSSR = dynamic(() => import('src/Components/Location/PolygonMap'), { ssr: false })

  const Schema = yup.object().shape({
    name_ar: yup.string().required(messages.required),
    name_en: yup.string().required(messages.required),
    tax: yup.number().required(messages.required),
    tax_type: yup.string().required(messages.required),
    color: yup.string().required(messages.required),
    menu: yup.string().required(messages.required),
    phone: yup
      .string()
      .matches(phoneRegExp, `${locale === 'ar' ? 'رقم الهاتف غير صحيح' : 'Phone number is not valid'}`),
    phones: yup
      .array()
      .test(messages.required, messages.required, value => {
        return value.length > 0
      })
      .required(messages.required),

    state: yup.string().required(messages.required),
    city: yup.string().required(messages.required),
    additional_info: yup.string().required(messages.required),
    street: yup.string().required(messages.required),
    country: yup.string().required(messages.required),
    delivery_cost: yup.number().required(messages.required),
    delivery_time: yup.number().required(messages.required),
    extra_km_fee: yup.number().required(messages.required),
    max_delivery_distance: yup.number().required(messages.required),
    workingHours: yup
      .array()
      .test(messages.required, messages.required, value => {
        return value.length > 0
      })
      .required(messages.required),
    time_from: yup.string(),
    time_to: yup.string()
  })

  function getArabicDay(englishDay) {
    const daysMap = {
      Sunday: 'الأحد',
      Monday: 'الاثنين',
      Tuesday: 'الثلاثاء',
      Wednesday: 'الأربعاء',
      Thursday: 'الخميس',
      Friday: 'الجمعة',
      Saturday: 'السبت'
    }
    const arabicDay = locale === 'ar' ? daysMap[englishDay] : englishDay

    return arabicDay ? arabicDay : 'Invalid day'
  }

  const getStepContent = () => {
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { resetForm, setFieldValue }) => {
          setFieldValue('loading', true)
          const valueWork = []
          values.workingHours.forEach(old => {
            old.days.forEach(dayOld => {
              valueWork.push({
                day: dayOld,
                from: old.from,
                to: old.to
              })
            })
          })
          const finishData = { ...values }

          const send = {
            name_ar: finishData.name_ar,
            name_en: finishData.name_en,
            color: finishData.color,
            phones: finishData.phones.map(ele => ele.phone),
            status: finishData.status,
            menu: finishData.menu,
            address: {
              country: finishData.country,
              state: finishData.state,
              city: finishData.city,
              street: finishData.street,
              additional_info: finishData.additional_info,
              location: finishData.location
            },
            tax: finishData.tax,
            tax_type: finishData.tax_type,
            delivery_cost: finishData.delivery_cost,
            extra_km_fee: finishData.extra_km_fee,
            max_delivery_distance: finishData.max_delivery_distance,
            delivery_area: {
              type: 'Polygon',
              coordinates:
                finishData.delivery_area.coordinates.length === 0
                  ? finishData.old_delivery_area.coordinates.map(ele => {
                      return [
                        ...ele.map(num => {
                          return [num.lat, num.lng]
                        })
                      ]
                    })
                  : finishData.delivery_area.coordinates.map(ele => {
                      return [
                        ...ele.map(num => {
                          return [num.lat, num.lng]
                        }),
                        [finishData.delivery_area.coordinates[0][0].lat, finishData.delivery_area.coordinates[0][0].lng]
                      ]
                    })
            },
            delivery_time: finishData.delivery_time,
            working_hours: valueWork
          }
          if (epwi) {
            axios
              .put(`${process.env.API_URL}/api/branch/${epwi}`, send, { withCredentials: true })
              .then(res => {
                toast.success(locale === 'ar' ? 'تم تعديل الفرع' : 'Branch has been edit')
                router.push(`/${locale}/merchant/branch`)
              })
              .catch(err => {
                toast.error(err.messages)
              })
              .finally(e => {
                setFieldValue('loading', false)
              })
          } else {
            if (send.address.location.coordinates.length === 0) {
              send.address.location.coordinates = location
            }
            axios
              .post(`${process.env.API_URL}/api/branch`, send, { withCredentials: true })
              .then(res => {
                toast.success(locale === 'ar' ? 'تم انشاء الفرع' : 'Branch has been created')
                router.push(`/${locale}/merchant/branch`)
                resetForm()
              })
              .catch(err => toast.error(err.messages))
              .finally(e => {
                setFieldValue('loading', false)
              })
          }
        }}
        validationSchema={Schema}
      >
        {({ values, errors, handleSubmit, isValid, setFieldValue, resetForm }) => (
          <form
            onSubmit={e => {
              e.preventDefault()
              if (values.delivery_area.coordinates.length === 0) {
                if (epwi) {
                } else {
                  toast.error(
                    locale === 'ar'
                      ? 'من فضلك قم بتحديد منطقة التوصيل علي الخريطة'
                      : 'Please Select the delivery area on the map.'
                  )

                  return setFieldValue('mapErro', true)
                }
              } else {
                setFieldValue('mapErro', false)
              }

              if (!isValid) {
                return setFieldValue('showErro', true)
              }
              if (values.location.length === 0) {
                setFieldValue('location', {
                  type: 'Point',
                  coordinates: location
                })
              }
              handleSubmit()
            }}
          >
            <Card sx={{ mb: 5 }}>
              <CardContent>
                <Grid item xs={12}>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', mb: 5, fontSize: '20px' }}>
                    {steps[0].title}
                  </Typography>
                </Grid>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label={messages.arName}
                      value={values.name_ar}
                      onChange={e => {
                        setFieldValue('name_ar', e.target.value)
                      }}
                      error={errors.name_ar && (values.showErro ? true : values.name_ar.length !== 0)}
                      helperText={
                        Boolean(errors.name_ar && (values.showErro ? true : values.name_ar.length !== 0)) &&
                        errors.name_ar
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      type='name_en'
                      value={values.name_en}
                      label={messages.enName}
                      onChange={e => setFieldValue('name_en', e.target.value)}
                      error={Boolean(errors.name_en && (values.showErro ? true : values.name_en.length !== 0))}
                      helperText={
                        Boolean(errors.name_en && (values.showErro ? true : values.name_en.length !== 0)) &&
                        errors.name_en
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      value={values.tax}
                      label={locale === 'ar' ? 'الضريبة' : 'Tax'}
                      onChange={e => setFieldValue('tax', e.target.value)}
                      error={Boolean(errors.tax && (values.showErro ? true : values.tax.length !== 0))}
                      helperText={
                        Boolean(errors.tax && (values.showErro ? true : values.tax.length !== 0)) && errors.tax
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      select
                      type='text'
                      value={values.tax_type}
                      label={locale === 'ar' ? 'نوع الضريبة ' : 'Tax Type'}
                      onChange={e => {
                        setFieldValue('tax_type', e.target.value)
                      }}
                    >
                      <MenuItem value='percentage'>{locale === 'ar' ? 'النسبة المئوية' : 'percentage'}</MenuItem>
                      <MenuItem value='fixed'>{locale === 'ar' ? 'جنية' : 'fixed'}</MenuItem>
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div style={{ marginTop: '-4px' }}>
                      <label htmlFor='color' style={{ display: 'block', fontSize: '13px' }}>
                        {locale === 'ar' ? 'اللون' : 'Color'}
                      </label>
                      <MuiColorInput
                        id='color'
                        format='hex'
                        style={{ width: '100%', marginTop: '4px' }}
                        value={values.color}
                        onChange={color => {
                          setFieldValue('color', color)
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomAutocomplete
                      fullWidth
                      value={menu.find(ele => ele._id === values.menu)}
                      getOptionLabel={option => option.menu_name || ''}
                      options={menu}
                      onChange={(e, newValue) => {
                        if (newValue?._id) {
                          setFieldValue('menu', newValue._id)
                        } else {
                          setFieldValue('category', '')
                        }
                      }}
                      renderOption={(props, option) => (
                        <Box component='li' {...props} key={option._id}>
                          {option.menu_name}
                        </Box>
                      )}
                      renderInput={params => (
                        <>
                          <CustomTextField {...params} label={locale === 'ar' ? 'القائمة' : 'Menu'} />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mt: 4 }}>
                      <FormControlLabel
                        sx={({ paddingTop: '20px' }, { '& .MuiTypography-root': { color: 'text.secondary' } })}
                        label={
                          values.status === 'active'
                            ? locale === 'ar'
                              ? 'نشط'
                              : 'active'
                            : locale === 'ar'
                            ? 'غير نشط'
                            : 'inactive'
                        }
                        control={
                          <Switch
                            checked={values.status === 'active'}
                            onChange={e => {
                              setFieldValue('status', e.target.checked ? 'active' : 'inactive')
                            }}
                            disableRipple={false}
                          />
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card sx={{ mb: 5 }}>
              <CardContent>
                <Grid item xs={12}>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', mb: 5, fontSize: '20px' }}>
                    {locale === 'ar' ? ' الهواتف' : 'Phones'}
                  </Typography>
                </Grid>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={12}>
                    <>
                      <label className='PhoneLabel' sx={{ marginBottom: '6px' }}>
                        {locale === 'ar' ? 'رقم الهاتف' : 'Phone'}
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          marginTop: '-2px',
                          width: '100%'
                        }}
                      >
                        <PhoneInput
                          defaultCountry='EG'
                          className='phoneNumber'
                          placeholder='123-456-7890'
                          value={values.phone}
                          onChange={e => {
                            setFieldValue('phone', e)
                          }}
                        />
                        {console.log(values)}
                        <Button
                          variant='contained'
                          disabled={!(!errors.phone && values.phone?.length !== 0)}
                          onClick={() => {
                            if (!errors.phone) {
                              setFieldValue('phone', '')
                              setFieldValue('phones', [...values.phones, { phone: values.phone, id: uuidv4() }])
                            }
                          }}
                        >
                          {locale === 'ar' ? 'أضافة' : 'Add'}
                        </Button>
                      </div>
                      {errors.phone && (values.showErro ? true : values.phone?.length !== 0) && (
                        <FormHelperText sx={{ fontSize: '13px', color: '#EA5455' }}>{errors.phone}</FormHelperText>
                      )}
                    </>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <DataGrid
                      key={locale}
                      autoHeight
                      rowHeight={62}
                      hideFooter
                      components={{
                        NoRowsOverlay: () => (
                          <Stack height='100%' alignItems='center' flexDirection='row' gap={2} justifyContent='center'>
                            <BiPhoneCall style={{ fontSize: '30px' }} />
                            <h2> {locale === 'ar' ? 'لا يوجد هاتف' : 'No Phone'}</h2>{' '}
                          </Stack>
                        )
                      }}
                      rows={values.phones}
                      columns={createColumns(locale, messages, setFieldValue, values.phones)}
                      disableRowSelectionOnClick
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
                    {errors.phones && (values.showErro ? true : values.phones.length !== 0) && (
                      <FormHelperText sx={{ fontSize: '13px', color: '#EA5455' }}>{errors.phones}</FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card sx={{ mb: 5 }}>
              <CardContent>
                <Grid item xs={12}>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', mb: 5, fontSize: '20px' }}>
                    {steps[1].title}
                  </Typography>
                </Grid>
                <Grid
                  container
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexDirection: { xs: 'column-reverse', md: 'row' }
                  }}
                >
                  <Grid item xs={12} md={6} sx={{ marginTop: '50px' }}>
                    <CustomTextField
                      fullWidth
                      value={values.state}
                      label={locale === 'ar' ? 'المنطقة' : 'State'}
                      onChange={e => setFieldValue('state', e.target.value)}
                      error={errors.state && (values.showErro ? true : values.state.length !== 0)}
                      helperText={
                        Boolean(errors.state && (values.showErro ? true : values.state.length !== 0)) && errors.state
                      }
                    />

                    <CustomTextField
                      fullWidth
                      sx={{ mt: 4 }}
                      value={values.city}
                      label={locale === 'ar' ? 'المدينة' : 'City'}
                      onChange={e => setFieldValue('city', e.target.value)}
                      error={errors.city && (values.showErro ? true : values.city.length !== 0)}
                      helperText={
                        Boolean(errors.city && (values.showErro ? true : values.city.length !== 0)) && errors.city
                      }
                    />
                    <CustomTextField
                      fullWidth
                      sx={{ mt: 4 }}
                      value={values.country}
                      label={locale === 'ar' ? 'البلد' : 'Country'}
                      onChange={e => setFieldValue('country', e.target.value)}
                      id='stepper-linear-personal-country'
                      error={errors.country && (values.showErro ? true : values.country.length !== 0)}
                      helperText={
                        Boolean(errors.country && (values.showErro ? true : values.country.length !== 0)) &&
                        errors.country
                      }
                    />

                    <CustomTextField
                      fullWidth
                      sx={{ mt: 4 }}
                      value={values.street}
                      label={locale === 'ar' ? 'الشارع' : 'Street'}
                      onChange={e => setFieldValue('street', e.target.value)}
                      error={errors.street && (values.showErro ? true : values.street.length !== 0)}
                      helperText={
                        Boolean(errors.street && (values.showErro ? true : values.street.length !== 0)) && errors.street
                      }
                    />
                    <CustomTextField
                      fullWidth
                      sx={{ mt: 4 }}
                      value={values.additional_info}
                      label={locale === 'ar' ? 'معلومات إضافية' : 'Additional info'}
                      onChange={e => setFieldValue('additional_info', e.target.value)}
                      error={errors.additional_info && (values.showErro ? true : values.additional_info.length !== 0)}
                      helperText={
                        Boolean(
                          errors.additional_info && (values.showErro ? true : values.additional_info.length !== 0)
                        ) && errors.additional_info
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={5} sx={{ width: '100%', padding: { md: '0 !important' } }}>
                    <Box sx={{ height: '100%', width: '100% !important', minHeight: '300px', position: 'relative' }}>
                      {!location && (
                        <Skeleton
                          animation='wave'
                          variant='h4'
                          height={10}
                          width='100%'
                          style={{ width: '100% !important', height: '100%' }}
                        />
                      )}
                      {location && (
                        <CustomizerSpacing style={{ zIndex: 555 }} onClick={selectMyMap}>
                          <BiCurrentLocation />
                        </CustomizerSpacing>
                      )}
                      {location && <MapWithNoSSR location={location} setFieldValue={setFieldValue} />}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card sx={{ mb: 5 }}>
              <CardContent>
                <Grid item xs={12}>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', mb: 5, fontSize: '20px' }}>
                    {steps[2].title}
                  </Typography>
                </Grid>
                <Grid
                  container
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexDirection: { xs: 'column-reverse', md: 'row' }
                  }}
                >
                  <Grid item xs={12} md={6} sx={{ marginTop: '50px' }}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      value={values.delivery_cost}
                      label={locale === 'ar' ? 'تكلفة التوصيل' : 'Delivery cost'}
                      onChange={e => setFieldValue('delivery_cost', e.target.value)}
                      error={Boolean(
                        errors.delivery_cost && (values.showErro ? true : values.delivery_cost.length !== 0)
                      )}
                      helperText={
                        Boolean(errors.delivery_cost && (values.showErro ? true : values.delivery_cost.length !== 0)) &&
                        errors.delivery_cost
                      }
                    />
                    <CustomTextField
                      fullWidth
                      type='number'
                      sx={{ mt: 4 }}
                      value={values.delivery_time}
                      label={locale === 'ar' ? 'وقت التوصيل' : 'Delivery Time'}
                      onChange={e => setFieldValue('delivery_time', e.target.value)}
                      error={Boolean(
                        errors.delivery_time && (values.showErro ? true : values.delivery_time.length !== 0)
                      )}
                      helperText={
                        Boolean(errors.delivery_time && (values.showErro ? true : values.delivery_time.length !== 0)) &&
                        errors.delivery_time
                      }
                    />

                    <CustomTextField
                      fullWidth
                      sx={{ mt: 4 }}
                      value={values.extra_km_fee}
                      label={locale === 'ar' ? 'رسوم الكيلومترات الإضافية' : 'Extra km fee'}
                      type='number'
                      onChange={e => setFieldValue('extra_km_fee', e.target.value)}
                      id='stepper-linear-personal-extra_km_fee'
                      error={Boolean(
                        errors.extra_km_fee && (values.showErro ? true : values.extra_km_fee.length !== 0)
                      )}
                      helperText={
                        Boolean(errors.extra_km_fee && (values.showErro ? true : values.extra_km_fee.length !== 0)) &&
                        errors.extra_km_fee
                      }
                    />

                    <CustomTextField
                      sx={{ mt: 4 }}
                      fullWidth
                      value={values.max_delivery_distance}
                      label={locale === 'ar' ? 'الحد الأقصى لمسافة التوصيل' : 'Max delivery distance'}
                      type='number'
                      onChange={e => setFieldValue('max_delivery_distance', e.target.value)}
                      id='stepper-linear-personal-max_delivery_distance'
                      error={Boolean(
                        errors.max_delivery_distance &&
                          (values.showErro ? true : values.max_delivery_distance.length !== 0)
                      )}
                      helperText={
                        Boolean(
                          errors.max_delivery_distance &&
                            (values.showErro ? true : values.max_delivery_distance.length !== 0)
                        ) && errors.max_delivery_distance
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={5}
                    sx={{
                      width: '100%',
                      padding: { md: '0 !important' },
                      position: 'relative',
                      minHeight: '300px',
                      border: values.mapErro ? '2px solid #EA5455' : ''
                    }}
                  >
                    {location && (
                      <PolygonMapWithNoSSR
                        delivery_area={
                          values.old_delivery_area?.coordinates ? values.old_delivery_area?.coordinates : null
                        }
                        setFieldValue={setFieldValue}
                        location={location}
                      />
                    )}
                    {location && (
                      <CustomizerSpacingTwo style={{ zIndex: 555 }} onClick={selectMyMap}>
                        <BiCurrentLocation />
                      </CustomizerSpacingTwo>
                    )}
                    {!location && (
                      <Skeleton
                        animation='wave'
                        variant='h4'
                        height={10}
                        width='100%'
                        style={{ width: '100% !important', height: '100%' }}
                      />
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card sx={{ mb: 5 }}>
              <CardContent>
                <Grid item xs={12}>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', mb: 5, fontSize: '20px' }}>
                    {steps[3].title}
                  </Typography>
                </Grid>
                <Grid className='customInput' container sx={{ gap: '10px', justifyContent: 'space-between' }}>
                  <Grid item xs={12} md={4}>
                    <CustomTextField
                      fullWidth
                      select
                      type='text'
                      label={locale === 'ar' ? 'الايام' : 'Days'}
                      onChange={e => setFieldValue('days', e.target.value)}
                      SelectProps={{
                        MenuProps,
                        multiple: true,
                        value: values.days,
                        onChange: e => {
                          setFieldValue('days', e.target.value)
                        }
                      }}
                    >
                      {values.DaysTime.map((name, i) => (
                        <MenuItem key={i} value={name}>
                          {getArabicDay(name)}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <PickersTime
                      setFieldValue={setFieldValue}
                      values={values.time_from}
                      style={{ width: '100% !important' }}
                      label={locale === 'ar' ? 'من' : 'From'}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <PickersTime
                      setFieldValue={setFieldValue}
                      values={values.time_to}
                      label={locale === 'ar' ? 'الي' : 'To'}
                    />
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <Button
                      sx={{ mt: 4, mx: { xs: 'auto', md: 0 }, display: 'block' }}
                      variant='contained'
                      disabled={
                        !(
                          !errors.time_to &&
                          values.time_to.length !== 0 &&
                          !errors.time_from &&
                          values.time_from.length !== 0 &&
                          !errors.days &&
                          values.days.length !== 0
                        )
                      }
                      onClick={() => {
                        const NewDays = []
                        values.DaysTime.forEach(old => {
                          if (!values.days.includes(old)) {
                            NewDays.push(old)
                          }
                        })
                        function customSort(a, b) {
                          const order = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

                          return order.indexOf(a.days[0]) - order.indexOf(b.days[0])
                        }
                        const valueWork = []
                        values.days.map(ele => {
                          console.log(ele)
                          valueWork.push({
                            id: uuidv4(),
                            days: [ele],
                            from: values.time_from.split(',')[1].trim(),
                            to: values.time_to.split(',')[1].trim()
                          })
                        })
                        const sortedData = valueWork.sort(customSort)
                        setFieldValue('days', [])
                        setFieldValue('time_from', '')
                        setFieldValue('time_to', '')
                        setFieldValue('DaysTime', NewDays)
                        setFieldValue('workingHours', [...values.workingHours, ...sortedData])
                      }}
                    >
                      {locale === 'ar' ? 'أضافة' : 'Add'}
                    </Button>
                  </Grid>

                  <Grid item sx={{ mt: { xs: 10, md: 5 } }} xs={12} sm={12}>
                    <div style={{ position: 'relative', minHeight: '200px' }}>
                      <DataGrid
                        autoHeight
                        getRowHeight={() => 'auto'}
                        rows={values.workingHours}
                        hideFooter
                        rowHeight={62}
                        columns={[
                          {
                            field: 'days',
                            headerName: locale === 'ar' ? 'الايام' : 'Days',
                            flex: 0.3,
                            minWidth: 250,
                            sortable: false,
                            disableColumnMenu: true,
                            renderCell: ({ row: { days } }) => {
                              const newDays = []
                              days.forEach(day => {
                                newDays.push(getArabicDay(day))
                              })

                              return <p>{newDays.join(', ')}</p>
                            }
                          },
                          {
                            field: 'from',
                            headerName: locale === 'ar' ? 'من' : 'From',
                            flex: 0.3,
                            minWidth: 250,
                            sortable: false,
                            disableColumnMenu: true
                          },
                          {
                            field: 'to',
                            headerName: locale === 'ar' ? 'الي' : 'To',
                            flex: 0.3,
                            minWidth: 250,
                            sortable: false,
                            disableColumnMenu: true
                          },
                          {
                            field: 'delete',
                            headerName: locale === 'ar' ? 'حذف' : 'Delete',
                            flex: 0.1,
                            minWidth: 100,
                            sortable: false,
                            disableColumnMenu: true,
                            renderCell: params => (
                              <IconButton
                                size='small'
                                onClick={() => {
                                  function customSort(a, b) {
                                    const order = [
                                      'Sunday',
                                      'Monday',
                                      'Tuesday',
                                      'Wednesday',
                                      'Thursday',
                                      'Friday',
                                      'Saturday'
                                    ]

                                    return order.indexOf(a) - order.indexOf(b)
                                  }
                                  const newData = values.workingHours.filter(row => row.id !== params.row.id)
                                  setFieldValue('DaysTime', [...values.DaysTime, ...params.row.days].sort(customSort))
                                  setFieldValue('days', [])
                                  setFieldValue('time_from', '')
                                  setFieldValue('time_to', '')
                                  setFieldValue('workingHours', newData)
                                }}
                              >
                                <Icon icon='tabler:x' fontSize='1.25rem' />
                              </IconButton>
                            )
                          }
                        ]}
                        components={{
                          NoRowsOverlay: () => (
                            <Stack
                              height='100%'
                              alignItems='center'
                              flexDirection='row'
                              gap={2}
                              justifyContent='center'
                            >
                              <BsCalendarDate style={{ fontSize: '30px' }} />
                              <h2>{locale === 'ar' ? 'لا يوجد ساعت عمل' : 'No Hours'}</h2>{' '}
                            </Stack>
                          )
                        }}
                      />
                      {errors.workingHours && (values.showErro ? true : values.workingHours.length !== 0) && (
                        <FormHelperText sx={{ fontSize: '13px', color: '#EA5455' }}>
                          {errors.workingHours}
                        </FormHelperText>
                      )}
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Grid item xs={12} sx={{ display: 'flex' }}>
              <LoadingButton
                loading={values.loading}
                type='submit'
                disabled={values.name_ar.length === 0}
                variant='contained'
              >
                {locale === 'ar' ? 'ارسال' : 'Submit'}
              </LoadingButton>
              <Button variant='tonal' sx={{ marginInlineStart: 2 }} color='secondary' onClick={resetForm}>
                {locale === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </Button>
            </Grid>
          </form>
        )}
      </Formik>
    )
  }

  return (
    <div>
      {loadingApp ? (
        <div className='SwiperColor' style={{ position: 'fixed', inset: 0, zIndex: 1555 }}>
          <Spinner />
        </div>
      ) : (
        <CardContent>{getStepContent()}</CardContent>
      )}
    </div>
  )
}

export default Add
