import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { PiSelectionSlashLight } from 'react-icons/pi'
import CustomChip from 'src/@core/components/mui/chip'
import Tooltip from '@mui/material/Tooltip'
import { Box, Button } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { TableVirtuoso } from 'react-virtuoso'
import { IoIosArrowRoundDown } from 'react-icons/io'
import styled from '@emotion/styled'

const CustomizerSpacing = styled(Button)(({ theme }) => ({
  width: '25px ',
  minWidth: '25px ',
  height: '25px',
  borderRadius: '50%',
  boxShadow: '0px 4px 18px 0px rgba(15, 20, 34, 0.1)',
  position: 'absolute',
  right: '10px',
  top: '15px',

  // transform: ' translateY(-50%)',
  fontSize: '22px',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#24283c'
  }
}))

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
  Table: props => <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />)
}

export default function TableMenu({ data, deleteItem, editItems, product, category, handleSort, sortFn }) {
  const sdsad = 'sdadsa'
  const { locale } = useRouter()

  const columns = [
    {
      width: 200,
      label: locale === 'ar' ? 'الفئة' : 'category',
      dataKey: 'category'
    },

    {
      width: 200,
      label: locale === 'ar' ? 'المنتج' : 'Product',
      dataKey: 'product'
    },

    {
      width: 200,
      label: locale === 'ar' ? 'الخصم' : 'discount',
      dataKey: 'discount'
    },
    {
      width: 200,
      label: locale === 'ar' ? 'نوع الخصم' : 'discount Type',
      dataKey: 'discount_type'
    },
    {
      width: 120,
      label: locale === 'ar' ? 'التحكم' : 'Actions',
      dataKey: 'id',
      numeric: true
    }
  ]

  const FixedHeaderContent = (handleSort, sortFn) => {
    console.log(sdsad)

    return (
      <TableRow>
        {columns.map(column => (
          <TableCell
            key={column.dataKey}
            variant='head'
            align={locale === 'ar' ? 'right' : 'left'}
            style={{ width: column.width }}
            sx={{
              backgroundColor: 'background.paper',
              position: 'relative'
            }}
          >
            <CustomizerSpacing onClick={handleSort} style={{ zIndex: 555 }}>
              <IoIosArrowRoundDown
                style={{ transform: sortFn ? 'rotate(180deg)' : '', transition: 'transform 0.3s linear' }}
              />
            </CustomizerSpacing>
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    )
  }

  const RowContent = (_index, onDeleteClick, onEditItems, row, product, category, locale) => {
    return (
      <React.Fragment>
        <>{console.log(category)}</>
        {columns.map(column => (
          <TableCell key={column.dataKey} align={locale === 'ar' ? 'right' : 'left'}>
            {column.dataKey === 'id' ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: locale === 'ar' ? 'start' : 'end',
                  flexDirection: locale === 'ar' ? 'row-reverse' : ''
                }}
              >
                <Tooltip title={locale === 'ar' ? 'حذف' : 'Delete'}>
                  <IconButton size='small' onClick={() => onDeleteClick(_index)}>
                    <Icon icon='tabler:trash' />
                  </IconButton>
                </Tooltip>
                <Tooltip title={locale === 'ar' ? 'تعديل' : 'Edit'}>
                  <IconButton
                    size='small'
                    onClick={() => {
                      onEditItems(_index, data[_index])
                    }}
                  >
                    <Icon icon='tabler:edit' fontSize={20} />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : column.dataKey === 'option_type' ? (
              <CustomChip
                rounded
                size='small'
                skin='light'
                color={row.option_type === 'single' ? 'success' : 'warning'}
                label={
                  row.option_type === 'single'
                    ? locale === 'ar'
                      ? 'فردي'
                      : 'single'
                    : locale === 'ar'
                    ? 'متعدد'
                    : 'multiple'
                }
                sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
              />
            ) : (
              <>
                {column.dataKey === 'product' ? (
                  <>{product.find(ele => ele._id === row[column.dataKey])[`name_${locale}`]}</>
                ) : column.dataKey === 'category' ? (
                  <>{category.find(ele => ele._id === row[column.dataKey])[`name_${locale}`]}</>
                ) : column.dataKey === 'discountType' ? (
                  <>
                    {column.dataKey !== 'amount'
                      ? locale === 'ar'
                        ? 'نسبة مئوية'
                        : 'Percentage'
                      : locale === 'ar'
                      ? 'قمية ثابتة'
                      : 'Amount'}
                  </>
                ) : (
                  row[column.dataKey]
                )}
              </>
            )}
          </TableCell>
        ))}
      </React.Fragment>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      {data.length === 0 && (
        <div className='NoPhone'>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
            <PiSelectionSlashLight style={{ fontSize: '30px' }} />
            <h2>{locale === 'ar' ? 'لا يوجد اختيارات' : 'No Options'}</h2>
          </div>
        </div>
      )}
      <Paper style={{ height: '200px', width: '100%' }}>
        <TableVirtuoso
          data={data}
          components={VirtuosoTableComponents}
          fixedHeaderContent={s => FixedHeaderContent(handleSort, sortFn)}
          itemContent={(index, row) => {
            console.log(row)

            return RowContent(index, deleteItem, editItems, row, product, category, locale)
          }}
        />
      </Paper>
    </div>
  )
}
