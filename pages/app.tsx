import { CheckOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { Button, Card, Form, Popconfirm, Table, PageHeader } from 'antd'
import { FC, MouseEventHandler, useState } from 'react'
import useBatchedState from 'react-use-batched-state'
import DirInput from '../components/DirInput'
import NeedsFileAccessApi from '../components/NeedsFileAccessApi'
import ProcessScans from '../components/process-scans'
import { Scan } from '../lib/Scan'

const AppPage: FC = () => {
  const [scans, setScans] = useBatchedState<Scan[]>([])
  const [nextScanId, setNextScanId] = useState(0)
  const [scan, setScan] = useState<number>()

  const onFinish = ({ dir }: { dir: FileSystemDirectoryHandle }): void => {
    setScans([
      ...scans,
      {
        id: nextScanId,
        dir,
        totalFiles: 0,
        filesChecked: 0,
        discoveredFiles: false
      }
    ])
    setNextScanId(nextScanId + 1)
  }

  const handleBack: MouseEventHandler<HTMLDivElement> = () => {
    setScan(undefined)
  }

  return (
    <NeedsFileAccessApi>
      {scan !== undefined
        ? (
          <>
            <PageHeader title={`Scan ${scan}`} onBack={handleBack}/>
          </>
          )
        : (
          <>
            <Card title='Create Scan'>
              <Form onFinish={onFinish}>
                <Form.Item name='dir' label='Directory' rules={[{ required: true, message: 'Please select a directory!' }]}>
                  <DirInput />
                </Form.Item>
                <Button htmlType='submit' type='primary'>Scan Files</Button>
              </Form>
            </Card>
            <Table
              title={() => 'Scans - click on row to see scan'}
              columns={[
                {
                  title: 'Id',
                  render: (_value, scan) => <>{scan.id}</>,
                  sorter: (a, b) => a.id - b.id
                },
                {
                  title: 'Files Checked',
                  render: (_value, scan) => scan.filesChecked
                },
                {
                  title: 'Total Files',
                  render: (_value, scan) => scan.totalFiles
                },
                {
                  title: 'Discovered Files',
                  render: (_value, scan) => scan.discoveredFiles
                    ? <CheckOutlined />
                    : <LoadingOutlined />
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
                        <DeleteOutlined />
                      </Popconfirm>
                    )
                  }
                }
              ]}
              dataSource={scans}
              pagination={{ hideOnSinglePage: true }}
              rowKey='id'
              onRow={(_scan, index) => ({
                onClick: () => {
                  setScan(index)
                }
              })}
            />
          </>
          )}

      <ProcessScans scans={scans} setScans={setScans} />
    </NeedsFileAccessApi>
  )
}

export default AppPage
