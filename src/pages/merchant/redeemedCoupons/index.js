// ** React Imports
import { useState, useEffect, useCallback, Fragment } from 'react'
import { useRef, useMemo } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  InputAdornment,
  ListItemText,
  Menu,
  Step,
  StepLabel,
  Stepper,
  Switch,
  Tab
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { addUser } from 'src/store/apps/user'

import { yupResolver } from '@hookform/resolvers/yup'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import { styled } from '@mui/material/styles'
import { ChromePicker, SketchPicker } from 'react-color'

import TableHeader from 'src/Components/TableHeader/TableHeader'
import StepperCustomDot from 'src/Components/StepperCustomDot'
import AutocompleteCountry from 'src/Components/forms/AutoComplete'
import PickersTime from 'src/Components/DateTimePicker'

// ** renders client column
const userRoleObj = {
  admin: { icon: 'tabler:device-laptop', color: 'secondary' },
  author: { icon: 'tabler:circle-check', color: 'success' },
  editor: { icon: 'tabler:edit', color: 'info' },
  maintainer: { icon: 'tabler:chart-pie-2', color: 'primary' },
  subscriber: { icon: 'tabler:user', color: 'warning' }
}

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

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// ** renders client column
const renderClient = row => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.fullName ? row.fullName : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const RowOptions = ({ id }) => {
  // ** Hooks
  const dispatch = useDispatch()

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href='/apps/user/view/account'
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.25,
    minWidth: 280,
    field: 'arabicName',
    headerName: ' Arabic Name',
    renderCell: ({ row }) => {
      const { fullName, email } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
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
              {fullName}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 170,
    field: 'englishName',
    headerName: ' English Name',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar
            skin='light'
            sx={{ mr: 4, width: 30, height: 30 }}
            color={userRoleObj[row.role].color || 'primary'}
          >
            <Icon icon={userRoleObj[row.role].icon} />
          </CustomAvatar>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.role}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 170,
    field: 'color',
    headerName: 'Color',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar
            skin='light'
            sx={{ mr: 4, width: 30, height: 30 }}
            color={userRoleObj[row.role].color || 'primary'}
          >
            <Icon icon={userRoleObj[row.role].icon} />
          </CustomAvatar>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.role}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 170,
    field: 'phone',
    headerName: 'Phone Number',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar
            skin='light'
            sx={{ mr: 4, width: 30, height: 30 }}
            color={userRoleObj[row.role].color || 'primary'}
          >
            <Icon icon={userRoleObj[row.role].icon} />
          </CustomAvatar>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.role}
          </Typography>
        </Box>
      )
    }
  },

  {
    flex: 0.1,
    minWidth: 110,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }) => {
      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row.status}
          color={userStatusObj[row.status]}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions id={row.id} />
  }
]

