// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hook Imports
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Tab Content Imports
import DialogTabDetails from '../MerchantAndAddCard/create-app-tabs/DialogTabDetails'
import DialogTabBilling from '../MerchantAndAddCard/create-app-tabs/DialogTabBilling'
import DialogTabDatabase from '../MerchantAndAddCard/create-app-tabs/DialogTabDatabase'
import DialogTabFramework from '../MerchantAndAddCard/create-app-tabs/DialogTabFramework'
import DialogTabSubscribtion from '../MerchantAndAddCard/create-app-tabs/DialogTabSubscribtion'
import axios from 'axios'
import TabAccount from '../TabAddMerchant'
import { Grid } from '@mui/material'
import mock from 'src/@fake-db/mock'
import pricing from 'src/@fake-db/pages/pricing'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const TabLabel = props => {
  const { icon, title, subtitle, active } = props
  console.log(pricing)

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            ...(active
              ? { color: 'common.white', backgroundColor: 'primary.main' }
              : { backgroundColor: 'action.selected' })
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant='h6'>{title}</Typography>
          <Typography sx={{ textTransform: 'none', color: 'text.disabled', fontWeight: 500 }}>{subtitle}</Typography>
        </Box>
      </Box>
    </div>
  )
}
const tabsArr = ['MerchantTab', 'SubscribtionTab', 'paymentTab', 'submitTab']

const MerchantAndAddCard = ({ AddCard, setShow }) => {
  // ** States
  const [activeTab, setActiveTab] = useState('MerchantTab')

  // ** Hook
  const { settings } = useSettings()

  // ** Var
  const { direction } = settings

  const handleClose = () => {
    setShow(false)
    setActiveTab('MerchantTab')
  }

  const [apiData, setApiData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('src/@fake-db/pages/pricing')
        setApiData(response.data)
        console.log(response.data, 'lplplplplplp')
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])
  const nextArrow = direction === 'ltr' ? 'tabler:arrow-right' : 'tabler:arrow-left'
  const previousArrow = direction === 'ltr' ? 'tabler:arrow-left' : 'tabler:arrow-right'

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

  const renderTabFooter = () => {
    const prevTab = tabsArr[tabsArr.indexOf(activeTab) - 1]
    const nextTab = tabsArr[tabsArr.indexOf(activeTab) + 1]

    return (
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant='tonal'
          color='secondary'
          disabled={activeTab === 'MerchantTab'}
          onClick={() => setActiveTab(prevTab)}
          startIcon={<Icon icon={previousArrow} />}
        >
          Previous
        </Button>
        <Button
          variant='contained'
          color={activeTab === 'submitTab' ? 'success' : 'primary'}
          endIcon={<Icon icon={activeTab === 'submitTab' ? 'tabler:check' : nextArrow} />}
          onClick={() => {
            if (activeTab !== 'submitTab') {
              setActiveTab(nextTab)
            } else {
              handleClose()
            }
          }}
        >
          {activeTab === 'submitTab' ? 'Submit' : 'Next'}
        </Button>
      </Box>
    )
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={AddCard}
        scroll='body'
        maxWidth='lg'
        onClose={handleClose}
        onBackdropClick={handleClose}
        TransitionComponent={Transition}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pr: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pl: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(11)} !important`],
            py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Create App
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Provide data with this form to create your app.</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            <TabContext value={activeTab}>
              <TabList
                orientation='vertical'
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  border: 0,
                  minWidth: 200,
                  '& .MuiTabs-indicator': { display: 'none' },
                  '& .MuiTabs-flexContainer': {
                    alignItems: 'flex-start',
                    '& .MuiTab-root': {
                      width: '100%',
                      alignItems: 'flex-start'
                    }
                  }
                }}
              >
                <Tab
                  disableRipple
                  value='MerchantTab'
                  label={
                    <TabLabel
                      title='Merchant'
                      subtitle='Enter Merchant'
                      active={activeTab === 'MerchantTab'}
                      icon={<Icon icon='tabler:file-description' />}
                    />
                  }
                />

                <Tab
                  disableRipple
                  value='SubscribtionTab'
                  label={
                    <TabLabel
                      title='Database'
                      active={activeTab === 'SubscribtionTab'}
                      subtitle='Select SubscribtionTab'
                      icon={<Icon icon='tabler:database' />}
                    />
                  }
                />
                <Tab
                  disableRipple
                  value='paymentTab'
                  label={
                    <TabLabel
                      title='Billing'
                      active={activeTab === 'paymentTab'}
                      subtitle='Payment details'
                      icon={<Icon icon='tabler:credit-card' />}
                    />
                  }
                />
                <Tab
                  disableRipple
                  value='submitTab'
                  label={
                    <TabLabel
                      title='Submit'
                      subtitle='Submit'
                      icon={<Icon icon='tabler:check' />}
                      active={activeTab === 'submitTab'}
                    />
                  }
                />
              </TabList>
              <TabPanel value='MerchantTab' sx={{ flexGrow: 1, p: '0 !important', mt: [6, 0] }}>
                <TabAccount />
                {renderTabFooter()}
              </TabPanel>

              <TabPanel value='SubscribtionTab' sx={{ flexGrow: 1, p: '0 !important', mt: [6, 0] }}>
                <DialogTabSubscribtion data={pricing.pricingPlans} />

                {renderTabFooter()}
              </TabPanel>
              <TabPanel value='paymentTab' sx={{ flexGrow: 1, p: '0 !important', mt: [6, 0] }}>
                <DialogTabBilling />
                {renderTabFooter()}
              </TabPanel>
              <TabPanel value='submitTab' sx={{ flexGrow: 1, p: '0 !important', mt: [6, 0] }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant='h4' sx={{ mb: 2 }}>
                    Submit 🥳
                  </Typography>
                  <Typography sx={{ mb: 6, color: 'text.secondary' }}>Submit to kickstart your project.</Typography>

                  <img width={200} alt='submit-img' src='/images/pages/girl-with-laptop.png' />
                </Box>
                {renderTabFooter()}
              </TabPanel>
            </TabContext>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// export const getStaticProps = async () => {
//   const res = await axios.get('/pages/pricing')
//   const apiData = res.data

//   return {
//     props: {
//       apiData
//     }
//   }
// }

export async function getStaticProps() {
  mock.onGet('/pages/pricing').reply(() => [200, data])
  console.log(data, 'reeee')
  console.log('rorororororooro')
  if (!response.data) {
    return {
      props: { initialData: false },
      revalidate: 60
    }
  }

  return {
    props: {
      apiData
    },
    revalidate: 60
  }
}

export default MerchantAndAddCard
