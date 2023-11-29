import { useState, useEffect, forwardRef } from 'react'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import Merchantslogo from './Merchantslogo'
import { Skeleton } from '@mui/material'
import { REMOVE_merchantPopUp, SET_merchantPopUp } from 'src/store/apps/addMerchantDialog'
import MerchantAndAddCard from './MerchantAndAddCard'
import TabAccount from './TabAddMerchant'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const rolesArr = [
  'User Management',
  'Content Management',
  'Disputes Management',
  'Database Management',
  'Financial Management',
  'Reporting',
  'API Control',
  'Repository Management',
  'Payroll'
]

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

const MerchantCards = props => {
  const { handleDialogToggle, hidden, addMerchant, AllMerchants, refresh, setrefresh } = props

  const router = useRouter()
  const { locale } = useRouter()

  const popUp = useSelector(mer => mer.merchantPopUp)
  const dispatch = useDispatch()

  // ** States
  const [open, setOpen] = useState(false)
  const [AddCard, setAddCard] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('Add')
  const [selectedCheckbox, setSelectedCheckbox] = useState([])
  const [dialogData, setDialogData] = useState()
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false)

  const OpenMerchantAndAddCard = () => {
    setAddCard(true)
  }

  const handleClickOpen = () => {
    dispatch(SET_merchantPopUp())
    setOpen(true)
  }

  useEffect(() => {
    if (popUp.data === 'open') {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [popUp])

  const handleClose = () => {
    dispatch(REMOVE_merchantPopUp())
    setOpen(false)
  }

  const togglePermission = id => {
    const arr = selectedCheckbox
    if (selectedCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1)
      setSelectedCheckbox([...arr])
    } else {
      arr.push(id)
      setSelectedCheckbox([...arr])
    }
  }

  const setShow = () => {
    setAddCard(false)
  }

  const handleSelectAllCheckbox = () => {
    if (isIndeterminateCheckbox) {
      setSelectedCheckbox([])
    } else {
      rolesArr.forEach(row => {
        const id = row.toLowerCase().split(' ').join('-')
        togglePermission(`${id}-read`)
        togglePermission(`${id}-write`)
        togglePermission(`${id}-create`)
      })
    }
  }

  const handleCardClick = data => {
    setDialogData(data)
  }

  useEffect(() => {
    if (selectedCheckbox.length > 0 && selectedCheckbox.length < rolesArr.length * 3) {
      setIsIndeterminateCheckbox(true)
    } else {
      setIsIndeterminateCheckbox(false)
    }
  }, [selectedCheckbox])

  const renderCards = () =>
    AllMerchants.map((item, index) => (
      <Merchantslogo item={item} index={index} key={index} onCardClick={handleCardClick} />
    ))

  return (
    <Grid container spacing={6} className='match-height'>
      {AllMerchants && AllMerchants.length !== 0
        ? renderCards()
        : Array.from({ length: 10 }, (_, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Card>
                <CardContent style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <Box sx={{ mb: 1.5 }}>
                    <Skeleton variant='circular' width={60} height={60} />
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Box>
                      <Skeleton
                        animation='wave'
                        variant='h4'
                        height={10}
                        width='100%'
                        style={{ width: '100% !important' }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
      <Grid item xs={12} sm={12} lg={12} sx={{ mt: 5 }}>
        <Card className='underContent' sx={{ cursor: 'pointer' }}>
          <Grid container sx={{ height: '100%' }}>
            <Grid sx={{ width: '100%' }}>
              <Typography sx={{ color: 'text.secondary', mt: 2 }}>
                {addMerchant ? "Add Merchant, if it doesn't exist." : "Add role, if it doesn't exist."}{' '}
              </Typography>
              <CardContent>
                <Box
                  sx={{
                    height: '100%',
                    minHeight: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img height={142} alt='add-role' src='/images/pages/add-new-role-illustration.png' />
                </Box>
                <Box sx={{ textAlign: 'center', mt: '-1px' }}>
                  <Button
                    variant='contained'
                    onClick={() => {
                      OpenMerchantAndAddCard()
                    }}
                  >
                    {addMerchant ? 'Add Merchant' : 'Add New Role'}
                  </Button>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        onClose={() => handleClose()}
        TransitionComponent={Transition}
        onBackdropClick={() => handleClose()}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        open={open}
      >
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            py: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`]
          }}
        >
          <CustomCloseButton onClick={() => handleClose()}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <TabAccount item={dialogData} refresh={refresh} setrefresh={setrefresh}></TabAccount>
        </DialogContent>
      </Dialog>

      <MerchantAndAddCard AddCard={AddCard} setShow={setShow}></MerchantAndAddCard>
    </Grid>
  )
}

export default MerchantCards
