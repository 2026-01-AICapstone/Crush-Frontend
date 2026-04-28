import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CRUSH — Cluster-based Repelling Units for Safety',
  description: 'A cluster-based intervention framework for harmful generation in LLMs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-lab-paper text-lab-ink antialiased font-serif">{children}</body>
    </html>
  )
}
