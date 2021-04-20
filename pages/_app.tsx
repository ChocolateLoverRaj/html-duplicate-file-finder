import { AppProps } from 'next/app'
import { FC } from 'react'
import 'antd/dist/antd.css'
import Header from '../components/Header'
import { PageLoader, PageLoaderContextProvider } from '../components/PageLoader'

const App: FC<AppProps> = props => {
  const { Component, pageProps } = props

  return (
    <PageLoaderContextProvider>
      <Header />
      <Component {...pageProps} />
      <PageLoader />
    </PageLoaderContextProvider>
  )
}

export default App
