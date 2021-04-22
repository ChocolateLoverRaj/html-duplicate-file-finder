import { FC } from 'react'
import { ChromeOutlined, WindowsOutlined } from '@ant-design/icons'
import { Button, Result, Spin } from 'antd'

const NeedsFileAccessApi: FC = props => {
  const { children } = props

  return typeof window !== 'undefined'
    ? (
      <>
        {typeof showDirectoryPicker === 'function'
          ? children
          : (
            <Result
              status='error'
              title='File System Access API Not Supported'
              subTitle={
                <>
                  Your browser does not support <pre>showDirectoryPicker().</pre>
                </>
              }
              extra={
                <>
                  <a href='https://caniuse.com/native-filesystem-api'>Browser that support File System Access API</a>
                  <br />
                  <Button icon={<ChromeOutlined />} href='https://www.google.com/chrome/'>Download Google Chrome</Button>
                  <Button icon={<WindowsOutlined />} href={`microsoft-edge:${window.location.toString()}`}>Open With Microsoft Edge</Button>
                </>
              }
            />
            )}
      </>
      )
    : <Spin tip='Checking Browser Compatibility' />
}

export default NeedsFileAccessApi
