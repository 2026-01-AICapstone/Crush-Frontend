import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CRUSH — AI Safety Control',
  description: 'Cluster-based Repelling Unit for Safety & Harmful',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-bg-primary text-white antialiased">{children}</body>
    </html>
  )
}
