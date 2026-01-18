import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") || searchParams.get("q") || "software engineer"
  const location = searchParams.get("location") || ""

  try {
    const params = new URLSearchParams({
      engine: "google_jobs",
      q: query,
      api_key: process.env.SERPAPI_KEY || "",
      ...(location && { location })
    })

    const response = await fetch(`https://serpapi.com/search?${params.toString()}`)
    const data = await response.json()

    if (data.error) {
      return NextResponse.json({ error: data.error, jobs: [] }, { status: 400 })
    }

    const jobs = data.jobs_results || []
    
    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("Jobs API error:", error)
    return NextResponse.json({ error: "Failed to fetch jobs", jobs: [] }, { status: 500 })
  }
}
