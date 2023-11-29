// ** React Imports
import { useEffect, useRef, useState } from 'react'

// ** MUI Imports
import 'react-datepicker/dist/react-datepicker.css'

import DatePicker from 'react-datepicker'
import CustomInput from '../CustomInput/CustomInput'

const PickersTime = ({ popperPlacement, label, setFieldValue, values }) => {
  const [time, setTime] = useState()
  const [open, setopen] = useState(false)
  const perantOFAccount = useRef()

  const handleTimeChange = date => {
    setopen(false)
    setTime(date)
    if (label === 'From' || label === 'من') {
      setFieldValue('time_from', date ? date.toLocaleString() : '')
    } else {
      setFieldValue('time_to', date ? date.toLocaleString() : '')
    }
  }
  useEffect(() => {
    const handleClickOutSide = e => {
      if (perantOFAccount.current && !perantOFAccount.current.contains(e.target)) {
        setopen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutSide)

    return () => {
      document.removeEventListener('mousedown', handleClickOutSide)
    }
  }, [perantOFAccount])

  return (
    <div ref={perantOFAccount} style={{ position: 'relative' }}>
      <div onClick={() => setopen(!open)} className='numberControl'>
        {values.split(',')[1]}
      </div>
      <DatePicker
        style={{ width: '500px' }}
        showTimeSelect
        selected={time}
        open={open}
        onChange={handleTimeChange}
        showTimeSelectOnly
        id='time-only-picker'
        popperPlacement={popperPlacement}
        customInput={<CustomInput label={label} readOnly />}
      />
    </div>
  )
}

export default PickersTime
