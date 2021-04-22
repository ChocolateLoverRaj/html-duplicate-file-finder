import { ChromeOutlined, WindowsOutlined } from '@ant-design/icons'
import { Button, Result, Spin } from 'antd'
import { FC, useEffect, useState } from 'react'

const AppPage: FC = () => {
  const [supports, setSupports] = useState<boolean>()

  useEffect(() => {
    setSupports(typeof showDirectoryPicker === 'function')
  }, [])

  return (
    <Spin spinning={supports === undefined} tip='Checking Browser Compatibility'>
      {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
      {supports
        ? 'Coming soon'
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
    </Spin>
  )
}

export default AppPage
