export const maxDuration = 600 // 10분

export async function POST(request: Request) {
  const body = await request.json()

  const res = await fetch('http://localhost:8080/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(600_000), // 10분
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
