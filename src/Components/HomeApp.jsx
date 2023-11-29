import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useDispatch } from 'react-redux'
import Spinner from 'src/@core/components/spinner'
import { REMOVE_USER, SET_ACTIVE_USER } from 'src/store/apps/authSlice/authSlice'
import { useTheme } from '@mui/material/styles'

function HomeApp({ children, loading }) {
  const [login, setLogin] = useState(false)
  const [cookies, _] = useCookies(['profile'])
  const dispatch = useDispatch()
  const router = useRouter()
  const { locale } = useRouter()
  const patch = usePathname()
  const theme = useTheme()
  useEffect(() => {
    if (locale === 'ar') {
      document.body.classList.add('rtl')
    } else {
      document.body.classList.remove('rtl')
    }
  }, [locale])
  useEffect(() => {
    const handleThemeChange = () => {
      if (theme.palette.mode === 'dark') {
        document.body.classList.add('dark-mode')
      } else {
        document.body.classList.remove('dark-mode')
      }
    }
    handleThemeChange()

    return () => {
      handleThemeChange()
    }
  }, [theme.palette.mode])
  useEffect(() => {
    if (cookies.profile) {
      dispatch(SET_ACTIVE_USER(cookies.profile))
      if (patch === '/login') {
        router.push(`/${locale}/merchant`)
      }
      if (patch === '/register') {
        router.push(`/${locale}/merchant`)
      }

      const timeoutMin = setTimeout(() => {
        setLogin(true)
      }, 1000)

      return () => {
        clearTimeout(timeoutMin)
      }
    } else {
      if (patch !== '/register' && patch !== '/forgot-password') {
        router.push(`/${locale}/login`)
      }
      dispatch(REMOVE_USER())

      const timeoutId = setTimeout(() => {
        setLogin(true)
      }, 1000)

      return () => {
        clearTimeout(timeoutId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.profile, dispatch, locale, patch])

  if (!login) {
    return <Spinner />
  }

  if (loading) {
    return <Spinner />
  }

  return children
}

export default HomeApp
