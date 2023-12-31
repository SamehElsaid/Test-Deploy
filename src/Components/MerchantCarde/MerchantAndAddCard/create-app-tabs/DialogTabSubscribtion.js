// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Component Import
import axios from 'axios'
import PricingPlans from './pricing/PricingPlans'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

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

const DialogTabSubscribtion = ({ data }) => {
  // ** States
  const [show, setShow] = useState(false)
  const [plan, setPlan] = useState('annually')

  const handleChange = e => {
    if (e.target.checked) {
      setPlan('annually')
    } else {
      setPlan('monthly')
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant='h2' sx={{ mb: 3 }}>
          Subscription Plan
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          All plans include 40+ advanced tools and features to boost your product. Choose the best plan to fit your
          needs.
        </Typography>
      </Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <InputLabel
          htmlFor='modal-pricing-switch'
          sx={{
            cursor: 'pointer',
            color: 'text.secondary'
          }}
        >
          Monthly
        </InputLabel>
        <Switch onChange={handleChange} id='modal-pricing-switch' checked={plan === 'annually'} />
        <InputLabel
          htmlFor='modal-pricing-switch'
          sx={{
            cursor: 'pointer',
            color: 'text.secondary'
          }}
        >
          Annually
        </InputLabel>
      </Box>
      <PricingPlans data={data} plan={plan} />
    </Box>
  )
}

export default DialogTabSubscribtion
