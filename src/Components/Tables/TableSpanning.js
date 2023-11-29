import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { AiOutlineDelete } from 'react-icons/ai'
import { HiMiniDevicePhoneMobile } from 'react-icons/hi2'
import { TableVirtuoso } from 'react-virtuoso'

function createData(id, phone) {
  console.log({ id, phone })

  return { id, phone }
}

const columns = [
  {
    width: 200,
    label: 'Phone',
    dataKey: 'phone'
  },
  {
    width: 120,
    label: 'delete',
    dataKey: 'id',
    numeric: true
  }
]

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
  Table: props => <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />)
}

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map(column => (
        <TableCell
          key={column.dataKey}
          variant='head'
          align={column.numeric || false ? 'right' : 'left'}
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

function rowContent(_index, row, onDeleteClick) {
  return (
    <React.Fragment>
      {columns.map(column => (
        <TableCell key={column.dataKey} align={column.numeric || false ? 'right' : 'left'}>
          {column.dataKey === 'id' ? (
            <AiOutlineDelete onClick={() => onDeleteClick(row.id)} style={{ fontSize: '18px', cursor: 'pointer' }} />
          ) : (
            row[column.dataKey]
          )}
        </TableCell>
      ))}
    </React.Fragment>
  )
}

export default function TableSpanning({ data, setFieldValue }) {
  const HandleDelete = id => {
    const newData = [...data]
    const FilterData = newData.filter(old => old.id !== id)
    setFieldValue('phones', FilterData)
  }

  return (
    <div style={{ position: 'relative' }}>
      {data.length === 0 && (
        <div className='NoPhone'>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
            <HiMiniDevicePhoneMobile style={{ fontSize: '30px' }} />
            <h2>No Phones</h2>
          </div>
        </div>
      )}
      <Paper style={{ height: '200px', width: '100%' }}>
        <TableVirtuoso
          data={data}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={(index, row) => rowContent(index, row, HandleDelete)}
        />
      </Paper>
    </div>
  )
}
