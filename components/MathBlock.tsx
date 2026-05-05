'use client'
import katex from 'katex'

export function InlineMath({ math }: { math: string }) {
  const html = katex.renderToString(math, { throwOnError: false })
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

export function BlockMath({ math }: { math: string }) {
  const html = katex.renderToString(math, { displayMode: true, throwOnError: false })
  return (
    <div className="overflow-x-auto my-4 py-3 px-4 border border-lab-ink/25 bg-lab-paper2 lab-shadow-sm text-center">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
