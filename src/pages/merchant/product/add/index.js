import { useForm } from 'react-hook-form'
import { PiImageLight } from 'react-icons/pi'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Spinner from 'src/@core/components/spinner'
import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Formik } from 'formik'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { FormHelperText, Menu } from '@mui/material'
import { useRef } from 'react'
import MuiDrawer from '@mui/material/Drawer'
import axios from 'axios'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { IoClose } from 'react-icons/io5'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import TableOptions from 'src/Components/Tables/TableOptions'

const CustomizerSpacing = styled(Button)(({ theme }) => ({
  width: '35px ',
  minWidth: '35px ',
  height: '35px',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3249' : 'white',
  borderRadius: '50%',
  boxShadow: '0px 4px 18px 0px rgba(15, 20, 34, 0.1)',
  position: 'absolute',
  right: '10px',
  top: '10px',
  fontSize: '22px',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.mode !== 'dark' ? 'black' : 'white',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode !== 'dark' ? '#dbdade' : '#3b3f56'
  }
}))

const CustomizerSpacing2 = styled(Button)(({ theme }) => ({
  marginTop: '17px',
  width: '35px ',
  minWidth: '35px ',
  height: '35px',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3249' : 'white',
  borderRadius: '50%',
  boxShadow: '0px 4px 18px 0px rgba(15, 20, 34, 0.1)',
  fontSize: '22px',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.mode !== 'dark' ? 'black' : 'white',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode !== 'dark' ? '#dbdade' : '#3b3f56'
  }
}))

const InvoiceAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}))

