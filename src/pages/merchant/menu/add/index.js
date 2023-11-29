import * as yup from 'yup'
import { useState, useRef, useEffect } from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Spinner from 'src/@core/components/spinner'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Formik } from 'formik'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import axios from 'axios'
import { FormHelperText } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useIntl } from 'react-intl'
import { LoadingButton } from '@mui/lab'

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

const InvoiceAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}))

const AddCard = () => {
  const [itemValue, setitemValue] = useState([])
  const [openitemEdit, setopenitemEdit] = useState(false)
  const [openDrawer, setDrawerOpen] = useState(false)
  const formikRef = useRef(null)
  const [EGP, setEgp] = useState('EGP')
  const [filteredRows, setFilteredRows] = useState(false)
  const [CategoryData, setCategoryData] = useState([])
  const [ProductData, setProductData] = useState([])
  const { locale } = useRouter()
  const [showError, setshowError] = useState(false)
  const [initialValues, setInitialValues] = useState(null)
  const { messages } = useIntl()
  const [sortFn, setSortfn] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSort = () => {
    setSortfn(!sortFn)
    setitemValue(itemValue.reverse())
    if (sortFn) {
      setFilteredRows(itemValue.sort((a, b) => b.discount - a.discount))
    } else {
      setFilteredRows(itemValue.sort((a, b) => a.discount - b.discount))
    }
  }

  const sizeSchema = yup.object().shape({
    name_ar: yup.string().required(messages.required),
    name_en: yup.string().required(messages.required),
    price: yup.number().required(messages.required)
  })

  const MenuScheme = yup.object().shape({
    sizes: yup.array().of(sizeSchema),
    menu_name: yup.string().required(messages.required),
    category: yup.string().required(messages.required),
    product: yup.string().required(messages.required)
  })

  const {
    query: { epwi }
  } = useRouter()

  useEffect(() => {
    axios
      .get(`${process.env.API_URL}/api/category`, { withCredentials: true })
      .then(res => {
        axios
          .get(`${process.env.API_URL}/api/product`, { withCredentials: true })
          .then(product => {
            if (epwi) {
              axios.get(`${process.env.API_URL}/api/menu/${epwi}`, { withCredentials: true }).then(menu => {
                console.log(menu.data)

                setInitialValues({
                  category: res.data.length !== 0 ? res.data[0]._id : '',
                  discount: 0,
                  discount_type: 'amount',
                  product: product.data.length !== 0 ? product.data[0]._id : '',
                  menu_name: menu.data.menu_name,
                  sizes: [],
                  items: {
                    category: '',
                    discount: 0,
                    discount_type: '',
                    product: ''
                  }
                })

                const ReturnedData = menu.data.items.map(ele => {
                  return {
                    id: ele._id,
                    category: ele.category._id,
                    product: ele.product._id,
                    discount: ele.discount,
                    discount_type: ele.discount_type,
                    menu_name: menu.data.menu_name,
                    sizes: ele.sizes.map(sizeEle => {
                      delete sizeEle._id

                      return sizeEle
                    })
                  }
                })
                setitemValue(ReturnedData)

                setProductData(product.data)
                setCategoryData(res.data)
              })
            } else {
              setInitialValues({
                menu_name: '',
                discount: 0,
                discount_type: 'amount',
                category: res.data.length !== 0 ? res.data[0]._id : '',
                product: product.data.length !== 0 ? product.data[0]._id : '',
                sizes: []
              })
              setProductData(product.data)
              setCategoryData(res.data)
            }
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(error => {
        console.log(error)
      })
      .catch(error => {
        console.log(error)
      })
  }, [epwi])

  const [value, setValue] = useState('')

  console.log(initialValues, 'inittttttttttt')

  const handleFilter = val => {
    setValue(val)
    console.log('Sdsads')
    console.log(itemValue)
    const getMyData = [...itemValue]

    const updatedData = getMyData.map(ele => {
      const foundProduct = ProductData.find(item => ele.product === item._id)

      if (foundProduct) {
        return { ...ele, productData: foundProduct }
      }

      return ele
    })

    const EndData = updatedData.map(ele => {
      const foundProduct = CategoryData.find(item => item._id === ele.category)

      if (foundProduct) {
        return { ...ele, categoryData: foundProduct }
      }

      return ele
    })

    const newFilteredRows = EndData.filter(row => {
      console.log(row, 'row')

      return val !== ''
        ? row.categoryData.name_ar.toLowerCase().includes(val.toLowerCase()) ||
            row.categoryData.name_en.toLowerCase().includes(val.toLowerCase()) ||
            row.productData.name_ar.toLowerCase().includes(val.toLowerCase()) ||
            row.productData.name_en.toLowerCase().includes(val.toLowerCase())
        : itemValue
    })

    const filterData = newFilteredRows.map(ele => {
      const myData = { ...ele }
      delete myData.productData
      delete myData.categoryData

      return myData
    })

    setFilteredRows(filterData)
  }

  const deleteItem = Id => {
    const deleting = itemValue.filter((ele, i) => Id !== i)
    setitemValue(deleting)
    if (filteredRows) {
      const deleting = filteredRows.filter((ele, i) => Id !== i)
      if (deleting.length === 0) {
        setFilteredRows(false)
      } else {
        setFilteredRows(deleting)
      }
    }
  }

  const editItems = (Id, row) => {
    setopenitemEdit(Id)
    setDrawerOpen(true)
    formikRef.current.setValues({
      ...row,
      menu_name: formikRef.current.values.menu_name
    })

    // formikRef.current.console.log(formikRef.current.values.menu_name, 'row of the menu')
  }

  return (
    <Card>
      {CategoryData ? (
        CategoryData.length !== 0 ? (
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            form
            onSubmit={(values, { resetForm }) => {
              console.log(values)

              const SubmitedData = [...itemValue]

              const element = SubmitedData.map(ele => {
                const newElement = { ...ele }
                delete newElement.id
                delete newElement.items
                delete newElement.menu_name

                return newElement
              })
              console.log(element)
              console.log(itemValue, 'itemVale')

              const valuesSent = { ...values }

              console.log({
                menu_name: values.menu_name,
                items: element
              })

              const SentData = {
                menu_name: values.menu_name,
                items: element
              }

              setLoading(true)
              if (epwi) {
                axios
                  .put(`${process.env.API_URL}/api/menu/${epwi}`, SentData, { withCredentials: true })
                  .then(response => {
                    // Handle the response
                    console.log('Response:', response.data)
                    toast.success(response.data.message)
                    toast.success('Now  , You need to Add Your Branch')
                    router.push(`/${locale}/merchant/menu`)
                    resetForm()
                    setitemValue([])
                    setFilteredRows(false)
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
                  .post(`${process.env.API_URL}/api/menu`, SentData, { withCredentials: true })
                  .then(response => {
                    // Handle the response
                    console.log('Response:', response.data)
                    toast.success(response.data.message)
                    toast.success('Now  , You need to Add Your Branch')
                    router.push(`/${locale}/merchant/branch`)
                    resetForm()
                    setitemValue([])
                    setFilteredRows(false)
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
            }}
            validationSchema={MenuScheme}
          >
            {({
              values,
              errors,
              handleChange,
              handleChangecolor,
              handleSubmit,
              setFieldValue,
              resetForm,
              setValues,
              handleBlur,
              isValid,
              touched
            }) => (
              <>
                <form
                  onSubmit={e => {
                    e.preventDefault()
                    if (!isValid) {
                      return setshowError(true)
                    }
                    console.log(values)

                    if (itemValue.length === 0) {
                      return setshowError(true)
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
                    {console.log(showError)}
                    <Box sx={{ mb: 8, textAlign: 'center' }}>
                      <Typography variant='h3' sx={{ mb: 3 }}>
                        {locale === 'ar' ? 'اضافة قائمة جديده ' : 'Add New Menu'}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>
                        {locale === 'ar' ? ' اضافة قائمة جديده لشركتك' : 'Add Menu for your Merchant'}
                      </Typography>
                    </Box>
                    <Grid
                      container
                      spacing={5}
                      sx={{ py: 4, display: 'flex', justifyContent: 'center', width: '100%', pr: { lg: 0, xs: 4 } }}
                    >
                      <Grid sx={{ mb: 5 }} item xs={12} sm={12} lg={12}>
                        <CustomTextField
                          fullWidth
                          value={values.menu_name}
                          label={locale == 'ar' ? 'اسم القائمة' : 'Menu Name'}
                          onChange={e => {
                            setFieldValue('menu_name', e.target.value)
                          }}
                          aria-describedby='stepper-linear-account-menu_name'
                          error={errors.menu_name && (showError ? true : values.menu_name.length !== 0)}
                          helperText={
                            Boolean(errors.menu_name && (showError ? true : values.menu_name.length !== 0)) &&
                            errors.menu_name
                          }
                        />
                      </Grid>
                      <Grid container spacing={6}>
                        <Grid item xs={12}>
                          <Card>
                            <Box
                              sx={{
                                gap: 4,
                                display: 'flex',
                                flexWrap: 'wrap',
                                margin: 4,
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                            >
                              <CustomTextField
                                value={value}
                                placeholder={locale === 'ar' ? 'بحث عن العنصر' : 'Search Item'}
                                onChange={e => handleFilter(e.target.value)}
                              />

                              <Button
                                variant='contained'
                                sx={{ '& svg': { mr: 2 } }}
                                onClick={() => {
                                  setDrawerOpen(true)
                                  setFieldValue('items', {
                                    discount: 0,
                                    discount_type: 'percentage',
                                    category: '',
                                    product: ''
                                  })
                                  setFieldValue('sizes', [])
                                  setopenitemEdit(false)
                                }}
                              >
                                <Icon fontSize='1.125rem' icon='tabler:plus' />
                                {locale === 'ar' ? ' اضافة عنصر' : ' Add Item'}
                              </Button>
                            </Box>
                            <div className='relative'></div>
                            {showError && itemValue.length === 0 && (
                              <FormHelperText
                                sx={{
                                  fontSize: '13px',
                                  color: '#EA5455',
                                  textAlign: locale === 'ar' ? 'right' : 'left'
                                }}
                              >
                                {messages.required}
                              </FormHelperText>
                            )}
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Drawer
                      open={openDrawer}
                      anchor={locale === 'ar' ? 'left' : 'right'}
                      hideBackdrop
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
                          onClick={() => setDrawerOpen(false)}
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
                            <Grid item lg={10} md={12} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                              <CustomAutocomplete
                                fullWidth
                                sx={{ mt: 3 }}
                                value={CategoryData.find(ele => ele._id === values.category)}
                                getOptionLabel={option => option[`name_${locale}`] || ''}
                                options={CategoryData}
                                onChange={(e, newValue) => {
                                  if (newValue?._id) {
                                    setFieldValue('category', newValue._id)
                                  } else {
                                    setFieldValue('category', '')
                                  }
                                }}
                                renderOption={(props, option) => (
                                  <Box component='li' {...props} key={option._id}>
                                    {option[`name_${locale}`]}
                                  </Box>
                                )}
                                renderInput={params => (
                                  <>
                                    <CustomTextField {...params} label={locale === 'ar' ? 'الفئة' : 'Category'} />
                                  </>
                                )}
                              />
                              <CustomAutocomplete
                                fullWidth
                                sx={{ mt: 3 }}
                                value={ProductData.find(ele => ele._id === values.product)}
                                options={ProductData}
                                getOptionLabel={option => option[`name_${locale}`] || ''}
                                renderOption={(props, option) => (
                                  <Box component='li' {...props} key={option._id}>
                                    {option[`name_${locale}`]}
                                  </Box>
                                )}
                                onChange={(e, newValue) => {
                                  if (newValue?._id) {
                                    setFieldValue('product', newValue._id)
                                  }
                                }}
                                renderInput={params => (
                                  <CustomTextField {...params} label={locale === 'ar' ? 'منتج' : 'Product'} />
                                )}
                              />
                              <CustomTextField
                                fullWidth
                                sx={{ mt: 3.5 }}
                                type='number'
                                value={values.discount}
                                placeholder='0'
                                label={locale === 'ar' ? 'خصم (اختياري)' : 'Discount  (optional)'}
                                onChange={e => {
                                  setFieldValue('discount', e.target.value === '' ? '' : +e.target.value)
                                }}
                                aria-describedby='stepper-linear-account-discount'
                                InputProps={{
                                  endAdornment: <InputAdornment position='end'>{EGP}</InputAdornment>
                                }}
                              />
                              <CustomTextField
                                fullWidth
                                sx={{ mt: 3.5 }}
                                select
                                type='text'
                                value={values.discount_type}
                                label={locale === 'ar' ? 'نوع خصم (اختياري)' : 'Discount Type (optional)'}
                                onChange={e => {
                                  setFieldValue('discount_type', e.target.value)
                                  setEgp(values.discount_type == 'amount' ? 'EGP' : '%')
                                }}
                              >
                                <MenuItem value='percentage'>{locale === 'ar' ? 'نسبة' : 'percentage'}</MenuItem>
                                <MenuItem value='amount'>{locale === 'ar' ? 'كمية' : 'amount'}</MenuItem>
                              </CustomTextField>
                            </Grid>
                            <Grid item lg={10} md={5} xs={10} sx={{ px: 4, my: { lg: 6, xs: 4 } }}>
                              <Divider sx={{ mb: '0 !important' }} />
                            </Grid>
                            <Grid
                              lg={10}
                              md={5}
                              xs={10}
                              sx={{ px: 4, my: { lg: 1, xs: 4 }, display: 'flex', justifyContent: 'space-between' }}
                            >
                              <Grid lg={2} md={2} xs={2} sx={{ px: 1, my: { lg: 0, xs: 0 }, marginTop: '10px' }}>
                                <Typography sx={{ marginTop: '10px' }}>
                                  {locale === 'ar' ? 'الاحجام' : 'Sizes'}
                                </Typography>
                              </Grid>
                              <Grid lg={2} md={2} xs={2} sx={{ px: 1, my: { lg: 0, xs: 0 } }}>
                                <InvoiceAction sx={{ border: 'none' }}>
                                  <IconButton
                                    size='small'
                                    onClick={() => {
                                      setFieldValue('sizes', [
                                        ...values.sizes,
                                        {
                                          name_ar: undefined,
                                          name_en: undefined,
                                          price: undefined,
                                          price_discounted: undefined
                                        }
                                      ])
                                    }}
                                  >
                                    <Icon icon='tabler:plus' fontSize='1.500rem' />
                                  </IconButton>
                                </InvoiceAction>
                              </Grid>
                            </Grid>

                            {values.sizes?.map((si, i) => (
                              <Grid key={i} lg={2} md={5} xs={5} sx={{ px: 4, display: 'flex', my: { lg: 4, xs: 4 } }}>
                                <Grid item lg={2} md={5} xs={5} sx={{ px: 1, my: { lg: 0, xs: 0 } }}>
                                  <div className='rtl'>
                                    <CustomTextField
                                      fullWidth
                                      value={values.sizes[i].name_ar ? values.sizes[i].name_ar : ''} // Use field.value to keep it in sync with form state
                                      label={locale === 'ar' ? 'الاسم (ع)' : 'Name(Ar)'}
                                      onChange={e => {
                                        setFieldValue(`sizes[${i}].name_ar`, e.target.value)
                                        console.log(values.sizes)
                                      }}
                                      aria-describedby={`stepper-linear-account-name_ar-${i}`}
                                    />
                                  </div>
                                </Grid>
                                <Grid item lg={2} md={5} xs={5} sx={{ px: 1, my: { lg: 0, xs: 0 } }}>
                                  <CustomTextField
                                    fullWidth
                                    type='text'
                                    value={values.sizes[i].name_en ? values.sizes[i].name_en : ''}
                                    label={locale === 'ar' ? 'الاسم (ا)' : 'Name (en)'}
                                    onChange={e => {
                                      setFieldValue(`sizes[${i}].name_en`, e.target.value)
                                      console.log(values.sizes)
                                    }}
                                    aria-describedby={`stepper-linear-account-name_en-${i}`}
                                  />
                                </Grid>
                                <Grid item lg={2} md={5} xs={5} sx={{ px: 1, my: { lg: 0, xs: 0 } }}>
                                  <CustomTextField
                                    fullWidth
                                    type='number'
                                    value={values.sizes[i].price ? values.sizes[i].price : ''}
                                    label={locale === 'ar' ? 'السعر' : 'Price'}
                                    onChange={e => {
                                      if (e.target.value < 0) {
                                        setFieldValue(`sizes[${i}].price`, 0)
                                      } else {
                                        setFieldValue(`sizes[${i}].price`, e.target.value)
                                      }
                                    }}
                                  />
                                </Grid>
                                <Grid item lg={2} md={5} xs={5} sx={{ px: 1, my: { lg: 0, xs: 0 } }}>
                                  <CustomTextField
                                    fullWidth
                                    type='number'
                                    value={values.sizes[i].price_discounted ? values.sizes[i].price_discounted : ''}
                                    label={locale === 'ar' ? 'السعر مخفض' : 'Price Discounted'}
                                    onChange={e => {
                                      if (e.target.value < 0) {
                                        setFieldValue(`sizes[${i}].price_discounted`, 0)
                                      } else {
                                        setFieldValue(`sizes[${i}].price_discounted`, e.target.value)
                                      }
                                    }}
                                  />
                                </Grid>
                                <Grid item lg={2} md={5} xs={5} sx={{ px: 1, my: { lg: 0, xs: 0 } }}>
                                  <InvoiceAction sx={{ border: 'none', marginTop: '10px' }}>
                                    <IconButton
                                      size='small'
                                      onClick={() => {
                                        const updatedSizes = values.sizes.filter((size, index) => index !== i)
                                        setFieldValue('sizes', updatedSizes)
                                      }}
                                    >
                                      <Icon icon='tabler:x' fontSize='1.25rem' />
                                    </IconButton>
                                  </InvoiceAction>
                                </Grid>
                              </Grid>
                            ))}
                          </Box>
                        </div>
                        <div className='mainColor ' style={{ textAlign: 'center', padding: '20px 0 15px ' }}>
                          <Button
                            variant='contained'
                            color='info'
                            disabled={!(!errors.sizes && values.sizes.length !== 0)}
                            fullWidth
                            onClick={e => {
                              const time = new Date().toISOString()
                              if (openitemEdit !== false) {
                                const NewitemValue = [...itemValue]
                                const finMyMenu = NewitemValue[openitemEdit]
                                console.log(finMyMenu)
                                finMyMenu.category = values.category
                                finMyMenu.discount = values.discount == '' ? 0 : values.discount
                                finMyMenu.discount_type = values.discount_type
                                finMyMenu.product = values.product
                                finMyMenu.sizes = values.sizes
                                setitemValue(NewitemValue)
                                setopenitemEdit(false)
                              } else {
                                setitemValue([...itemValue, { ...values, id: time }])
                              }

                              setDrawerOpen(false)
                              setValues({
                                menu_name: values.menu_name,
                                discount: 0,
                                discount_type: '',
                                product: ProductData.length !== 0 ? ProductData[0]._id : '',
                                category: CategoryData.length !== 0 ? CategoryData[0]._id : '',
                                sizes: []
                              })
                            }}
                          >
                            {openitemEdit !== false
                              ? locale === 'ar'
                                ? 'تعديل العنصر '
                                : 'Update item '
                              : locale === 'ar'
                              ? 'حفظ العنصر '
                              : 'Save Item'}
                          </Button>
                        </div>
                      </Box>
                    </Drawer>

                    <Grid container sx={{ mt: 4 }}>
                      <Grid item xs={12} sx={{ px: 0 }}>
                        <LoadingButton
                          loading={loading}
                          disabled={values.menu_name === ''}
                          variant='contained'
                          sx={{ mr: 3, float: 'right' }}
                          type='submit'
                        >
                          Submit
                        </LoadingButton>
                      </Grid>
                    </Grid>
                    <Grid container sx={{ mt: 4 }}>
                      <Grid item xs={12} sx={{ px: 0 }}></Grid>
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

export default AddCard
