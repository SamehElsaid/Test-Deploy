import { useRef, useState } from 'react'

import { Button, Menu, MenuItem } from '@mui/material'
import { useRouter } from 'next/router'
import ReactExport from 'react-data-export'
import { useIntl } from 'react-intl'
import Icon from 'src/@core/components/icon'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

const ExcelSh = ({ dataTable, label }, ref) => {
  const [jsonFileName, setJsonFileName] = useState('my_data.json')
  const { locale } = useRouter()
  const { messages } = useIntl()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  console.log(label)
  const excelFileRef = useRef()

  const dataSet = []
  dataTable.forEach(menu => {
    menu.items.forEach(item => {
      item.sizes.forEach(size => {
        dataSet.push({
          menu_name: menu.menu_name,
          category_name: item.category.name_en,
          product_name: item.product.name_en,
          size_name: size.name_en,
          price: size.price,
          price_discounted: size.price_discounted,
          discount: item.discount,
          discount_type: item.discount_type,
          POS_ID: menu.POS_ID
        })
      })
    })
  })

  const columns = [
    { label: 'Menu Name', value: 'menu_name' },
    { label: 'Category Name', value: 'category_name' },
    { label: 'Product Name', value: 'product_name' },
    { label: 'Size Name', value: 'size_name' },
    { label: 'Price', value: 'price' },
    { label: 'Price Discounted', value: 'price_discounted' },
    { label: 'Discount', value: 'discount' },
    { label: 'Discount Type', value: 'discount_type' },
    { label: 'POS_ID', value: 'POS_ID' }
  ]

  return (
    <div>
      <ExcelFile ref={excelFileRef} element={label} filename='my_data'>
        <ExcelSheet data={dataSet} name='Coupons'>
          {columns.map(column => (
            <ExcelColumn key={column.value} label={column.label} value={column.value} />
          ))}
        </ExcelSheet>
      </ExcelFile>
    </div>
  )
}

export default ExcelSh
