import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import { createClient } from "@/lib/supabase/server"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const { profile, resumeText } = await request.json()

    const prompt = `You are an expert career advisor. Based on the following user profile and resume (if provided), provide personalized career recommendations.

User Profile:
- Name: ${profile?.full_name || 'Not provided'}
- Skills: ${profile?.skills?.join(', ') || 'Not provided'}
- Experience: ${profile?.experience_years || 0} years
- Education: ${profile?.education || 'Not provided'}
- Current/Desired Role: ${profile?.desired_role || 'Not provided'}
- Location: ${profile?.location || 'Not provided'}

${resumeText ? `Resume Content:\n${resumeText.substring(0, 2000)}` : 'No resume provided'}

Please provide:
1. Top 5 Career Path Recommendations based on the user's background
2. For each career path:
   - Job title and brief description
   - Why it's a good fit for this user
   - Expected salary range
   - Growth potential
   - Required skills (already have vs need to develop)
3. Short-term action items (next 3-6 months)
4. Long-term career development plan (1-3 years)
5. Industries with high demand for this profile

Be specific, practical, and encouraging. Tailor your recommendations to the user's unique background.`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an experienced career counselor with expertise in various industries. Provide actionable, personalized career guidance."
        },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
    })

    const recommendations = completion.choices[0]?.message?.content || "Unable to generate recommendations. Please try again."

    if (user) {
      await supabase.from("career_recommendations").insert({
        user_id: user.id,
        recommendations: recommendations
      })
    }

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Career recommendations error:", error)
    return NextResponse.json(
      { error: "Failed to generate recommendations", recommendations: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}
