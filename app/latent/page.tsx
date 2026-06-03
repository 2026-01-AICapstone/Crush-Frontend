import type { Metadata } from 'next'
import LatentSpaceExhibit from '@/components/latent/LatentSpaceExhibit'

export const metadata: Metadata = {
  title: 'Latent Space Trajectory | CRUSH',
  description: 'Interactive layer-wise guardrail latent trajectory exhibit.',
}

export default function LatentPage() {
  return <LatentSpaceExhibit />
}
