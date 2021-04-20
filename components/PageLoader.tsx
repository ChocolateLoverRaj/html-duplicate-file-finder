import { LoadingOutlined } from '@ant-design/icons'
import { Spin, Tooltip } from 'antd'
import { createContext, Dispatch, FC, SetStateAction, useContext, useState } from 'react'
import styles from '../styles/PageLoader.module.css'

type ShowLoading = (promise: Promise<unknown>) => void

type PageLoaderContextData = [boolean, Dispatch<SetStateAction<boolean>>]

const PageLoaderContext = createContext<PageLoaderContextData>(undefined as any)

export const useShowLoading = (): ShowLoading => {
  const setLoading = useContext(PageLoaderContext)[1]
  return promise => {
    setLoading(true)
    promise
      .finally(() => {
        setLoading(false)
      })
  }
}

export const PageLoaderContextProvider: FC = props => {
  const { children } = props

  const loadingState = useState(false)

  return (
    <PageLoaderContext.Provider value={loadingState}>
      {children}
    </PageLoaderContext.Provider>
  )
}

export const PageLoader: FC = () => {
  const [loading] = useContext(PageLoaderContext)

  return (
    <>
      {loading && (
        <div className={styles.pageLoader}>
          <Tooltip title='Client Side Routing' placement='topLeft'>
            <Spin indicator={<LoadingOutlined spin />}/>
          </Tooltip>
        </div>
      )}
    </>
  )
}
