'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { LanguageProvider } from '@/components/LanguageContext'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const activeSessionId = useMemo(() => {
    const match = pathname.match(/^\/chat\/([^/]+)/)
    return match ? decodeURIComponent(match[1]) : undefined
  }, [pathname])

  return (
    <LanguageProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((current) => !current)}
          activeSessionId={activeSessionId}
        />
        <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </LanguageProvider>
  )
}
