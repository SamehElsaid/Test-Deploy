import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Skeleton,
  Typography
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Fade from '@mui/material/Fade'

import Icon from 'src/@core/components/icon'
import { Box } from '@mui/system'
import axios from 'axios'
import Router, { useRouter } from 'next/router'
import React, { forwardRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import TabAccount from '../TabAddMerchant'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { SET_merchantPopUp } from 'src/store/apps/addMerchantDialog'

function Merchantslogo({ item, index, onCardClick, setEditDialogOpen }) {
  const { locale } = useRouter()
  const [imgSrc, setImgSrc] = useState(false)
  const popUp = useSelector(mer => mer.merchantPopUp)
  const dispatch = useDispatch()

  const handleClickOpen = () => {
    dispatch(SET_merchantPopUp())

    // Invoke the callback function with the clicked card's data
    onCardClick(item)
  }
  useEffect(() => {
    if (item.logo !== '') {
      console.log(item.logo, item.name_en)
      axios
        .get(`${process.env.API_URL}/api/images/download/${item.logo}?merchant=${item.name_en}`, {
          responseType: 'arraybuffer',
          withCredentials: true
        })
        .then(response => {
          const imageSrc = `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`
          setImgSrc(imageSrc)
          console.log(response)
        })
        .catch(error => {
          setImgSrc(false)
          console.log(error)
        })
    }
  }, [item?.logo])

  const RedirectToMerchant = () => {
    Router.push(`/${locale}/merchant/ecommerce`)
  }

  return (
    <Grid item xs={12} sm={6} lg={4} key={index}>
      <Card style={{ cursor: 'pointer' }}>
        <CardContent style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Box sx={{ mb: 1.5 }}>
            <AvatarGroup
              onClick={RedirectToMerchant}
              max={4}
              className='pull-up'
              sx={{
                '& .MuiAvatar-root': { width: 60, height: 60, fontSize: theme => theme.typography.body2.fontSize }
              }}
            >
              {imgSrc ? (
                <Avatar src={imgSrc} />
              ) : (
                <Avatar style={{ fontSize: '20px', textTransform: 'capitalize' }}>{item.name_en[0]}</Avatar>
              )}
            </AvatarGroup>
          </Box>
          <Box>
            <Box>
              <Typography variant='h4' sx={{ mb: 1, fontSize: '18px' }}>
                {locale === 'ar' ? item.name_ar : item.name_en}
              </Typography>
              <Typography
                sx={{ color: 'primary.main', textDecoration: 'none' }}
                onClick={e => {
                  e.preventDefault()
                  handleClickOpen()
                }}
              >
                Edit Merchant
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default Merchantslogo
