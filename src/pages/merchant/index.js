// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import PageHeader from 'src/@core/components/page-header'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import MerchantCards from 'src/Components/MerchantCarde'

const Merchant = ({ children, contentHeightFixed }) => {
  const [AllMerchants, setAllMerchants] = useState([])
  const { locale } = useRouter()
  const [refresh, setrefresh] = useState(0)
  useEffect(() => {
    axios
      .get(`${process.env.API_URL}/api/merchant`, { withCredentials: true })
      .then(res => {
        setAllMerchants(res.data)
      })
      .catch(error => {
        setAllMerchants(false)
      })
  }, [refresh])

  return (
    <div className='' style={{ marginTop: '20px' }}>
      <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <CardContent sx={{ pt: 1, textAlign: 'center', pb: theme => `${theme.spacing(24)} !important` }}>
              <PageHeader
                title={
                  <Typography variant='h4' sx={{ mb: 3 }}>
                    {locale == 'ar' ? 'قائمة المتاجر ' : ' Merchants List'}
                  </Typography>
                }
                subtitle={
                  <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>
                    {locale == 'ar'
                      ? `وفر الدور الوصول إلى القوائم والميزات المحددة مسبقا بحيث يعتمد على الدور المعين يمكن للمسؤول الوصول إلى ما يحتاجه`
                      : ` A role provided access to predefined menus and features so that depending on  assigned role an administrator can have access to what he need`}
                  </Typography>
                }
              />
              <Box sx={{ marginTop: '60px' }}>
                <MerchantCards
                  setrefresh={setrefresh}
                  refresh={refresh}
                  AllMerchants={AllMerchants}
                  addMerchant='true'
                />
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Merchant
