import { PageHeader, Statistic, Tag } from 'antd'
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
      <Statistic title='Files Checked' value={scan.filesChecked} />
    </>
  )
}

export default ScanPage
