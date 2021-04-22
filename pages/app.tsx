import { Button, Card, Form, Popconfirm, Progress, Table } from 'antd'
import { FC, MouseEventHandler, useState } from 'react'
import DirInput from '../components/DirInput'
import NeedsFileAccessApi from '../components/NeedsFileAccessApi'

interface Scan {
  id: number
  dir: FileSystemDirectoryHandle
}

const AppPage: FC = () => {
  const [scans, setScans] = useState<Scan[]>([])
  const [nextScanId, setNextScanId] = useState(0)

  const onFinish = ({ dir }: { dir: FileSystemDirectoryHandle }): void => {
    setScans([
      ...scans,
      {
        id: nextScanId,
        dir
      }
    ])
    setNextScanId(nextScanId + 1)
  }

  return (
    <NeedsFileAccessApi>
      <Card title='Create Scan'>
        <Form onFinish={onFinish}>
          <Form.Item name='dir' label='Directory' rules={[{ required: true, message: 'Please select a directory!' }]}>
            <DirInput />
          </Form.Item>
          <Button htmlType='submit' type='primary'>Scan Files</Button>
        </Form>
      </Card>
      <Table
        title={() => 'Scans'}
        columns={[
          {
            title: 'Id',
            render: (_value, scan) => <a>{scan.id}</a>,
            sorter: (a, b) => a.id - b.id
          },
          {
            title: 'Progress',
            render: (_value, _record, _index) => <Progress />,
            width: '100%'
          },
          {
            title: 'Actions',
            render: (_value, _record, index) => {
              const handleClick = (): void => {
                setScans([
                  ...scans.slice(0, index),
                  ...scans.slice(index + 1)
                ])
              }

              return (
                <Popconfirm
                  title='Are you sure you want to cancel this scan?'
                  okText='Yes'
                  cancelText='No'
                  onConfirm={handleClick}
                >
                  <Button danger>Cancel Scan</Button>
                </Popconfirm>
              )
            }
          }
        ]}
        dataSource={scans}
        pagination={{ hideOnSinglePage: true }}
      />
    </NeedsFileAccessApi>
  )
}

export default AppPage
