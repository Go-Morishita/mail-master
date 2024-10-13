import { Providers } from './providers'

export const metadata = {
  title: "mail-generator",
  description: "面倒なメール作成は「mail-generator」にお任せを。\nPowered by ChatGPT-4o.\n© 2024 Go Morishita. All Rights Reserved.",
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