// ** React Imports
import { forwardRef } from 'react'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

const PickersComponent = forwardRef(({ ...props }, ref) => {
  // ** Props
  const { label, readOnly } = props

  return (
    <CustomTextField
      {...props}
      readOnly
      inputRef={ref}
      label={label || ''}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  )
})

export default PickersComponent
