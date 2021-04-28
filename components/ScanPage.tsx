import { Col, PageHeader, Row, Statistic, Tag } from 'antd'
import { FC, MouseEventHandler } from 'react'
import { Scan } from '../lib/Scan'

interface Props {
  scan: Scan
  onBack: MouseEventHandler<HTMLDivElement>
  name: string | number
}

const ScanPage: FC<Props> = props => {
  const { scan, onBack, name } = props

  return (
    <>
      <PageHeader
        title={`Scan ${name}`}
        onBack={onBack}
        tags={scan.discoveredFiles ? <Tag color='green'>Finished</Tag> : <Tag color='blue'>Running</Tag>}
      />
      <Row>
        <Col span={12}>
          <Statistic title='Files Checked' value={scan.filesChecked} />
        </Col>
        <Col span={12}>
          <Statistic title='Total Files' value={scan.totalFiles} />
        </Col>
      </Row>
    </>
  )
}

export default ScanPage
