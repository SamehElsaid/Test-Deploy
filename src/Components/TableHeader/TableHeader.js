// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Menu, MenuItem } from '@mui/material'
import ExcelSh from 'src/views/apps/ExcelSh'
import ExcelSheetforMenu from 'src/views/apps/ExcelSheetforMenu'

const TableHeader = props => {
  // ** Props
  const { handleFilter, toggle, value, type, rows } = props
  console.log({ rows })
  const { locale } = useRouter()
  const router = useRouter()
  const { messages } = useIntl()
  const [Coupons, setCouponData] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [jsonFileName, setJsonFileName] = useState('menu.json')

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleExportClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const RedirectToMerchant = () => {
    router.push(`/${locale}/merchant/${type}/add`)
  }
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
  }, [])
  const excelShRef = useRef()

  const handleExportExcel = () => {
    // Assuming ExcelSh is a default export from the ExcelSh component
    excelShRef.current.handleExportClick()
    setAnchorEl(null)
  }

  const handleExportJson = () => {
    const jsonData = JSON.stringify(rows, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = jsonFileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setAnchorEl(null)
  }

  const handleImportJson = file => {
    // Implement your logic to handle the imported JSON file
    const reader = new FileReader()
    reader.onload = e => {
      const importedData = JSON.parse(e.target.result)
      console.log('Imported JSON data:', importedData)

      importedData.map(data => {
        delete data.POS_ID
        delete data._id
        data.map(ele => {
          category = ele.category._id
          product = ele.product._id
        })
      })

      axios
        .post(`${process.env.API_URL}/api/menu`, importedData[0], { withCredentials: true })
        .then(response => {
          // Handle the response
          console.log('Response:', response.data)
          toast.success(response.data.message)
        })
        .catch(error => {
          if (error.response?.data.message.includes('E11000 duplicate key error collection')) {
            toast.error('this category is already exist ')
          }
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
    }
    reader.readAsText(file)
    console.log(file)
  }

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box>
        {rows == undefined && <Box></Box>}
        {rows !== undefined && (type == 'coupon' || type == 'redeemCoupon') && <ExcelSh dataTable={rows} />}

        {type == 'menu' && (
          <>
            <Button
              sx={{ ml: 2 }}
              color='secondary'
              onClick={handleExportClick}
              variant='tonal'
              style={{ gap: '10px' }}
              startIcon={<Icon icon='tabler:upload' />}
            >
              {messages.Export}
            </Button>
            <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose} id='user-view-overview-export'>
              <MenuItem onClick={() => handleExportExcel}>
                <ExcelSheetforMenu ref={excelShRef} dataTable={rows} label='EXCEL' />
              </MenuItem>
              <MenuItem onClick={handleExportJson}>JSON</MenuItem>
            </Menu>
          </>
        )}
      </Box>
      <Box sx={{ gap: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomTextField
          value={value}
          placeholder={locale === 'ar' ? 'البحث' : 'Search'}
          onChange={e => handleFilter(e.target.value)}
        />

        <Button
          onClick={toggle == undefined ? RedirectToMerchant : toggle}
          variant='contained'
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          {type === 'branch' && (locale !== 'ar' ? 'Add branch' : ' اضافة فرع  ')}
          {type === 'product' && (locale !== 'ar' ? 'Add Product' : 'اضافة منتج')}
          {type === 'category' && (locale !== 'ar' ? 'Add Category' : 'اضافة فئة')}
          {type === 'coupon' && (locale !== 'ar' ? 'Add Coupon' : 'اضافة كود الخصم')}
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
