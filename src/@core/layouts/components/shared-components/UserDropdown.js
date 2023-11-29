import { useState, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Icon from 'src/@core/components/icon'
import { useCookies } from 'react-cookie'
import { usePathname } from 'next/navigation'

const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
    color: theme.palette.primary.main
  }
}))

const UserDropdown = props => {
  const { settings } = props
  const [anchorEl, setAnchorEl] = useState(null)
  const router = useRouter()
  const { locale } = useRouter()
  const { direction } = settings
  const patch = usePathname()
  const [cookies, _, removeCookie] = useCookies(['profile'])

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const ToAllMerchants = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    px: 4,
    py: 1.75,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2.5,
      fontSize: '1.5rem',
      color: 'text.secondary'
    }
  }

  const handleLogout = () => {
    // logout()
    removeCookie('profile', { path: '/' })
    router.push(`/${locale}/login`)
    handleDropdownClose()
  }

  const exitMerchant = () => {
    // logOutMErchant()
    ToAllMerchants('/merchant')
  }

  return (
    <Fragment>
      {cookies.profile && (
        <>
          <Badge
            overlap='circular'
            onClick={handleDropdownOpen}
            sx={{ ml: 2, cursor: 'pointer' }}
            badgeContent={<BadgeContentSpan />}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
          >
            {/* Avatar Header */}

            {cookies.profile.image === '' ? (
              <Avatar
                onClick={handleDropdownOpen}
                alt={cookies.profile.name.first_name}
                sx={{ width: 38, height: 38, textTransform: 'capitalize' }}
              >
                {cookies.profile.name.first_name[0]}
              </Avatar>
            ) : (
              <Avatar
                onClick={handleDropdownOpen}
                alt={cookies.profile.name.first_name}
                src={cookies.profile.name.image}
                sx={{ width: 38, height: 38 }}
              />
            )}
          </Badge>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleDropdownClose()}
            sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.75 } }}
            anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
          >
            <Box sx={{ py: 1.75, px: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge
                  overlap='circular'
                  badgeContent={<BadgeContentSpan />}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                >
                  {cookies.profile.image === '' ? (
                    <Avatar
                      alt={cookies.profile.name.first_name}
                      sx={{ width: '2.5rem', height: '2.5rem', textTransform: 'capitalize' }}
                    >
                      {cookies.profile.name.first_name[0]}
                    </Avatar>
                  ) : (
                    <Avatar
                      alt={cookies.profile.name.first_name}
                      src={cookies.profile.name.image}
                      sx={{ width: '2.5rem', height: '2.5rem' }}
                    />
                  )}
                </Badge>
                <Box sx={{ display: 'flex', ml: 2.5, alignItems: 'flex-start', flexDirection: 'column' }}>
                  <Typography sx={{ fontWeight: 500 }}>
                    {cookies.profile.name.first_name} {cookies.profile.name.last_name}
                  </Typography>
                  <Typography variant='body2'>Admin</Typography>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
            <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
              <Box sx={styles}>
                <Icon icon='tabler:user-check' />
                My Profile
              </Box>
            </MenuItemStyled>
            <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
              <Box sx={styles}>
                <Icon icon='tabler:settings' />
                Settings
              </Box>
            </MenuItemStyled>
            <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
              <Box sx={styles}>
                <Icon icon='tabler:credit-card' />
                Billing
              </Box>
            </MenuItemStyled>
            <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
            <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
              <Box sx={styles}>
                <Icon icon='tabler:lifebuoy' />
                Help
              </Box>
            </MenuItemStyled>
            <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
              <Box sx={styles}>
                <Icon icon='tabler:info-circle' />
                FAQ
              </Box>
            </MenuItemStyled>
            {console.log(patch)}
            {patch !== '/merchant' && <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />}
            {patch !== '/merchant' && (
              <MenuItemStyled sx={{ p: 0 }} onClick={() => exitMerchant()}>
                <Box sx={styles}>
                  <Icon icon='tabler:building-community' />
                  Exit Merchant
                </Box>
              </MenuItemStyled>
            )}
            <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
            <MenuItemStyled sx={{ p: 0 }} onClick={handleLogout}>
              <Box sx={styles}>
                <Icon icon='tabler:logout' />
                Sign Out
              </Box>
            </MenuItemStyled>
          </Menu>
        </>
      )}
    </Fragment>
  )
}

export default UserDropdown
