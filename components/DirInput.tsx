import { FolderOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { FC, MouseEventHandler } from 'react'

export type Value = FileSystemDirectoryHandle | undefined

export type DirInputOnChange = (handle: Value) => void

interface Props {
  value: Value
  onChange: DirInputOnChange
}

const DirInput: FC<Props> = props => {
  const { value, onChange } = props

  const handleClick: MouseEventHandler<HTMLInputElement> = () => {
    showDirectoryPicker()
      .then(handle => {
        onChange(handle)
      })
      .catch(e => {
        if (e.code !== 20) alert('Error picking directory')
      })
  }

  return (
    <Input
      readOnly
      prefix={<FolderOutlined />}
      placeholder='No folder chosen. Click to choose.'
      value={value?.name}
      onClick={handleClick}
    />
  )
}

export default DirInput
