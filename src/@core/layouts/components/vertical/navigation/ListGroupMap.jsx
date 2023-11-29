import { styled, useTheme } from '@mui/material/styles'
import React, { useState } from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'

const Navigation = () => {
  const { locale } = useRouter()

  return [
    {
      title_en: 'eCommerce',
      title_ar: 'التجارة الإلكترونية',
      icon: 'tabler:smart-home',
      path: `merchant/ecommerce`
    },
    {
      icon: 'tabler:shield',
      title_ar: 'فرع',
      title_en: 'branch',
      path: `merchant/branch`
    },
    {
      icon: 'tabler:menu',
      title_en: 'menu',
      title_ar: 'القائمة',
      path: `merchant/menu`
    },
    {
      icon: 'tabler:list-details',
      title_en: 'Category',
      title_ar: 'الاقسام',
      path: `merchant/category`
    },
    {
      icon: 'tabler:shopping-cart',
      title_en: 'Product',
      title_ar: 'منتج',
      path: `merchant/product`
    },
    {
      icon: 'tabler:square',
      title_en: 'Coupons',
      title_ar: 'القسائم',
      path: `merchant/coupon`
    },
    {
      icon: 'tabler:circle-square',
      title_en: 'redeemed Coupons',
      title_ar: 'القسائم المستخدمة',
      path: `merchant/redeemedCoupons`
    },
    {
      title_ar: 'المستخدم',
      title_en: 'User',
      icon: 'tabler:user',
      children: [
        {
          title_en: 'List',
          title_ar: 'القائمة',
          path: `merchant/user/list`
        }
      ]
    },
    {
      title_en: 'Roles & Permissions',
      title_ar: 'الادوار والصلاحيات',
      icon: 'tabler:settings',
      children: [
        {
          title_en: 'Roles',
          title_ar: 'الادوار',
          path: `merchant/roles`
        },
        {
          title_en: 'Permissions',
          title_ar: 'الادوار',
          path: `merchant/permissions`
        }
      ]
    }
  ]
}

const RenderIcon = ({ iconName }) => {
  return (
    <Icon
      fontSize='25px'
      style={{ marginInlineEnd: '0 !important', marginInlineStart: '0 !important' }}
      icon={iconName}
    />
  )
}

const SidebarItem = ({ item }) => {
  const [open, setOpen] = useState(false)
  const { locale } = useRouter()

  const LinkStyled = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    color: `${theme.palette.primary.main} !important`,
    textAlign: locale === 'ar' ? 'right' : 'left'
  }))

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <>
      {item.children ? (
        <div>
          <ListItemButton
            sx={{
              '& .MuiListItemButton-root: hover': {
                backgroundColor: 'transparent'
              }
            }}
            onClick={handleClick}
          >
            <ListItemIcon sx={{ marginInlineEnd: '5px !important', marginInlineStart: '0 !important' }}>
              <RenderIcon iconName={item.icon} />
            </ListItemIcon>
            <ListItemText style={{ textAlign: locale === 'ar' ? 'right' : 'left' }} primary={item[`title_${locale}`]} />
            {!open ? (
              <Icon icon={locale === 'ar' ? 'ph:caret-left-light' : 'ph:caret-right-light'} />
            ) : (
              <Icon icon='ph:caret-down-light' />
            )}
          </ListItemButton>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              {item.children.map(child => (
                <LinkStyled
                  style={{ background: 'black' }}
                  href={`/${locale}/${child.path}`}
                  key={child[`title_${locale}`]}
                >
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon sx={{ marginInlineEnd: '5px !important', marginInlineStart: '0 !important' }}>
                      <RenderIcon iconName={child.icon} />
                    </ListItemIcon>
                    <ListItemText
                      style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}
                      primary={child[`title_${locale}`]}
                    />
                  </ListItemButton>
                </LinkStyled>
              ))}
            </List>
          </Collapse>
        </div>
      ) : (
        <LinkStyled style={{ textDecoration: 'none' }} href={`/${locale}/${item.path}`}>
          <ListItemButton>
            <ListItemIcon sx={{ marginInlineEnd: '5px !important', marginInlineStart: '0 !important' }}>
              <RenderIcon iconName={item.icon} />
            </ListItemIcon>
            <ListItemText primary={item[`title_${locale}`]} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }} />
          </ListItemButton>
        </LinkStyled>
      )}
    </>
  )
}

const ListGroupMap = () => {
  const { locale } = useRouter()

  return (
    <List component='nav'>
      {Navigation().map(item => (
        <SidebarItem key={item[`title_${locale}`]} item={item} />
      ))}
    </List>
  )
}

export default ListGroupMap
