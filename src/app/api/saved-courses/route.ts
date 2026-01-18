import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("saved_courses")
    .select("*")
    .eq("user_id", user.id)
    .order("saved_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ courses: data })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { course_title, provider, url, rating, duration, level, category } = body

  const { data: existing } = await supabase
    .from("saved_courses")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_title", course_title)
    .single()

  if (existing) {
    return NextResponse.json({ error: "Course already saved" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("saved_courses")
    .insert({
      user_id: user.id,
      course_title,
      provider,
      url,
      rating,
      duration,
      level,
      category
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ course: data })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Course ID required" }, { status: 400 })
  }

  const { error } = await supabase
    .from("saved_courses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
