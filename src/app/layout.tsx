import { Providers } from './providers'

export const metadata = {
  title: "mail-generator",
  description: "mail-generator は、入力された情報をもとにAIが自動でメールを生成するツールです。わずか数クリックでメールを作成し、ビジネスや日常のやり取りを効率化します。\nPowered by ChatGPT-4o.\n© 2024 Go Morishita. All Rights Reserved.",
}

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