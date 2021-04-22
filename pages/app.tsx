import { FC, useState } from 'react'
import DirInput from '../components/DirInput'
import NeedsFileAccessApi from '../components/NeedsFileAccessApi'

const AppPage: FC = () => {
  const [handle, setHandle] = useState<FileSystemDirectoryHandle>()

  return (
    <NeedsFileAccessApi>
      <DirInput value={handle} onChange={setHandle} />
    </NeedsFileAccessApi>
  )
}

export default AppPage
