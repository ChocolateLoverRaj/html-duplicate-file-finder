import { GithubOutlined, SearchOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { MenuClickEventHandler } from 'rc-menu/lib/interface'
import { useShowLoading } from './PageLoader'

const Header: FC = () => {
  const router = useRouter()
  const showLoading = useShowLoading()

  const handleChange: MenuClickEventHandler = ({ key }) => {
    showLoading(router.replace(key as string))
  }

  return (
    <Menu mode='horizontal' selectedKeys={[router.route]} onClick={handleChange}>
      <Menu.Item key='/'>
        Duplicate File Finder
      </Menu.Item>
      <Menu.Item key='/app' icon={<SearchOutlined />}>
        Find Now
      </Menu.Item>
      <Menu.Item icon={<GithubOutlined />}>
        <a href='https://github.com/ChocolateLoverRaj/html-duplicate-file-finder'>
          GitHub
        </a>
      </Menu.Item>
    </Menu>
  )
}

export default Header
