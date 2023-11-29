import { useState, useCallback, Fragment, forwardRef, useEffect } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { Tooltip } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import Spinner from 'src/@core/components/spinner'
import { useIntl } from 'react-intl'
import toast from 'react-hot-toast'
import TableHeader from '../TableHeader/TableHeader'

const TableView = ({ type }) => {
  const [value, setValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [ProductData, setProductData] = useState('loading')
  const [filteredRows, setFilteredRows] = useState(false)
  const [loading, setLoading] = useState(false)
  const { locale } = useRouter()
  const [refresh, setRefresh] = useState(0)

  const handleFilter = val => {
    setValue(val)

    const newFilteredRows = ProductData.filter(row => {
      if (type !== 'menu') {
        return val !== ''
          ? row.name_ar.toLowerCase().includes(val.toLowerCase()) ||
              row.name_en.toLowerCase().includes(val.toLowerCase())
          : ProductData
      } else {
        return val !== '' ? row.menu_name.toLowerCase().includes(val.toLowerCase()) : ProductData
      }
    })
    setFilteredRows(newFilteredRows)
  }

  useEffect(() => {
    axios
      .get(`${process.env.API_URL}/api/${type === 'menu' ? `${type}/all` : type}`, { withCredentials: true })
      .then(res => {
        if (refresh !== 0) {
          toast.success(locale === 'ar' ? 'تم الحذف ' : 'Record deleted successfully')
        }
        setProductData(res.data)
        console.log(res.data)
      })
      .catch(err => {
        setProductData(false)
      })
  }, [locale, refresh, type])

  const redirect = type === 'menu' ? `/${locale}/merchant/menu/add` : `/${locale}/merchant/product/add`

  const router = useRouter()
  const { messages } = useIntl()

  const columns = [
    {
      flex: type === 'menu' ? 1 : 0.25,
      minWidth: 280,
      field: 'arabicName',
      headerName: type === 'menu' ? (locale === 'ar' ? 'اسم القائمة' : 'Menu Name') : messages.arName,
      renderCell: params => {
        const { row } = params

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
                {type === 'menu' ? row.menu_name : row.name_ar}
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
      headerName: messages.enName,
      renderCell: ({ row }) => {
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
                {row.name_en}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 170,
      field: type === 'menu' ? 'color' : 'category',
      headerName: type === 'menu' ? 'Status' : messages.category,
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {type !== 'menu' && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  {row.category[`name_${locale}`]}
                </Typography>
              </Box>
            )}
          </Box>
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
                  setLoading(params.row._id)
                  if (loading !== params.row._id) {
                    axios
                      .delete(`${process.env.API_URL}/api/${type}/${params.row._id}`, { withCredentials: true })
                      .then(res => {
                        setRefresh(refresh + 1)
                      })
                      .catch(err => console.log(err))
                      .finally(_ => {
                        setLoading(false)
                      })
                  }
                }}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
            <Tooltip title={locale === 'ar' ? 'تعديل' : 'Edit'}>
              <IconButton
                size='small'
                onClick={() => {
                  // !epwi
                  // !Edie Product With id

                  router.push(`/${locale}/merchant/${type}/add?epwi=${params.row._id}`)
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

  return (
    <Grid container>
      {ProductData && ProductData === 'loading' ? (
        <div className='SwiperColor' style={{ position: 'fixed', inset: 0, zIndex: 1555 }}>
          <Spinner />
        </div>
      ) : (
        <Grid item xs={12}>
          <div>
            <Card>
              <TableHeader value={value} redirect={redirect} type={type} handleFilter={handleFilter} branch='true' />
              <DataGrid
                key={locale}
                autoHeight
                rowHeight={62}
                rows={filteredRows ? filteredRows : ProductData ? ProductData : []}
                columns={type === 'menu' ? columns.filter((_, i) => i !== 1 && i !== 2) : columns}
                getRowId={row => row._id}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onSortModelChange={() => {
                  setProductData([...ProductData].reverse())
                }}
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
          </div>
        </Grid>
      )}
    </Grid>
  )
}

export default TableView
