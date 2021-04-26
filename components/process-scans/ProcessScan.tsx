import { FC, useEffect, useRef, useState } from 'react'
import { OnChange } from '../../lib/OnChange'
import { Scan } from '../../lib/Scan'

interface Props {
  scan: Scan
  setScan: OnChange<Scan>
}

interface EntriesPromise {
  dir: string
  iterator: AsyncIterator<[string, FileSystemHandle]>
  nextPromise: Promise<IteratorResult<[string, FileSystemHandle]>>
}

type IncTotalFiles = (n: number) => void

const ProcessScan: FC<Props> = props => {
  const { scan, setScan } = props
  const { dir } = scan

  const [entriesPromises, setEntriesPromises] = useState<EntriesPromise[]>(() => {
    const iterator = dir.entries()
    return [{
      dir: '',
      iterator,
      nextPromise: iterator.next()
    }]
  })

  const incTotalFiles = useRef<IncTotalFiles>()
  incTotalFiles.current = n => {
    setScan({
      ...scan,
      totalFiles: scan.totalFiles + n
    })
  }

  useEffect(() => {
    let canceled = false
    const newEntriesPromises = [...entriesPromises]
    let filesDiscovered = 0
    // This won't 'asynchronously block' the promises
    if (entriesPromises.length !== 0) {
      Promise.any(entriesPromises.map(async (entriesPromise, index) => {
        if (canceled) return
        const result = await entriesPromise.nextPromise
        if (canceled) return
        // Because efficiency
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        if (result.done === true) delete newEntriesPromises[index]
        else {
          newEntriesPromises[index] = { ...entriesPromise, nextPromise: entriesPromise.iterator.next() }
          const [name, file] = result.value
          if (file.kind === 'directory') {
            const iterator = file.entries()
            newEntriesPromises.push({
              dir: `${entriesPromise.dir}/${name}`,
              iterator,
              nextPromise: iterator.next()
            })
          } else filesDiscovered++
        }
      }))
        .then(() => {
          if (canceled) return
          setEntriesPromises(newEntriesPromises.flat(0))
          incTotalFiles.current?.(filesDiscovered)
        })
        .catch(e => {
          console.error(e)
          alert(newEntriesPromises.length)
        })
    }
    return () => {
      canceled = true
    }
  }, [entriesPromises, setEntriesPromises])

  return null
}

export default ProcessScan
