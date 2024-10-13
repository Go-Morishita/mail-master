import { Providers } from './providers'

// export const metadata = {
//   title: "mail-generator",
//   description: "面倒なメールの作成はこのAIアプリケーションにお任せください。",
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}