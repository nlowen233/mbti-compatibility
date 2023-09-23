import React from 'react'
import NextHead from 'next/head'

type Props = {
  title?: string
  metaName?: string
  metaContent?: string
}

export const Head = ({ title, metaContent, metaName }: Props) => {
  return (
    <NextHead>
      <title>{title || 'MBTI Compatibility'}</title>
      <meta name={metaName || 'Find your MBTI match'} content={metaContent || 'Home screen, find who you are compatible with'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" href="/favicon.ico" />
    </NextHead>
  )
}
