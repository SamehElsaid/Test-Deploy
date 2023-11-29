import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import ReactExport from 'react-data-export'
import { useIntl } from 'react-intl'
import Icon from 'src/@core/components/icon'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

const ExcelSh = ({ dataTable }) => {
  const { locale } = useRouter()
  const { messages } = useIntl()

  const dataSet = dataTable.map(item => ({
    // Map your data fields here
    code: item.code,
    title_en: item.title_en,
    title_ar: item.title_ar,
    status: item.status,
    discount_type: item.discount_type,
    discount: item.discount,

    // Assuming `branch` is an object with `name_en` and `name_ar` properties
    branch: item.branch ? item.branch[`name_${locale}`] : ''
  }))

  const columns = [
    // Define your columns here
    { label: 'Code', value: 'code' },
    { label: 'Title English', value: 'title_en' },
    { label: 'Title Arabic', value: 'title_ar' },
    { label: 'status', value: 'status' },
    { label: 'Discount Type', value: 'discount_type' },
    { label: 'Discount', value: 'discount' },
    { label: 'Branch', value: 'branch' }
  ]

  return (
    <ExcelFile
      element={
        <Button color='secondary' variant='tonal' style={{ gap: '10px' }} startIcon={<Icon icon='tabler:upload' />}>
          {messages.Export}
        </Button>
      }
      filename='my_data'
    >
      <ExcelSheet data={dataSet} name='Coupons'>
        {columns.map(column => (
          <ExcelColumn key={column.value} label={column.label} value={column.value} />
        ))}
      </ExcelSheet>
    </ExcelFile>
  )
}

export default ExcelSh
