import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import NProgress from 'nprogress'
import { CacheProvider } from '@emotion/react'
import themeConfig from 'src/configs/themeConfig'
import 'react-phone-number-input/style.css'

import 'src/@fake-db'
import { Toaster } from 'react-hot-toast'
import UserLayout from 'src/layouts/UserLayout'
import ar from '../../i18n/ar.json'
import en from '../../i18n/en.json'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'src/iconify-bundle/icons-bundle-react'
import '../../styles/globals.css'
import { Provider } from 'react-redux'
import { store } from 'src/store'
import { IntlProvider } from 'react-intl'
import HomeApp from 'src/Components/HomeApp'
import { useState } from 'react'

const clientSideEmotionCache = createEmotionCache()

const message = {
  en,
  ar
}

const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const [loading, setLoading] = useState(false)

  if (themeConfig.routingLoader) {
    Router.events.on('routeChangeStart', () => {
      setLoading(true) // Set loading to true when route change starts
      NProgress.start()
    })
    Router.events.on('routeChangeError', () => {
      setLoading(false) // Set loading to false when route change encounters an error
      NProgress.done()
    })
    Router.events.on('routeChangeComplete', () => {
      setLoading(false) // Set loading to false when route change is complete
      NProgress.done()
    })
  }
  const contentHeightFixed = Component.contentHeightFixed ?? false

  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)
  const setConfig = Component.setConfig ?? undefined
  const { locale } = useRouter()

  const getDir = location => {
    if (location !== 'ar') {
      return 'ltr'
    } else {
      return 'rtl'
    }
  }

  return (
    <Provider store={store}>
      <IntlProvider locale={locale} messages={message[locale]}>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>{`${themeConfig.templateName} - Material Design React Admin Template`}</title>
            <meta
              name='description'
              content={`${themeConfig.templateName} – Material Design React Admin Dashboard Template – is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.`}
            />
            <meta name='keywords' content='Material Design, MUI, Admin Template, React Admin Template' />
            <meta name='viewport' content='initial-scale=1, width=device-width' />
          </Head>
          <div dir={getDir(locale)} className={getDir(locale)}>
            <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <ThemeComponent settings={settings}>
                      <HomeApp loading={loading}>{getLayout(<Component {...pageProps} />)}</HomeApp>
                      <ReactHotToast>
                        <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                      </ReactHotToast>
                    </ThemeComponent>
                  )
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </div>
        </CacheProvider>
      </IntlProvider>
    </Provider>
  )
}

export default App
