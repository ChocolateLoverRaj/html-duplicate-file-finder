import { AppProps } from 'next/app'
import { FC } from 'react'
import 'antd/dist/antd.css'
import Header from '../components/Header'
import { PageLoader, PageLoaderContextProvider } from '../components/PageLoader'
import Head from 'next/head'

const App: FC<AppProps> = props => {
  const { Component, pageProps } = props

  return (
    <PageLoaderContextProvider>
      <Head>
        <title>Duplicate File Finder</title>
      </Head>
      <Header />
      <Component {...pageProps} />
      <PageLoader />
    </PageLoaderContextProvider>
  )
}

export default App
