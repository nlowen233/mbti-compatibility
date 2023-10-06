import NextHead from 'next/head'

type Props = {
  title?: string
  description?: string
  keywords?: string[]
}

export const Head = ({ title, description, keywords }: Props) => {
  const allKeywords: string[] = [...(keywords || []), 'MBTI', 'compatibility', 'AI', 'Myers-Briggs', 'compatibility test']
  return (
    <NextHead>
      <title>{title || 'MBTI Compatibility Test'}</title>
      <meta name={'description'} content={description || 'Find who you are compatible with'} />
      <meta name={'keywords'} content={allKeywords.join(',')} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={title || 'MBTI Compatibility Test'} />
      <meta property="og:description" content={description || 'Find who you are compatible with'} />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" href="/favicon.ico" />
    </NextHead>
  )
}
