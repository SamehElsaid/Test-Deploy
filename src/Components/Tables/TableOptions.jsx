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
import { Box } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { TableVirtuoso } from 'react-virtuoso'

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
  Table: props => <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />)
}

export default function TableOptions({ data, deleteItem, editItems, product, category }) {
  const { locale } = useRouter()

  const columns = [
    {
      width: 200,
      label: locale === 'ar' ? 'الاسم بالعربية' : 'Arabic Name',
      dataKey: 'name_ar'
    },
    {
      width: 200,
      label: locale === 'ar' ? 'الاسم بالانجليزية' : 'English Name',
      dataKey: 'name_en'
    },
    {
      width: 200,
      label: locale === 'ar' ? 'نوع الاختيار' : 'Option type',
      dataKey: 'option_type'
    },
    {
      width: 120,
      label: locale === 'ar' ? 'التحكم' : 'Actions',
      dataKey: 'id',
      numeric: true
    }
  ]

  const FixedHeaderContent = () => {
    return (
      <TableRow>
        {columns.map(column => (
          <TableCell
            key={column.dataKey}
            variant='head'
            align={locale === 'ar' ? 'right' : 'left'}
            style={{ width: column.width }}
            sx={{
              backgroundColor: 'background.paper'
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    )
  }

  const RowContent = (_index, row, onDeleteClick, onEditItems) => {
    return (
      <React.Fragment>
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
              row[column.dataKey]
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
          fixedHeaderContent={FixedHeaderContent}
          itemContent={(index, row) => {
            return RowContent(index, row.sub_items, deleteItem, editItems, row)
          }}
        />
      </Paper>
    </div>
  )
}
