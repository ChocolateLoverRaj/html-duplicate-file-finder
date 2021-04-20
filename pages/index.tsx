import { FC } from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import ReactMarkdown from 'react-markdown'
import { resolve } from 'path'
import { readFile } from 'fs/promises'

interface Props {
  md: string
}

const IndexPage: FC<Props> = props => {
  const { md } = props

  return (
    <>
      <Head>
        <title>Duplicate File Finder</title>
      </Head>
      <ReactMarkdown>{md}</ReactMarkdown>
    </>
  )
}

export default IndexPage

export const getStaticProps: GetStaticProps<Props> = async () => ({
  props: {
    md: await readFile(resolve('README.md'), 'utf8')
  }
})
