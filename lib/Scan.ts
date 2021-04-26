export interface Scan {
  id: number
  dir: FileSystemDirectoryHandle
  totalFiles: number
  filesChecked: number
  discoveredFiles: boolean
}
