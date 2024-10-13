import Head from 'next/head'
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang='en'>
      <Head>
        <title>mail generator</title>
        <meta name="description" content="簡単にメールを生成できるアプリケーションです。" />
      </Head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}