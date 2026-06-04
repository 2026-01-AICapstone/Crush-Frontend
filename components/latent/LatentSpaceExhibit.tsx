'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '@/components/LanguageContext'

type CategoryMeta = {
  label: string
  color: string
  description: string
}

type LatentCoord = {
  layer: number
  x: number
  y: number
  actualLayer?: number
  z?: number
}

type LatentPoint = {
  id: string
  question: string
  category: string
  confidenceByLayer: number[]
  coords: LatentCoord[]
}

type LatentData = {
  schemaVersion: number
  title: string
  layers: number
  actualLayers?: number[]
  categories: Record<string, CategoryMeta>
  points: LatentPoint[]
}

type Bounds = {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

type TooltipState = {
  point: LatentPoint
  left: number
  top: number
}

const DATA_URLS = ['/data/guardrail_latent_8B_full.json', '/data/guardrail_latent_8B.json', '/data/guardrail_latent_mock.json']

async function loadLatentData() {
  let lastError: unknown = null

  for (const url of DATA_URLS) {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Failed to load ${url}`)
      const data = (await response.json()) as LatentData
      return { data, sourceUrl: url }
    } catch (error) {
      lastError = error
    }
  }

  throw lastError ?? new Error('Failed to load latent data')
}

function hexToRgb(hex: string) {
  const value = hex.replace('#', '')
  const n = Number.parseInt(value, 16)
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  }
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function coordAt(point: LatentPoint, layer: number) {
  return point.coords[layer - 1]
}

function centerLayerDrift(points: LatentPoint[]) {
  const sums = new Map<number, { x: number; y: number; count: number }>()

  points.forEach((point) => {
    point.coords.forEach((coord, index) => {
      const current = sums.get(index) ?? { x: 0, y: 0, count: 0 }
      current.x += coord.x
      current.y += coord.y
      current.count += 1
      sums.set(index, current)
    })
  })

  return points.map((point) => ({
    ...point,
    coords: point.coords.map((coord, index) => {
      const sum = sums.get(index)
      if (!sum || sum.count === 0) return coord

      return {
        ...coord,
        x: coord.x - sum.x / sum.count,
        y: coord.y - sum.y / sum.count,
      }
    }),
  }))
}

function computeCentroids(points: LatentPoint[], layerIndex: number) {
  const groups = new Map<string, { sumX: number; sumY: number; count: number }>()

  points.forEach((point) => {
    const coord = point.coords[layerIndex]
    if (!coord) return
    const g = groups.get(point.category) ?? { sumX: 0, sumY: 0, count: 0 }
    g.sumX += coord.x
    g.sumY += coord.y
    g.count += 1
    groups.set(point.category, g)
  })

  const centroids = new Map<string, { x: number; y: number }>()
  groups.forEach((g, key) => {
    if (g.count > 0) centroids.set(key, { x: g.sumX / g.count, y: g.sumY / g.count })
  })
  return centroids
}

function computeSeparationScore(points: LatentPoint[], layerIndex: number) {
  const centroids = computeCentroids(points, layerIndex)
  const keys = Array.from(centroids.keys())
  if (keys.length < 2) return 0

  let interSum = 0
  let interCount = 0
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const a = centroids.get(keys[i])!
      const b = centroids.get(keys[j])!
      interSum += Math.hypot(a.x - b.x, a.y - b.y)
      interCount++
    }
  }
  const inter = interSum / interCount

  let intraSum = 0
  let intraCount = 0
  points.forEach((point) => {
    const centroid = centroids.get(point.category)
    const coord = point.coords[layerIndex]
    if (!centroid || !coord) return
    intraSum += Math.hypot(coord.x - centroid.x, coord.y - centroid.y)
    intraCount++
  })
  const intra = intraCount > 0 ? intraSum / intraCount : 0

  return inter + intra > 0 ? inter / (inter + intra) : 0
}

function computePairwiseDistances(
  centroids: Map<string, { x: number; y: number }>,
  keys: string[],
) {
  const distances: { a: string; b: string; dist: number }[] = []
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const ca = centroids.get(keys[i])
      const cb = centroids.get(keys[j])
      if (ca && cb) {
        distances.push({ a: keys[i], b: keys[j], dist: Math.hypot(ca.x - cb.x, ca.y - cb.y) })
      }
    }
  }
  return distances.sort((a, b) => b.dist - a.dist)
}

function computeBounds(points: LatentPoint[]): Bounds {
  const xs: number[] = []
  const ys: number[] = []

  points.forEach((point) => {
    point.coords.forEach((coord) => {
      xs.push(coord.x)
      ys.push(coord.y)
    })
  })

  const quantile = (values: number[], q: number) => {
    const sorted = [...values].sort((a, b) => a - b)
    const index = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * q)))
    return sorted[index]
  }

  const minX = quantile(xs, 0.02)
  const maxX = quantile(xs, 0.98)
  const minY = quantile(ys, 0.02)
  const maxY = quantile(ys, 0.98)
  const xSpan = Math.max(maxX - minX, 1)
  const ySpan = Math.max(maxY - minY, 1)

  return {
    minX: minX - xSpan * 0.12,
    maxX: maxX + xSpan * 0.12,
    minY: minY - ySpan * 0.12,
    maxY: maxY + ySpan * 0.12,
  }
}

export default function LatentSpaceExhibit() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number>()
  const lastTickRef = useRef(0)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const { language } = useLanguage()

  const [data, setData] = useState<LatentData | null>(null)
  const [dataSource, setDataSource] = useState('')
  const [layer, setLayer] = useState(1)
  const [playing, setPlaying] = useState(false)
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(new Set())
  const [hover, setHover] = useState<TooltipState | null>(null)

  const displayPoints = useMemo(() => (data ? centerLayerDrift(data.points) : []), [data])
  const bounds = useMemo(() => (displayPoints.length > 0 ? computeBounds(displayPoints) : null), [displayPoints])

  const visiblePoints = useMemo(() => {
    return displayPoints.filter((point) => enabledCategories.has(point.category))
  }, [displayPoints, enabledCategories])

  const counts = useMemo(() => {
    if (!data) return {}
    return data.points.reduce<Record<string, number>>((acc, point) => {
      acc[point.category] = (acc[point.category] ?? 0) + 1
      return acc
    }, {})
  }, [data])

  const allSeparationScores = useMemo(() => {
    if (!data || displayPoints.length === 0) return []
    return Array.from({ length: data.layers }, (_, i) =>
      computeSeparationScore(displayPoints, i),
    )
  }, [data, displayPoints])

  const currentCentroids = useMemo(() => {
    if (displayPoints.length === 0) return new Map<string, { x: number; y: number }>()
    return computeCentroids(displayPoints, layer - 1)
  }, [displayPoints, layer])

  const enabledKeys = useMemo(() => {
    return Array.from(enabledCategories).filter((k) => currentCentroids.has(k))
  }, [enabledCategories, currentCentroids])

  const pairwiseDistances = useMemo(() => {
    return computePairwiseDistances(currentCentroids, enabledKeys)
  }, [currentCentroids, enabledKeys])

  const project = useCallback(
    (coord: LatentCoord) => {
      const canvas = canvasRef.current
      if (!canvas || !bounds) return { x: 0, y: 0 }

      const rect = canvas.getBoundingClientRect()
      const pad = Math.min(rect.width, rect.height) * 0.09
      const width = rect.width - pad * 2
      const height = rect.height - pad * 2
      const nx = (coord.x - bounds.minX) / (bounds.maxX - bounds.minX)
      const ny = (coord.y - bounds.minY) / (bounds.maxY - bounds.minY)

      return {
        x: pad + nx * width,
        y: pad + (1 - ny) * height,
      }
    },
    [bounds],
  )

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, rect: DOMRect) => {
    ctx.save()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)
    ctx.restore()

    ctx.save()
    ctx.strokeStyle = 'rgba(188, 214, 224, 0.55)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i += 1) {
      const x = (rect.width / 10) * i
      const y = (rect.height / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, rect.height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(rect.width, y)
      ctx.stroke()
    }
    ctx.restore()

    const xLabel = language === 'ko' ? 'X축: 중심 보정 PCA-1' : 'X axis: centered PCA-1'
    const yLabel = language === 'ko' ? 'Y축: 중심 보정 PCA-2' : 'Y axis: centered PCA-2'
    const drawAxisLabel = (text: string, x: number, y: number, align: CanvasTextAlign) => {
      ctx.save()
      ctx.font = '700 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
      ctx.textAlign = align
      ctx.textBaseline = 'middle'
      const width = ctx.measureText(text).width
      const left = align === 'right' ? x - width - 9 : x - 9
      ctx.fillStyle = 'rgba(250, 249, 245, 0.92)'
      ctx.strokeStyle = 'rgba(29, 37, 54, 0.42)'
      ctx.lineWidth = 1
      ctx.fillRect(left, y - 12, width + 18, 24)
      ctx.strokeRect(left, y - 12, width + 18, 24)
      ctx.fillStyle = 'rgba(29, 37, 54, 0.88)'
      ctx.fillText(text, x, y)
      ctx.restore()
    }

    drawAxisLabel(yLabel, 20, 24, 'left')
    drawAxisLabel(xLabel, rect.width - 20, rect.height - 24, 'right')
  }, [language])

  const drawTrajectory = useCallback(
    (ctx: CanvasRenderingContext2D, point: LatentPoint) => {
      if (!data) return
      const category = data.categories[point.category]

      ctx.save()
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 2.5
      ctx.strokeStyle = rgba(category.color, 0.86)
      ctx.beginPath()
      for (let i = 0; i < layer; i += 1) {
        const pos = project(point.coords[i])
        if (i === 0) ctx.moveTo(pos.x, pos.y)
        else ctx.lineTo(pos.x, pos.y)
      }
      ctx.stroke()

      for (let i = 0; i < layer; i += 4) {
        const pos = project(point.coords[i])
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 2.6, 0, Math.PI * 2)
        ctx.fillStyle = rgba(category.color, 0.28 + (i / Math.max(layer, 1)) * 0.36)
        ctx.fill()
      }
      ctx.restore()
    },
    [data, layer, project],
  )

  const drawPoints = useCallback(
    (ctx: CanvasRenderingContext2D, points: LatentPoint[]) => {
      if (!data) return

      points.forEach((point) => {
        const coord = coordAt(point, layer)
        const pos = project(coord)
        const category = data.categories[point.category]
        const isHover = hover?.point.id === point.id
        const confidence = point.confidenceByLayer[layer - 1]
        const radius = isHover ? 7.5 : 3.6 + confidence * 1.8

        ctx.save()
        ctx.globalAlpha = hover && !isHover ? 0.22 : 0.92
        ctx.fillStyle = category.color
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
        ctx.fill()

        if (isHover) {
          ctx.strokeStyle = 'rgba(29, 37, 54, 0.9)'
          ctx.lineWidth = 1.8
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, radius + 5, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.restore()
      })
    },
    [data, hover, layer, project],
  )

  const drawCentroids = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!data) return

      // collect visible centroid positions
      const visible: { key: string; pos: { x: number; y: number }; color: string }[] = []
      currentCentroids.forEach((coord, key) => {
        if (!enabledCategories.has(key)) return
        const category = data.categories[key]
        if (!category) return
        visible.push({
          key,
          pos: project({ layer, x: coord.x, y: coord.y }),
          color: category.color,
        })
      })

      // connecting lines between centroids
      ctx.save()
      ctx.setLineDash([4, 4])
      ctx.lineWidth = 1
      for (let i = 0; i < visible.length; i++) {
        for (let j = i + 1; j < visible.length; j++) {
          ctx.strokeStyle = 'rgba(29, 37, 54, 0.12)'
          ctx.beginPath()
          ctx.moveTo(visible[i].pos.x, visible[i].pos.y)
          ctx.lineTo(visible[j].pos.x, visible[j].pos.y)
          ctx.stroke()
        }
      }
      ctx.setLineDash([])
      ctx.restore()

      // centroid markers: big dot + white ring
      visible.forEach(({ pos, color }) => {
        ctx.save()

        // glow
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2)
        ctx.fillStyle = rgba(color, 0.15)
        ctx.fill()

        // white outline
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2)
        ctx.fillStyle = '#fefefe'
        ctx.fill()
        ctx.strokeStyle = 'rgba(29, 37, 54, 0.5)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // inner filled dot
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 5.5, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        ctx.restore()
      })
    },
    [currentCentroids, data, enabledCategories, layer, project],
  )

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !data || !bounds) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    ctx.clearRect(0, 0, rect.width, rect.height)
    drawGrid(ctx, rect)

    ctx.save()
    ctx.strokeStyle = 'rgba(176, 74, 47, 0.45)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(30, 0)
    ctx.lineTo(30, rect.height)
    ctx.stroke()
    ctx.restore()

    if (hover) drawTrajectory(ctx, hover.point)
    drawPoints(ctx, visiblePoints)
    drawCentroids(ctx)
  }, [bounds, data, drawCentroids, drawGrid, drawPoints, drawTrajectory, hover, visiblePoints])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2))
    canvas.width = Math.floor(rect.width * dpr)
    canvas.height = Math.floor(rect.height * dpr)

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    render()
  }, [render])

  const hitTest = useCallback(() => {
    let best: LatentPoint | null = null
    let bestDist = Infinity

    visiblePoints.forEach((point) => {
      const pos = project(coordAt(point, layer))
      const dist = Math.hypot(pos.x - mouseRef.current.x, pos.y - mouseRef.current.y)
      if (dist < bestDist) {
        best = point
        bestDist = dist
      }
    })

    return bestDist <= 14 ? best : null
  }, [layer, project, visiblePoints])

  const updateHover = useCallback(() => {
    const canvas = canvasRef.current
    const point = hitTest()
    if (!canvas || !point) {
      setHover(null)
      return
    }

    const rect = canvas.getBoundingClientRect()
    const pos = project(coordAt(point, layer))
    setHover({
      point,
      left: clamp(pos.x + 18, 12, rect.width - 356),
      top: clamp(pos.y + 18, 12, rect.height - 180),
    })
  }, [hitTest, layer, project])

  useEffect(() => {
    loadLatentData()
      .then(({ data: nextData, sourceUrl }) => {
        setData(nextData)
        setDataSource(sourceUrl)
        setEnabledCategories(new Set(Object.keys(nextData.categories)))
        setLayer(1)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  useEffect(() => {
    if (!data || !playing) return

    const tick = (time: number) => {
      if (time - lastTickRef.current > 420) {
        setLayer((current) => (current >= data.layers ? 1 : current + 1))
        lastTickRef.current = time
      }
      animationRef.current = requestAnimationFrame(tick)
    }

    lastTickRef.current = 0
    animationRef.current = requestAnimationFrame(tick)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [data, playing])

  useEffect(() => {
    render()
  }, [render])

  useEffect(() => {
    if (hover) updateHover()
  }, [layer])

  const selectedCategory = hover && data ? data.categories[hover.point.category] : null
  const selectedConfidence = hover ? hover.point.confidenceByLayer[layer - 1] : null
  const selectedCoord = hover ? coordAt(hover.point, layer) : null
  const currentActualLayer = data?.actualLayers?.[layer - 1] ?? data?.points[0]?.coords[layer - 1]?.actualLayer ?? layer
  const copy = {
    loading: language === 'ko' ? '\uC7A0\uC7AC \uADA4\uC801 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uC911...' : 'Loading latent trajectory data...',
    eyebrow: language === 'ko' ? '\u00A7 4 \u00B7 \uC7A0\uC7AC \uACF5\uAC04 \uC804\uC2DC' : '\u00A7 4 \u00B7 Latent space exhibit',
    title: language === 'ko' ? '\uAC00\uB4DC\uB808\uC77C \uB808\uC774\uC5B4 \uD45C\uD604 \uBCC0\uD654' : 'Guardrail Layer Trajectory',
    subtitle:
      language === 'ko'
        ? '\uCD08\uAE30\uC5D0\uB294 \uC11E\uC5EC \uC788\uB2E4\uAC00 \uB808\uC774\uC5B4\uAC00 \uAE4A\uC5B4\uC9C8\uC218\uB85D \uCE74\uD14C\uACE0\uB9AC\uBCC4\uB85C \uBD84\uB9AC\uB418\uB294 \uD750\uB984'
        : 'mixed early states - category-separated manifolds',
    exportLabel: dataSource.includes('guardrail_latent_8B') ? '8B PCA export' : 'mock UMAP export',
    layers: language === 'ko' ? '\uB808\uC774\uC5B4' : 'layers',
    prompts: language === 'ko' ? '\uD504\uB86C\uD504\uD2B8' : 'prompts',
    pause: language === 'ko' ? '\uC815\uC9C0' : 'pause',
    play: language === 'ko' ? '\uC7AC\uC0DD' : 'play',
    fig:
      language === 'ko'
        ? 'Fig. 4 \u00B7 \uB808\uC774\uC5B4\uBCC4 \uC740\uB2C9 \uC0C1\uD0DC PCA \uC2DC\uAC01\uD654'
        : 'Fig. 4 \u00B7 layer-wise hidden-state projection',
    confidence: language === 'ko' ? '\uC2E0\uB8B0\uB3C4' : 'confidence',
    layerLabel: language === 'ko' ? '\uD45C\uC2DC \uB808\uC774\uC5B4' : 'display layer',
    modelLayerLabel: language === 'ko' ? '\uBAA8\uB378 \uB808\uC774\uC5B4' : 'model layer',
    currentLayer: language === 'ko' ? '\uD604\uC7AC \uB808\uC774\uC5B4' : 'Current layer',
    visiblePoints: language === 'ko' ? '\uD45C\uC2DC\uB41C \uD3EC\uC778\uD2B8' : 'Visible points',
    scrubber: language === 'ko' ? '\uB808\uC774\uC5B4 \uC120\uD0DD' : 'Layer scrubber',
    filters: language === 'ko' ? '\uCE74\uD14C\uACE0\uB9AC \uD544\uD130' : 'Category filters',
    selectedPrompt: language === 'ko' ? '\uC120\uD0DD\uB41C \uD504\uB86C\uD504\uD2B8' : 'Selected prompt',
    question: language === 'ko' ? '\uC9C8\uBB38' : 'Question',
    coordinates: language === 'ko' ? '\uC88C\uD45C' : 'coordinates',
    pointId: language === 'ko' ? '\uD3EC\uC778\uD2B8 ID' : 'Point ID',
    hoverPoint: language === 'ko' ? '\uD3EC\uC778\uD2B8\uC5D0 \uB9C8\uC6B0\uC2A4\uB97C \uC62C\uB824\uBCF4\uC138\uC694' : 'Hover a point',
    trajectory: language === 'ko' ? '\uC9C8\uBB38 \uADA4\uC801' : 'Question trajectory',
    helper:
      language === 'ko'
        ? '\uC810\uC5D0 \uB9C8\uC6B0\uC2A4\uB97C \uC62C\uB9AC\uBA74 \uC9C8\uBB38, \uCE74\uD14C\uACE0\uB9AC, \uC2E0\uB8B0\uB3C4, \uB808\uC774\uC5B4\uBCC4 \uC774\uB3D9 \uACBD\uB85C\uB97C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.'
        : 'Move over a point to inspect the prompt, mapped category, confidence score, and path from early mixed layers to later separated clusters.',
    trace:
      language === 'ko'
        ? '\uB9C8\uC6B0\uC2A4\uB97C \uC62C\uB9B0 \uC0D8\uD50C\uC758 \uC774\uB3D9 \uACBD\uB85C\uB9CC \uD45C\uC2DC\uD569\uB2C8\uB2E4'
        : 'only the hovered sample draws its full trace',
    separationTitle: language === 'ko' ? '레이어별 분리도' : 'Separation score',
    separationDesc: language === 'ko' ? 'inter / (inter + intra)' : 'inter / (inter + intra)',
    clusterDistTitle: language === 'ko' ? '클러스터 간 거리' : 'Cluster distances',
    nearLabel: language === 'ko' ? '가까움' : 'near',
    farLabel: language === 'ko' ? '멀음' : 'far',
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center lab-paper text-lab-ink">
        {copy.loading}
      </div>
    )
  }

  return (
      <main className="flex h-full min-w-0 flex-col overflow-hidden lab-paper text-lab-ink">
        <header className="relative border-b-[1.5px] border-lab-ink bg-lab-paper2/75 px-8 py-4 pr-28">
          <div
            className="absolute bottom-0 top-0 w-px bg-lab-accent opacity-40"
            style={{ left: 30 }}
          />
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-lab-muted">
                {copy.eyebrow}
              </p>
              <h1 className="mt-1 text-[28px] font-bold leading-tight tracking-tight">
                {copy.title}
              </h1>
              <p className="font-hand text-[18px] text-lab-accent">
                {copy.subtitle}
              </p>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-lab-muted text-right leading-relaxed">
              {copy.exportLabel}
              <br />
              {data.layers} {copy.layers} · {data.points.length} {copy.prompts}
              <br />
              source: {dataSource.replace('/data/', '')}
            </div>
          </div>
          <button
            type="button"
            className="absolute right-8 top-4 border-[1.5px] border-lab-ink bg-lab-paper2 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-lab-ink transition hover:bg-lab-highlight/50 lab-shadow-sm"
            onClick={() => setPlaying((current) => !current)}
          >
            {playing ? copy.pause : copy.play}
          </button>
        </header>

        <div className="grid min-h-0 flex-1 grid-rows-[minmax(460px,1fr)_auto] overflow-y-auto xl:grid-cols-[minmax(0,1fr)_360px] xl:grid-rows-1 xl:overflow-hidden">
          <section className="relative min-w-0 p-5">
            <div className="relative h-full min-h-[420px] border-[1.5px] border-lab-ink bg-white lab-shadow">
              <canvas
                ref={canvasRef}
                className="block h-full w-full cursor-crosshair"
                aria-label="Guardrail latent space trajectory visualization"
                onMouseMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect()
                  mouseRef.current = {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                  }
                  updateHover()
                }}
                onMouseLeave={() => {
                  mouseRef.current = { x: -9999, y: -9999 }
                  setHover(null)
                }}
              />

              <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.14em] text-lab-muted">
                {copy.fig}
              </div>

              {hover && selectedCategory && selectedConfidence !== null && (
                <div
                  className="pointer-events-none absolute z-10 w-[min(340px,calc(100vw-32px))] border-[1.5px] border-lab-ink bg-lab-paper2 px-4 py-3 text-sm text-lab-ink lab-shadow"
                  style={{ left: hover.left, top: hover.top }}
                >
                  <strong className="mb-1 block" style={{ color: selectedCategory.color }}>
                    {selectedCategory.label}
                  </strong>
                  <p className="leading-relaxed italic">"{hover.point.question}"</p>
                  <p className="mt-2 font-mono text-xs text-lab-muted">
                    {copy.layerLabel} {layer} / {copy.modelLayerLabel} {currentActualLayer} / {copy.confidence}: {(selectedConfidence * 100).toFixed(1)}%
                    {selectedCoord ? ` / ${copy.coordinates}: x ${selectedCoord.x.toFixed(3)}, y ${selectedCoord.y.toFixed(3)}` : ''}
                  </p>
                </div>
              )}
            </div>
          </section>

          <aside className="flex flex-col gap-5 overflow-y-auto border-t-[1.5px] border-lab-ink bg-lab-paper2/70 p-5 xl:border-l-[1.5px] xl:border-t-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative border-[1.5px] border-lab-ink bg-lab-paper2 p-4 lab-shadow">
                <span className="lab-tape" />
                <span className="block text-3xl font-bold">{currentActualLayer}</span>
                <small className="font-mono text-[10px] uppercase tracking-[0.14em] text-lab-muted">
                  {copy.currentLayer}
                </small>
              </div>
              <div className="relative border-[1.5px] border-lab-ink bg-lab-paper2 p-4 lab-shadow">
                <span className="lab-tape" />
                <span className="block text-3xl font-bold">{visiblePoints.length}</span>
                <small className="font-mono text-[10px] uppercase tracking-[0.14em] text-lab-muted">
                  {copy.visiblePoints}
                </small>
              </div>
            </div>

            {/* Separation score mini chart */}
            {allSeparationScores.length > 0 && (
              <div className="border-[1.5px] border-lab-ink bg-lab-paper2 p-4 lab-shadow">
                <div className="flex items-baseline justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-lab-muted">
                    {copy.separationTitle}
                  </p>
                  <span className="text-2xl font-bold text-lab-ink">
                    {(allSeparationScores[layer - 1] * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-[9px] text-lab-muted/70">
                  {copy.separationDesc}
                </p>
                <div className="mt-3 flex items-end gap-px" style={{ height: 48 }}>
                  {allSeparationScores.map((score, i) => (
                    <button
                      key={i}
                      type="button"
                      className="flex-1 transition-colors"
                      style={{
                        height: `${Math.max(score * 100, 4)}%`,
                        backgroundColor:
                          i === layer - 1 ? '#b04a2f' : `rgba(29, 37, 54, ${0.15 + score * 0.45})`,
                      }}
                      onClick={() => {
                        setLayer(i + 1)
                        setPlaying(false)
                      }}
                    />
                  ))}
                </div>
                <div className="mt-1 flex justify-between font-mono text-[9px] text-lab-muted/60">
                  <span>L1</span>
                  <span>L{allSeparationScores.length}</span>
                </div>
              </div>
            )}

            {/* Cluster pairwise distances */}
            {pairwiseDistances.length > 0 && data && (
              <div className="border-[1.5px] border-lab-ink bg-lab-paper2 p-4 lab-shadow">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-lab-muted">
                  {copy.clusterDistTitle}
                </p>
                <div className="mt-3 grid gap-1.5">
                  {pairwiseDistances.slice(0, 8).map(({ a, b, dist }) => {
                    const maxDist = pairwiseDistances[0]?.dist || 1
                    const ratio = dist / maxDist
                    const catA = data.categories[a]
                    const catB = data.categories[b]
                    if (!catA || !catB) return null
                    return (
                      <div key={`${a}-${b}`} className="grid grid-cols-[1fr_auto] items-center gap-2">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: catA.color }}
                          />
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: catB.color }}
                          />
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${Math.max(ratio * 100, 8)}%`,
                              backgroundColor: `rgba(176, 74, 47, ${0.2 + ratio * 0.6})`,
                            }}
                          />
                        </div>
                        <span className="font-mono text-[10px] tabular-nums text-lab-muted">
                          {dist.toFixed(3)}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-2 flex justify-between font-mono text-[9px] text-lab-muted/60">
                  <span>{copy.nearLabel}</span>
                  <span>{copy.farLabel}</span>
                </div>
              </div>
            )}

            <label className="grid gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-lab-muted">
              {copy.scrubber}
              <input
                type="range"
                min={1}
                max={data.layers}
                value={layer}
                className="w-full accent-lab-accent"
                onChange={(event) => {
                  setLayer(Number(event.target.value))
                  setPlaying(false)
                }}
              />
            </label>

            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-lab-muted">
                {copy.filters}
              </p>
              <div className="grid gap-2">
                {Object.entries(data.categories).map(([key, category]) => {
                  const enabled = enabledCategories.has(key)
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`grid grid-cols-[16px_1fr_auto] items-center gap-3 border-[1.5px] border-lab-ink bg-lab-paper2 px-3 py-2 text-left text-[13px] transition hover:bg-lab-highlight/40 lab-shadow-sm ${
                        enabled ? 'opacity-100' : 'opacity-35'
                      }`}
                      onClick={() => {
                        setEnabledCategories((current) => {
                          const next = new Set(current)
                          if (next.has(key)) next.delete(key)
                          else next.add(key)
                          return next
                        })
                      }}
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-lab-ink/40"
                        style={{ backgroundColor: category.color, color: category.color }}
                      />
                      <span>{category.label}</span>
                      <span className="font-mono text-xs text-lab-muted">{counts[key] ?? 0}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-auto border-[1.5px] border-lab-ink bg-lab-paper2 p-4 lab-shadow">
              {hover && selectedCategory && selectedConfidence !== null ? (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-lab-muted">
                    {copy.selectedPrompt}
                  </p>
                  <h2 className="mt-2 text-xl font-bold" style={{ color: selectedCategory.color }}>
                    {selectedCategory.label}
                  </h2>
                  <dl className="mt-4 grid gap-3 text-sm">
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-lab-muted">
                        {copy.question}
                      </dt>
                      <dd className="mt-1 leading-relaxed italic text-lab-ink">
                        "{hover.point.question}"
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-lab-muted">
                        {copy.confidence}
                      </dt>
                      <dd className="mt-1 text-lab-ink">
                        {(selectedConfidence * 100).toFixed(1)}% / {copy.layerLabel} {layer} / {copy.modelLayerLabel} {currentActualLayer}
                      </dd>
                    </div>
                    {selectedCoord && (
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-lab-muted">
                          {copy.coordinates}
                        </dt>
                        <dd className="mt-1 font-mono text-lab-ink">
                          x {selectedCoord.x.toFixed(3)} / y {selectedCoord.y.toFixed(3)}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-lab-muted">
                        {copy.pointId}
                      </dt>
                      <dd className="mt-1 font-mono text-lab-ink">{hover.point.id}</dd>
                    </div>
                  </dl>
                </>
              ) : (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-lab-muted">
                    {copy.hoverPoint}
                  </p>
                  <h2 className="mt-2 text-xl font-bold">{copy.trajectory}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-lab-muted">
                    {copy.helper}
                  </p>
                  <p className="mt-3 font-hand text-[17px] text-lab-accent">
                    {copy.trace}
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>
  )
}