const RedeemCoupons = ({ apiData }) => {
  const initialData = {
    arabicName: '',
    englishName: '',
    color: '',
    phones: '',
    status: '',
    tax: '',
    tax_type: 'percentage',
    address: {
      country: '',
      state: '',
      city: '',
      street: '',
      additional_info: '',
      location: {
        type: 'Point',
        coordinates: [0, 0]
      }
    },
    delivery_cost: '',

    extra_km_fee: '',
    max_delivery_distance: '',
    delivery_area: '',
    coordinates: null,
    delivery_time: '',
    working_hours: ''
  }

  // Initialize formData with initialData

  // ** State
  const [formData, setFormData] = useState(initialData)
  const [day, setDay] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [activeStep, setActiveStep] = useState(0)
  const [color, setColor] = useState('')
  const [checked, setChecked] = useState(true)
  const [hidden, setDisplayColorPicker] = useState(false)
  const [dayName, setPersonName] = useState([])

  const handleChangeDay = event => {
    setPersonName(event.target.value)
  }

  const handleClosecolor = () => {
    setDisplayColorPicker(false)
  }

  const handleChangecolor = newColor => {
    setColor(newColor.hex)
    console.log(newColor.hex)
  }

  const handleChange = event => {
    setChecked(event.target.checked)
    console.log(checked)
    formData.status = checked ? 'active' : 'inactive'
    console.log(formData.status)
  }

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
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

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const schema = yup.object().shape({
    email: yup.string().email().required()
  })

  const {
    reset,
    control,
    setValueforUser,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    initialData,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = async data => {
    {
      e => e.preventDefault()
    }
    setLoading(true)
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    await sleep(2000)
    setLoading(false)
    toast.success('Form Submitted')
    if (store.allData.some(u => u.email === data.email)) {
      store.allData.forEach(u => {
        if (u.email === data.email) {
          setError('email', {
            message: 'Email already exists!'
          })
        }
      })
    } else {
      dispatch(addUser({ ...data, role, currentPlan: plan }))

      // reset()
    }
  }
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  const title = 'Add new menu'
  const Search = 'Search menu '

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

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handlePrefixChange = selectedOption => {
    setSelectedPrefix(selectedOption)
  }

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <Fragment>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='arabicName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Arabic Name'
                      onChange={onChange}
                      error={Boolean(errors.arabicName)}
                      aria-describedby='validation-basic-first-name'
                      {...(errors.arabicName && { helperText: 'This field is required' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  type='text'
                  label='English Name'
                  rules={{ required: true }}
                  value={formData.englishName}
                  onChange={e => handleFormChange('englishName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Color'
                  readonly
                  type='text'
                  rules={{ required: true }}
                  value={color}
                  onChange={e => handleFormChange('color', e.target.value)}
                  onClick={() => setDisplayColorPicker(!hidden)}
                />{' '}
                <div style={{ position: 'absolute', zIndex: '2' }}>
                  {hidden ? (
                    <div onClick={handleClosecolor} className='color-picker-overlay'>
                      <SketchPicker color={color} onChange={handleChangecolor} />
                      <p>Selected Color: {color}</p>
                    </div>
                  ) : null}
                </div>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '19px' }}>
                  <Grid item xs={4} sm={4} sx={{ padding: '0px' }}>
                    <AutocompleteCountry />
                  </Grid>
                  <Grid item xs={9} sm={9}>
                    <CustomTextField
                      fullWidth
                      type='number'
                      placeholder='123-456-789'
                      rules={{ required: true }}
                      value={formData.phones}
                      onChange={e => handleFormChange('phones', e.target.value)}
                    />
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  type='number'
                  defaultValue='14'
                  label='Tax'
                  rules={{ required: true }}
                  value={formData.tax}
                  onChange={e => handleFormChange('tax', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='percentage'
                  label='Tax Type'
                  SelectProps={{
                    value: formData.tax_type,
                    onChange: e => handleFormChange('tax_type', e.target.value)
                  }}
                >
                  <MenuItem value='percentage'>percentage</MenuItem>
                  <MenuItem value='fixed'>fixed</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  labelPlacement='top'
                  sx={{ mr: 50 }}
                  label='Status'
                  control={<Switch checked={checked} onChange={handleChange} defaultChecked />}
                />
              </Grid>
            </Grid>
          </Fragment>
        )
      case 1:
        return (
          <Fragment key={step}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  type='text'
                  label='Country'
                  placeholder='Country'
                  value={formData.country}
                  onChange={e => handleFormChange('country', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  type='text'
                  label='State'
                  placeholder='state'
                  value={formData.state}
                  onChange={e => handleFormChange('state', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  type='text'
                  label='City'
                  placeholder='city'
                  value={formData.city}
                  onChange={e => handleFormChange('city', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  type='text'
                  label='Street'
                  placeholder='street'
                  value={formData.street}
                  onChange={e => handleFormChange('street', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  type='text'
                  label='Additional Info'
                  placeholder='additional_info'
                  value={formData.additional_info}
                  onChange={e => handleFormChange('additional_info', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  type='text'
                  readonly
                  rules={{ required: true }}
                  label='Coordinates'
                  placeholder='coordinates'
                  value={value}
                  onChange={e => handleFormChange('coordinates', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12}></Grid>
            </Grid>
          </Fragment>
        )
      case 2:
        return (
          <Fragment key={step}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  type='number'
                  defaultValue='15'
                  label='Delivery cost'
                  value={formData.tax}
                  rules={{ required: true }}
                  onChange={e => handleFormChange('delivery_cost', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  type='number'
                  defaultValue='1 EGP'
                  label='Extra km fee'
                  value={formData.extra_km_fee}
                  onChange={e => handleFormChange('extra_km_fee', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12}></Grid>
            </Grid>
          </Fragment>
        )
      case 3:
        return (
          <Fragment key={step}>
            <Grid container spacing={5}>
              <Grid item xs={4} sm={4}>
                <CustomTextField
                  select
                  fullWidth
                  label='Day'
                  id='select-multiple-checkbox'
                  SelectProps={{
                    MenuProps,
                    multiple: true,
                    value: dayName,
                    onChange: e => handleChangeDay(e),
                    renderValue: selected => selected.join(', ')
                  }}
                >
                  {Days.map(name => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={dayName.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={4} sm={4}>
                <PickersTime label='From' />
              </Grid>
              <Grid item xs={4} sm={4}>
                <PickersTime label='To' />
              </Grid>
            </Grid>
          </Fragment>
        )
      default:
        return 'Unknown Step'
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='contained' onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return (
        <form onSubmit={onSubmit}>
          <Grid container spacing={5} sx={{ marginLeft: '0' }}>
            {getStepContent(activeStep)}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant='tonal' color='secondary' disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Button variant='contained' onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )
    }
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
            handleFilter={handleFilter}
            branch='true'
            toggle={toggleAddUserDrawer}
            type='redeemCoupon'
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={store.data}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
      <Dialog
        fullWidth
        maxWidth='md'
        open={addUserOpen}
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
          '& .MuiDialog-paper': { overflow: 'visible' }
        }}
      >
        <DialogContent>
          <CustomCloseButton onClick={handleReset}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Fragment>
            <StepperWrapper>
              <Stepper sx={{ mt: 15 }} activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => {
                  return (
                    <Step key={index}>
                      <StepLabel StepIconComponent={StepperCustomDot}>
                        <div className='step-label'>
                          <div>
                            <Typography className='step-title'>{step.title}</Typography>
                            <Typography className='step-subtitle'>{step.subtitle}</Typography>
                          </div>
                        </div>
                      </StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
            </StepperWrapper>
            <Card sx={{ mt: 15 }}>
              <CardContent>{renderContent()}</CardContent>
            </Card>
          </Fragment>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}

export default RedeemCoupons
