export const dynamic = 'force-dynamic'

export async function GET() {
  const springUrl = process.env.SPRING_URL ?? 'http://localhost:8080'
  const res = await fetch(`${springUrl}/api/sessions`)
  const data = await res.json()
  return Response.json(data, { status: res.status })
}
