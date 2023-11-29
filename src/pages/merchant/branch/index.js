// ** React Imports
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import axios from 'axios'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, Tooltip } from '@mui/material'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { Stack } from '@mui/system'
import Spinner from 'src/@core/components/spinner'
import styled from '@emotion/styled'
import toast from 'react-hot-toast'
import TableHeader from 'src/Components/TableHeader/TableHeader'

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const Branch = () => {
  const [value, setValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const { messages } = useIntl()
  const { locale } = useRouter()
  const router = useRouter()
  const [refresh, setRefresh] = useState(0)
  const [showBranchDelete, setShowBranchDelete] = useState(false)
  const [BranchId, setBranchId] = useState('')

  const [filteredRows, setFilteredRows] = useState(false)

  const handleFilter = val => {
    setValue(val)
    if (val.length !== 0) {
      const newFilteredRows = rowData.filter(row => {
        return val !== ''
          ? row.name_en.toLowerCase().includes(val.toLowerCase()) ||
              row.name_ar.toLowerCase().includes(val.toLowerCase())
          : ''
      })
      setFilteredRows(newFilteredRows)
    } else {
      setFilteredRows(false)
    }
  }

  const handleDialogToggle = () => setShowBranchDelete(!showBranchDelete)

  const columns = [
    {
      flex: 0.25,
      minWidth: 150,
      field: 'arabicName',
      sortable: false,
      disableColumnMenu: true,
      headerName: messages.arName,
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
      sortable: false,
      disableColumnMenu: true,
      minWidth: 170,
      field: 'englishName',
      headerName: messages.enName,
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
      sortable: false,
      disableColumnMenu: true,
      minWidth: 170,
      field: 'color',
      headerName: locale === 'ar' ? 'اللوان' : 'Color',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.color}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 170,
      sortable: false,
      disableColumnMenu: true,
      field: 'phone',
      headerName: locale === 'ar' ? 'الهاتف' : 'Phone Number',

      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.phones[0]}
            </Typography>
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      sortable: false,
      disableColumnMenu: true,
      headerName: locale === 'ar' ? 'الحالة' : 'Status',

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
      headerName: messages.actions,
      renderCell: params => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: locale === 'ar' ? 'start' : 'end',
              flexDirection: locale === 'ar' ? 'row-reverse' : ''
            }}
          >
            <Tooltip title={locale === 'ar' ? 'حذف' : 'Delete'}>
              <IconButton
                size='small'
                onClick={() => {
                  setShowBranchDelete(true)
                  setBranchId(params.row._id)
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
            <Tooltip title={locale === 'ar' ? 'تعديل' : 'Edit'}>
              <IconButton
                size='small'
                onClick={() => {
                  router.push(`/${locale}/merchant/branch/add?epwi=${params.row._id}`)
                }}
              >
                <Icon icon='tabler:edit' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    }
  ]

  const [rowData, setRowData] = useState('loading')
  const [loading, setLoading] = useState(true)
  const [stopCall, setStopCall] = useState(false)

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
  useEffect(() => {
    axios
      .get(`${process.env.API_URL}/api/branch`, { withCredentials: true })
      .then(res => {
        const formattedData = res.data.map((row, index) => ({
          ...row,
          id: row._id || index
        }))
        setRowData(formattedData)
      })
      .catch(err => {
        setRowData(false)
      })
      .finally(_ => {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      })
  }, [refresh])

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
        .delete(`${process.env.API_URL}/api/branch/${data}`, { withCredentials: true })
        .then(res => {
          if (res.status == 200) {
            console.log(res.data)
            toast.success(locale === 'ar' ? 'تم الالغاء بنجاح ' : 'Deleted successfully')
            setRefresh(refresh + 1)
          }
        })
        .catch(err => console.log(err))
        .finally(_ => {
          setStopCall(false)
        })
    }, 2000)

    setShowBranchDelete(false)
  }

  return (
    <>
      {loading && (
        <div className='SwiperColor' style={{ position: 'fixed', inset: 0, zIndex: 1555 }}>
          <Spinner />
        </div>
      )}
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <TableHeader type='branch' value={value} handleFilter={handleFilter} branch='true' />
            <DataGrid
              components={{
                NoRowsOverlay: () => (
                  <Stack height='100%' alignItems='center' flexDirection='row' gap={2} justifyContent='center'>
                    <h2>{locale === 'ar' ? 'لا يوجد فرع' : 'No Branch'}</h2>{' '}
                  </Stack>
                )
              }}
              autoHeight
              localeText={{
                MuiTablePagination: {
                  labelDisplayedRows: ({ from, to, count }) =>
                    locale === 'ar' ? `${from} - ${to} من ${count}` : `${from} - ${to} of more than ${count}`,
                  labelRowsPerPage: locale === 'ar' ? 'الصفوف لكل صفحة :' : 'Rows per page:'
                },
                columnMenuHideColumn: locale === 'ar' ? 'اخفاء هذا العمود' : 'Hide column',
                columnMenuManageColumns: locale === 'ar' ? 'التحكم في الاعمدة' : 'Manage columns'
              }}
              rowHeight={62}
              rows={rowData ? (rowData !== 'loading' ? (filteredRows ? filteredRows : rowData) : []) : []}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Card>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth='sm'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        onClose={handleDialogToggle}
        open={showBranchDelete}
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
            {locale === 'ar' ? 'حذف الفرع' : 'Delete Branch'}
          </Typography>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary' }}>
              {locale === 'ar'
                ? 'هل أنت متأكد من أنك تريد حذف هذه الفرع'
                : 'Are you sure you want to delete this Branch'}
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
          <Button variant='contained' color='error' sx={{ mr: 1 }} onClick={() => Deleteing(BranchId)}>
            {locale === 'ar' ? 'حذف' : 'Delete'}
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleDialogToggle}>
            {locale === 'ar' ? 'الغاء' : 'Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Branch
