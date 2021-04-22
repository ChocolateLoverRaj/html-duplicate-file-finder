import { Button, Card, Form, Progress, Table } from 'antd'
import { FC, useState } from 'react'
import DirInput from '../components/DirInput'
import NeedsFileAccessApi from '../components/NeedsFileAccessApi'

interface Scan {
  id: number
  dir: FileSystemDirectoryHandle
}

const AppPage: FC = () => {
  const [scans, setScans] = useState<Scan[]>([])

  const onFinish = ({ dir }: { dir: FileSystemDirectoryHandle }): void => {
    setScans([
      ...scans,
      { 
        id: scans.length,
        dir
      }
    ])
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
            render: (_value, _record, _index) => <Progress />
          }
        ]}
        dataSource={scans}
        pagination={{hideOnSinglePage: true}}
      />
    </NeedsFileAccessApi>
  )
}

export default AppPage
