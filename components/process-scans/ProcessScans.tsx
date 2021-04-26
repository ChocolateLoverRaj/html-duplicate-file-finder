import { Dispatch, FC, SetStateAction } from 'react'
import { OnChange } from '../../lib/OnChange'
import { Scan } from '../../lib/Scan'
import ProcessScan from './ProcessScan'

interface Props {
  scans: Scan[]
  setScans: Dispatch<SetStateAction<Scan[]>>
}

const ProcessScans: FC<Props> = props => {
  const { scans, setScans } = props

  return (
    <>
      {scans.map((scan, index) => {
        const setScan: OnChange<Scan> = newScan => {
          setScans([
            ...scans.slice(0, index),
            newScan,
            ...scans.slice(index + 1)
          ])
        }

        return <ProcessScan key={scan.id} scan={scan} setScan={setScan}/>
      })}
    </>
  )
}

export default ProcessScans