const AddProduct = () => {
  const formikRef = useRef(null)
  const [itemValue, setitemValue] = useState([])
  const [openitemEdit, setopenitemEdit] = useState(false)
  const [openDrawer, setDrawerOpen] = useState(false)
  const [showErro, setShowErro] = useState(false)
  const [filteredRows, setFilteredRows] = useState(false)
  const [imageChange, setImageChange] = useState(false)
  const [value, setValue] = useState('')
  const [CategoryData, setCategoryData] = useState([])
  const [image, setImage] = useState(false)
  const [initialValues, setInitialValues] = useState()
  const [loading, setLoading] = useState(false)
  const { messages } = useIntl()
  const { locale } = useRouter()
  const router = useRouter()

  const {
    query: { epwi }
  } = useRouter()

  const subItemsSchema = yup.object().shape({
    name_ar: image ? yup.string() : yup.string().required(messages.required),
    name_en: image ? yup.string() : yup.string().required(messages.required)
  })

  const optionsSchema = yup.object().shape({
    name_ar: yup.string().required(messages.required),
    name_en: yup.string().required(messages.required),
    extra_fee: yup.number().required(messages.required)
  })

  const ProductScheme = yup.object().shape({
    image: image ? yup.string() : yup.string().required(messages.required),
    sub_items: subItemsSchema,
    options: yup.array().of(optionsSchema),
    description_ar: yup.string().required(messages.required),
    description_en: yup.string().required(messages.required),
    name_ar: yup.string().required(messages.required),
    name_en: yup.string().required(messages.required)
  })

  const Drawer = styled(MuiDrawer)(({ theme }) => ({
    zIndex: theme.zIndex.modal,
    '& .MuiFormControlLabel-root': {
      marginRight: '0.6875rem'
    },
    '& .MuiDrawer-paper': {
      border: 0,
      width: '100%',
      zIndex: theme.zIndex.modal,
      boxShadow: theme.shadows[9],
      [theme.breakpoints.up('md')]: {
        width: '50%'
      }
    }
  }))

  const handleFilter = val => {
    setValue(val)

    const newFilteredRows = itemValue.filter(row => {
      return val !== ''
        ? row.sub_items.name_ar.toLowerCase().includes(val.toLowerCase()) ||
            row.sub_items.name_en.toLowerCase().includes(val.toLowerCase())
        : itemValue
    })
    setFilteredRows(newFilteredRows)
  }

  const deleteItem = Id => {
    const deleting = itemValue.filter((ele, i) => i !== Id)
    setitemValue(deleting)
  }

  const editItems = (Id, row) => {
    setopenitemEdit(Id)
    setDrawerOpen(true)

    if (imageChange) {
      formikRef.current.setValues({ ...row, image: imageChange })
    } else {
      formikRef.current.setValues(row)
    }
  }

  const {
    reset: accountReset,
    control: accountControl,
    handleSubmit: handleAccountSubmit,
    formState: { errors: accountErrors }
  } = useForm({
    defaultValues: {},
    resolver: yupResolver(ProductScheme)
  })

  useEffect(() => {
    axios
      .get(`${process.env.API_URL}/api/category`, { withCredentials: true })
      .then(res => {
        if (epwi) {
          axios
            .get(`${process.env.API_URL}/api/product/${epwi}`, { withCredentials: true })
            .then(pro => {
              axios
                .get(`${process.env.API_URL}/api/images/download/${pro.data.image}`, {
                  responseType: 'arraybuffer',
                  withCredentials: true
                })
                .then(response => {
                  const imageSrc = `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`
                  setImage(imageSrc)
                  setCategoryData(res.data)
                  const editSortData = []
                  pro.data.sub_items.forEach(old => {
                    editSortData.push({
                      category: pro.data.category,
                      name_ar: pro.data.name_ar,
                      name_en: pro.data.name_en,
                      description_ar: pro.data.description_ar,
                      description_en: pro.data.description_en,
                      id: new Date().toISOString(),
                      options: old.options,
                      sub_items: { name_ar: old.name_ar, name_en: old.name_en, option_type: old.option_type }
                    })
                  })
                  setitemValue(editSortData)
                  setInitialValues({
                    name_ar: pro.data.name_ar,
                    name_en: pro.data.name_en,
                    image: '',
                    description_ar: pro.data.description_ar,
                    description_en: pro.data.description_en,
                    category: pro.data.category,
                    sub_items: {
                      name_en: '',
                      name_ar: '',
                      option_type: 'single'
                    },
                    options: []
                  })
                })
                .catch(error => {
                  console.log(error)
                })
            })
            .catch(_ => {
              router.push(`/${locale}/404`)
            })
        } else {
          setCategoryData(res.data)
          setInitialValues({
            name_ar: '',
            name_en: '',
            image: '',
            description_ar: '',
            description_en: '',
            category: res.data.length !== 0 ? res.data[0]._id : '',
            sub_items: {
              name_en: '',
              name_ar: '',
              option_type: 'single'
            },
            options: []
          })
        }
      })
      .catch(err => {
        setCategoryData(false)
        toast.error(locale === 'ar' ? 'من فظلك قم باضافة الفئات قبل اضافة المنتج' : 'Please create categories first')
        router.push(`/${locale}/merchant/category/`)
      })
  }, [locale, router, epwi])

  return (
    <Card>
      {CategoryData ? (
        CategoryData.length !== 0 ? (
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {
              setLoading(true)
              const subItems = []
              itemValue.forEach(old => {
                if (epwi) {
                  old.options.map(ele => {
                    delete ele._id
                  })
                }
                subItems.push({ ...old.sub_items, options: old.options })
              })
              const submitedData = { ...values }
              delete submitedData.options
              submitedData.sub_items = subItems

              if (!values.image || values.image === '') {
                delete submitedData.image
                delete submitedData.id
                axios
                  .put(`${process.env.API_URL}/api/product/${epwi}`, submitedData, { withCredentials: true })
                  .then(_ => {
                    toast.success(locale === 'ar' ? 'تم تعديل المنتج' : 'Product has been change')
                  })
                  .catch(error => {
                    console.log(error)
                  })
                  .finally(_ => {
                    setLoading(false)
                  })
              } else {
                axios
                  .post(
                    `${process.env.API_URL}/api/images/upload`,
                    { image: values.image },
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
                    submitedData.image = res.data
                    delete submitedData.id
                    if (epwi) {
                      axios
                        .put(`${process.env.API_URL}/api/product/${epwi}`, submitedData, { withCredentials: true })
                        .then(_ => {
                          toast.success(locale === 'ar' ? 'تم تعديل المنتج' : 'Product has been change')
                        })
                        .catch(error => {
                          console.log(error)
                        })
                        .finally(_ => {
                          setLoading(false)
                        })
                    } else {
                      delete submitedData.id
                      axios
                        .post(`${process.env.API_URL}/api/product`, submitedData, { withCredentials: true })
                        .then(_ => {
                          resetForm()
                          setitemValue([])
                          setopenitemEdit(false)
                          setDrawerOpen(false)
                          setShowErro(false)
                          setFilteredRows(false)
                          setValue('')
                          toast.success(locale === 'ar' ? 'تم انشاء المنتج' : 'Product has been created')
                        })
                        .catch(error => {
                          console.log(error)
                        })
                        .finally(_ => {
                          setLoading(false)
                        })
                    }
                  })
                  .catch(err => {
                    toast.error(err.message)
                    setLoading(false)
                  })
              }
            }}
            validationSchema={ProductScheme}
          >
            {({ values, errors, handleSubmit, isValid, setFieldValue }) => (
              <>
                <form
                  onSubmit={async e => {
                    e.preventDefault()
                    if (!isValid) {
                      return setShowErro(true)
                    }
                    if (itemValue.length === 0) {
                      return
                    }
                    handleSubmit()
                  }}
                >
                  <Box
                    sx={{
                      pb: theme => `${theme.spacing(8)} !important`,
                      px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                      pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                  >
                    <Box sx={{ mb: 8, textAlign: 'center' }}>
                      <Typography variant='h3' sx={{ mb: 3 }}>
                        {locale === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>
                        {locale === 'ar' ? 'إضافة منتج لقائمتك' : 'Add Product for your Menu'}
                      </Typography>
                    </Box>
                    <Grid
                      container
                      sx={{
                        py: 4,
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: { md: 'row', xs: 'column-reverse' },
                        width: '100%',
                        mx: 'auto',
                        gap: '20px',
                        flexWrap: { md: 'nowrap', xs: 'wrap' }
                      }}
                    >
                      <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }} item xs={12} md={6}>
                        <CustomTextField
                          fullWidth
                          value={values.name_ar}
                          label={messages.arName}
                          onChange={e => {
                            setFieldValue('name_ar', e.target.value)
                          }}
                          error={errors.name_ar && (showErro ? true : values.name_ar.length !== 0)}
                          helperText={
                            Boolean(errors.name_ar && (showErro ? true : values.name_ar.length !== 0)) && errors.name_ar
                          }
                        />
                        <CustomTextField
                          fullWidth
                          type='name_en'
                          value={values.name_en}
                          label={messages.enName}
                          aria-describedby='stepper-linear-account-name_en'
                          onChange={e => setFieldValue('name_en', e.target.value)}
                          error={errors.name_en && (showErro ? true : values.name_en.length !== 0)}
                          helperText={
                            Boolean(errors.name_en && (showErro ? true : values.name_en.length !== 0)) && errors.name_en
                          }
                        />
                        <div className='controlChangeRtl'>
                          <CustomAutocomplete
                            fullWidth
                            value={CategoryData.find(ele => ele._id === values.category)}
                            options={CategoryData}
                            getOptionLabel={option => option[`name_${locale}`] || ''}
                            onChange={(e, newValue) => {
                              if (newValue?._id) {
                                setFieldValue('category', newValue._id)
                              }
                            }}
                            renderInput={params => (
                              <CustomTextField
                                error={errors.category && (showErro ? true : values.category.length !== 0)}
                                helperText={
                                  Boolean(errors.category && (showErro ? true : values.category.length !== 0)) &&
                                  errors.category
                                }
                                {...params}
                                label={messages.category}
                              />
                            )}
                          />
                        </div>
                        <CustomTextField
                          fullWidth
                          rows={5}
                          multiline
                          type='text'
                          value={values.description_ar}
                          label={locale === 'ar' ? 'الوصف بالعربية' : 'Arabic Description'}
                          onChange={e => setFieldValue('description_ar', e.target.value)}
                          aria-describedby='stepper-linear-account-description_ar'
                          error={errors.description_ar && (showErro ? true : values.description_ar.length !== 0)}
                          helperText={
                            Boolean(errors.description_ar && (showErro ? true : values.description_ar.length !== 0)) &&
                            errors.description_ar
                          }
                        />
                        <CustomTextField
                          fullWidth
                          type='text'
                          rows={5}
                          multiline
                          value={values.description_en}
                          label={locale === 'ar' ? 'الوصف بالانجليزية' : 'English Description'}
                          onChange={e => setFieldValue('description_en', e.target.value)}
                          aria-describedby='stepper-linear-account-description_en'
                          error={errors.description_en && (showErro ? true : values.description_en.length !== 0)}
                          helperText={
                            Boolean(errors.description_en && (showErro ? true : values.description_en.length !== 0)) &&
                            errors.description_en
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ marginTop: '17px' }} md={6}>
                        <div className='selectImg' style={{ position: 'relative', minHeight: '300px' }}>
                          {image ? (
                            <>
                              <Image
                                className='w-full || h-full || object-cover '
                                style={{ height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                blurDataURL={
                                  values.image && values.image !== '' ? URL?.createObjectURL(values.image) : image
                                }
                                src={values.image && values.image !== '' ? URL?.createObjectURL(values.image) : image}
                                alt={'logo'}
                                placeholder='blur'
                                width={0}
                                height={0}
                                sizes='100vw'
                              />
                            </>
                          ) : (
                            ''
                          )}

                          {!image ? (
                            values.image !== '' ? (
                              <>
                                <CustomizerSpacing
                                  style={{ zIndex: 555 }}
                                  onClick={() => {
                                    setFieldValue('image', '')
                                  }}
                                >
                                  <IoClose />
                                </CustomizerSpacing>
                                <Image
                                  className='w-full || h-full || object-cover '
                                  style={{ height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                  blurDataURL={URL?.createObjectURL(values.image)}
                                  src={URL?.createObjectURL(values.image)}
                                  alt={'logo'}
                                  placeholder='blur'
                                  width={0}
                                  height={0}
                                  sizes='100vw'
                                />
                              </>
                            ) : (
                              <div className='' style={{ textAlign: 'center' }}>
                                <PiImageLight style={{ fontSize: '60px' }} />
                                <p style={{ margin: '0' }}>{locale === 'ar' ? 'اختر صورة' : 'Select Image'}</p>
                                <div
                                  style={{ position: 'absolute', zIndex: 10, inset: 0, display: 'flex' }}
                                  className='flex items-center gap-5 flex-wrap || absolute z-10 || inset-0'
                                >
                                  <input
                                    style={{ cursor: 'pointer', width: '100%', height: '100%' }}
                                    name='file'
                                    className='text-[0px] w-full h-full rounded-full opacity-0 || cursor-pointer'
                                    type='file'
                                    onChange={e => {
                                      const handleImageChangeNew = async event => {
                                        if (event.target.files[0]) {
                                          setFieldValue('image', event.target.files[0])
                                          event.target.value = ''
                                        }
                                      }
                                      handleImageChangeNew(e).then(res => {
                                        setImageChange(res)
                                      })
                                    }}
                                    accept='image/png, image/jpg, image/jpeg'
                                  />
                                </div>
                              </div>
                            )
                          ) : (
                            <div className='hoverInput' style={{ position: 'absolute', inset: 0, textAlign: 'center' }}>
                              <div className='ShowChange'>
                                <PiImageLight style={{ fontSize: '60px' }} />
                                <p style={{ margin: '0' }}>{locale === 'ar' ? 'اختر صورة' : 'Select Image'}</p>
                              </div>
                              <div
                                style={{ position: 'absolute', zIndex: 10, inset: 0, display: 'flex' }}
                                className='flex items-center gap-5 flex-wrap || absolute z-10 || inset-0'
                              >
                                <input
                                  style={{ cursor: 'pointer', width: '100%', height: '100%' }}
                                  name='file'
                                  className='text-[0px] w-full h-full rounded-full opacity-0 || cursor-pointer'
                                  type='file'
                                  onChange={e => {
                                    handleImageChangeNew(e).then(res => {
                                      setFieldValue('image', res)
                                      setImageChange(res)
                                    })
                                  }}
                                  accept='image/png, image/jpg, image/jpeg'
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        {errors.image && (showErro ? true : values.image.length !== 0) && (
                          <FormHelperText
                            sx={{ fontSize: '13px', color: '#EA5455', textAlign: locale === 'ar' ? 'right' : 'left' }}
                          >
                            {errors.image}
                          </FormHelperText>
                        )}
                      </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                      <Grid item xs={12}>
                        <Card>
                          <Box
                            sx={{
                              gap: 4,
                              display: 'flex',
                              flexWrap: 'wrap',
                              flexDirection: { xs: 'column-reverse', md: 'row' },
                              margin: 4,
                              alignItems: 'center',
                              justifyContent: { xs: 'center', md: 'space-between' }
                            }}
                          >
                            <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
                              <CustomTextField
                                value={value}
                                fullWidth
                                placeholder={locale === 'ar' ? 'البحث عن اختيار' : 'Search Item'}
                                onChange={e => handleFilter(e.target.value)}
                              />
                            </Box>

                            <Button
                              variant='contained'
                              sx={{ '& svg': { mr: 2 }, width: { xs: '100%', md: 'auto' } }}
                              onClick={() => {
                                setDrawerOpen(true)
                                setFieldValue('sub_items', {
                                  name_en: undefined,
                                  name_ar: undefined,
                                  option_type: 'single'
                                })
                                setopenitemEdit(false)
                              }}
                            >
                              <Icon fontSize='1.125rem' icon='tabler:plus' />

                              {locale === 'ar' ? ' اضافة اختيار' : 'Add Item'}
                            </Button>
                          </Box>
                          <div className='relative'>
                            <TableOptions
                              data={filteredRows ? filteredRows : itemValue}
                              deleteItem={deleteItem}
                              editItems={editItems}
                            />
                          </div>
                          {showErro && itemValue.length === 0 && (
                            <FormHelperText
                              sx={{ fontSize: '13px', color: '#EA5455', textAlign: locale === 'ar' ? 'right' : 'left' }}
                            >
                              {messages.required}
                            </FormHelperText>
                          )}
                        </Card>
                      </Grid>
                    </Grid>
                    <Drawer
                      open={openDrawer}
                      hideBackdrop
                      anchor={locale === 'ar' ? 'left' : 'right'}
                      variant='persistent'
                    >
                      <Box
                        className='customizer-header'
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          p: theme => theme.spacing(3.5, 5, 0, 5)
                        }}
                      >
                        <IconButton
                          onClick={() => {
                            setDrawerOpen(false)
                            setFieldValue('options', [])
                          }}
                          sx={{
                            color: 'text.secondary',
                            alignSelf: 'flex-end'
                          }}
                        >
                          <Icon icon='tabler:x' fontSize={30} />
                        </IconButton>
                        <div
                          className='scrollStyle'
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: 'calc(100vh - 78px - 55px)',
                            overflow: 'auto',
                            padding: '0 10px'
                          }}
                        >
                          <Box sx={{ justifyContent: 'center' }}>
                            <Grid item lg={10} md={12} xs={12}>
                              <CustomTextField
                                fullWidth
                                sx={{ mt: 3 }}
                                value={values.sub_items.name_ar ? values.sub_items.name_ar : ''}
                                label={locale === 'ar' ? 'الاسم بالعربية' : 'Arabic SubItem Name'}
                                onChange={e => {
                                  setFieldValue('sub_items.name_ar', e.target.value)
                                }}
                                aria-describedby='stepper-linear-account-name_ar'
                              />
                              <CustomTextField
                                fullWidth
                                sx={{ mt: 3 }}
                                type='text'
                                value={values.sub_items.name_en ? values.sub_items.name_en : ''}
                                label={locale === 'ar' ? 'الاسم بالانجليزية' : 'English SubItem Name'}
                                aria-describedby='stepper-linear-account-name_en'
                                onChange={e => {
                                  setFieldValue('sub_items.name_en', e.target.value)
                                }}
                              />

                              <CustomTextField
                                fullWidth
                                sx={{ mt: 3 }}
                                select
                                type='text'
                                value={values.sub_items.option_type}
                                label={locale === 'ar' ? 'نوع الاختيار' : 'Option Type '}
                                onChange={e => {
                                  setFieldValue('sub_items.option_type', e.target.value)
                                }}
                              >
                                <MenuItem value='single'>{locale === 'ar' ? 'فردي' : 'single '} </MenuItem>
                                <MenuItem value='multiple'>{locale === 'ar' ? 'متعدد' : 'multiple '}</MenuItem>
                              </CustomTextField>
                            </Grid>
                            <Grid item lg={10} md={5} xs={10} sx={{ mt: 8, mb: 4 }}>
                              <Divider sx={{ mb: '0 !important' }} />
                            </Grid>
                            <Grid
                              item
                              lg={10}
                              md={5}
                              xs={10}
                              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                              <Grid item lg={2} md={2} xs={2}>
                                <Typography> {locale === 'ar' ? 'الخيارات' : 'Options '}</Typography>
                              </Grid>
                              <Grid item lg={2} md={2} xs={2}>
                                <InvoiceAction sx={{ border: 'none' }}>
                                  <IconButton
                                    size='small'
                                    onClick={() => {
                                      setFieldValue('options', [
                                        ...values.options,
                                        {
                                          name_ar: undefined,
                                          name_en: undefined,
                                          extra_fee: 0
                                        }
                                      ])
                                    }}
                                  >
                                    <Icon icon='tabler:plus' fontSize='1.500rem' />
                                  </IconButton>
                                </InvoiceAction>
                              </Grid>
                            </Grid>
                            {values.options?.map((si, i) => (
                              <Grid
                                key={i}
                                sx={{ px: 4, display: 'flex', my: { lg: 4, xs: 4 }, gap: '10px', alignItems: 'center' }}
                              >
                                <Grid item lg={2} md={5} xs={12}>
                                  <CustomTextField
                                    fullWidth
                                    value={values.options[i].name_ar ? values.options[i].name_ar : ''}
                                    label={locale === 'ar' ? 'الاسم ( ع )' : 'Name (ar)'}
                                    onChange={e => {
                                      setFieldValue(`options[${i}].name_ar`, e.target.value)
                                    }}
                                    aria-describedby='stepper-linear-account-name_ar'
                                  />
                                </Grid>
                                <Grid item lg={2} md={5} xs={12}>
                                  <CustomTextField
                                    fullWidth
                                    type='text'
                                    value={values.options[i].name_en ? values.options[i].name_en : ''}
                                    label={locale === 'ar' ? 'الاسم ( en )' : 'Name (en)'}
                                    onChange={e => {
                                      setFieldValue(`options[${i}].name_en`, e.target.value)
                                    }}
                                    aria-describedby={`stepper-linear-account-name_en-${i}`}
                                  />
                                </Grid>
                                <Grid item lg={2} md={5} xs={12}>
                                  <CustomTextField
                                    fullWidth
                                    type='number'
                                    placeholder='0'
                                    value={values.options[i].extra_fee ? values.options[i]?.extra_fee : ''}
                                    label={locale === 'ar' ? 'رسوم إضافية' : 'Extra Fee'}
                                    onChange={e => {
                                      setFieldValue(`options[${i}].extra_fee`, +e.target.value)
                                    }}
                                    aria-describedby='stepper-linear-account-extra_fee'
                                  />
                                </Grid>
                                <Grid item lg={2} md={5} xs={12}>
                                  <CustomizerSpacing2
                                    onClick={() => {
                                      const emptyObj = [...values.options] // Clone the sizes array
                                      emptyObj[i] = { name_ar: undefined, name_en: undefined, extra_fee: undefined } // Clear the object at the specified index

                                      const updatedSizes = values.options.filter((size, index) => index !== i)
                                      setFieldValue('options', updatedSizes)
                                    }}
                                  >
                                    <Icon icon='tabler:x' fontSize='1.25rem' />
                                  </CustomizerSpacing2>
                                </Grid>
                              </Grid>
                            ))}
                          </Box>
                        </div>
                        <div className='mainColor ' style={{ textAlign: 'center', padding: '20px 0 15px ' }}>
                          <Button
                            variant='contained'
                            fullWidth
                            disabled={
                              !(
                                !errors.options &&
                                values.options.length !== 0 &&
                                !errors.sub_items?.name_ar &&
                                values.sub_items?.name_ar?.length !== 0 &&
                                !errors.sub_items?.name_en &&
                                values.sub_items?.name_en?.length !== 0
                              )
                            }
                            onClick={e => {
                              const time = new Date().toISOString()
                              if (openitemEdit !== false) {
                                const NewitemValue = [...itemValue]
                                const finMyMenu = NewitemValue.find((ele, i) => i == openitemEdit)

                                finMyMenu.options = values.options
                                finMyMenu.sub_items = values.sub_items
                                setitemValue(NewitemValue)
                                setopenitemEdit(false)
                              } else {
                                setitemValue([...itemValue, { ...values, id: time }])
                              }
                              setFieldValue('options', [])
                              setFilteredRows(false)
                              setDrawerOpen(false)
                            }}
                          >
                            {openitemEdit !== false
                              ? locale === 'ar'
                                ? 'تعديل الاختيارات'
                                : 'Update item '
                              : locale === 'ar'
                              ? 'حفظ الاختيارات'
                              : 'Save Item'}
                          </Button>
                        </div>
                      </Box>
                    </Drawer>
                    <Grid container sx={{ mt: 6 }}>
                      <Grid item xs={12} sx={{ px: 0, textAlign: 'center' }}>
                        <LoadingButton
                          loading={loading}
                          disabled={values.name_ar === ''}
                          variant='contained'
                          type='submit'
                        >
                          {locale === 'ar' ? 'ارسال' : 'Submit'}
                        </LoadingButton>
                      </Grid>
                    </Grid>
                  </Box>
                </form>
              </>
            )}
          </Formik>
        ) : (
          <div className='SwiperColor' style={{ position: 'fixed', inset: 0, zIndex: 1555 }}>
            <Spinner />
          </div>
        )
      ) : (
        <div className='SwiperColor' style={{ position: 'fixed', inset: 0, zIndex: 1555 }}>
          <Spinner />
        </div>
      )}
    </Card>
  )
}

export default AddProduct
