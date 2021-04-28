import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { OnChange } from '../../lib/OnChange'
import { Scan } from '../../lib/Scan'
import sha1 from 'js-sha1'
import useBatchedState from 'react-use-batched-state'

interface Props {
  scan: Scan
  setScan: OnChange<Scan>
}

interface EntriesPromise {
  dir: string
  iterator: AsyncIterator<[string, FileSystemHandle]>
  nextPromise: Promise<IteratorResult<[string, FileSystemHandle]>>
}

interface WithPath {
  path: string
}

interface HandleToFile extends WithPath {
  filePromise: Promise<File>
}

interface FileToArrayBuffer extends WithPath {
  arrayBufferPromise: Promise<ArrayBuffer>
}

interface HashWithPath extends WithPath {
  hash: string
}

type AddTo<T> =(additionalItems: T[]) => void

interface Hashes {
  [hash: string]: string[]
}

const getAddTo = <T extends unknown>(currentItems: T[], setArr: Dispatch<SetStateAction<T[]>>): AddTo<T> => additionalItems => {
  setArr([...currentItems, ...additionalItems])
}

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

  const scanRef = useRef(scan)
  scanRef.current = scan

  const setScanRef = useRef(setScan)
  setScanRef.current = setScan

  const incTotalFiles = useCallback((n: number) => {
    setScanRef.current({
      ...scanRef.current,
      totalFiles: scanRef.current.totalFiles + n
    })
  }, [])

  const incFilesChecked = useCallback(() => {
    setScanRef.current({
      ...scanRef.current,
      filesChecked: scanRef.current.filesChecked + 1
    })
  }, [])

  const [handlesToFiles, setHandlesToFiles] = useState<HandleToFile[]>([])
  const addHandlesToFiles = useRef<AddTo<HandleToFile>>()
  addHandlesToFiles.current = getAddTo(handlesToFiles, setHandlesToFiles)

  useEffect(() => {
    let canceled = false
    const newEntriesPromises = [...entriesPromises]
    const additionalFilesToHash: HandleToFile[] = []
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
          const path = `${entriesPromise.dir}/${name}`
          if (file.kind === 'directory') {
            const iterator = file.entries()
            newEntriesPromises.push({
              dir: path,
              iterator,
              nextPromise: iterator.next()
            })
          } else {
            additionalFilesToHash.push({
              path,
              filePromise: file.getFile()
            })
            filesDiscovered++
          }
        }
      }))
        .then(() => {
          if (canceled) return
          setEntriesPromises(newEntriesPromises.flat(0))
          addHandlesToFiles.current?.(additionalFilesToHash)
          incTotalFiles(filesDiscovered)
        })
        .catch(e => {
          console.error(e)
          alert(newEntriesPromises.length)
        })
    }
    return () => {
      canceled = true
    }
  }, [entriesPromises, incTotalFiles, setEntriesPromises])

  const [filesToArrayBuffers, setFilesToArrayBuffers] = useBatchedState<FileToArrayBuffer[]>([])
  const addFilesToArrayBuffers = useRef<AddTo<FileToArrayBuffer>>()
  addFilesToArrayBuffers.current = getAddTo(filesToArrayBuffers, setFilesToArrayBuffers)

  useEffect(() => {
    if (handlesToFiles.length > 0) {
      const newHandlesToFiles = [...handlesToFiles]
      const additionalFilesToArrayBuffers: FileToArrayBuffer[] = []
      let canceled = false
      Promise.any(handlesToFiles.map(async ({ path, filePromise }, index) => {
        const file = await filePromise
        if (canceled) return
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete newHandlesToFiles[index]
        additionalFilesToArrayBuffers.push({ path, arrayBufferPromise: file.arrayBuffer() })
      }))
        .then(() => {
          if (canceled) return
          setHandlesToFiles(newHandlesToFiles.flat(0))
          addFilesToArrayBuffers.current?.(additionalFilesToArrayBuffers)
        })
        .catch((e) => {
          alert('Error')
        })
      return () => {
        canceled = true
      }
    }
  }, [handlesToFiles, setHandlesToFiles])

  const [hashes, setHashes] = useBatchedState<Hashes>({})

  useEffect(() => {
    if (filesToArrayBuffers.length > 0) {
      const newFilesToArrayBuffers = [...filesToArrayBuffers]
      const additionalHashes: HashWithPath[] = []
      let canceled = false
      Promise.any(filesToArrayBuffers.map(async ({ path, arrayBufferPromise }, index) => {
        const arrayBuffer = await arrayBufferPromise
        if (canceled) return
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete newFilesToArrayBuffers[index]
        additionalHashes.push({
          path,
          hash: sha1(arrayBuffer)
        })
      }))
        .then(() => {
          if (canceled) return
          const newHashes = { ...hashes }
          additionalHashes.forEach(({ path, hash }) => {
            newHashes[hash] = [...newHashes[hash] ?? [], path]
          })
          setFilesToArrayBuffers(newFilesToArrayBuffers.flat(0))
          setHashes(newHashes)
          incFilesChecked()
        })
        .catch(() => {
          alert('Error')
        })
      return () => {
        canceled = true
      }
    }
  }, [filesToArrayBuffers, hashes, incFilesChecked, setFilesToArrayBuffers, setHashes])

  // See if done
  useEffect(() => {
    if (handlesToFiles.length === 0 && filesToArrayBuffers.length === 0) {
      setScanRef.current({
        ...scanRef.current,
        discoveredFiles: true
      })
    }
  }, [filesToArrayBuffers.length, handlesToFiles.length])

  useEffect(() => {
    console.log(hashes)
  }, [hashes])

  return null
}

export default ProcessScan
