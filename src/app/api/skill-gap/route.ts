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
    
    const { targetRole, profile, resumeText } = await request.json()

    if (!targetRole) {
      return NextResponse.json(
        { error: "Target role is required", analysis: "" },
        { status: 400 }
      )
    }

    const prompt = `You are an expert career advisor specializing in skill gap analysis. Analyze the gap between the user's current skills and what's needed for their target role.

Target Role: ${targetRole}

User's Current Profile:
- Name: ${profile?.full_name || 'Not provided'}
- Current Skills: ${profile?.skills?.join(', ') || 'Not provided'}
- Experience: ${profile?.experience_years || 0} years
- Education: ${profile?.education || 'Not provided'}
- Current Role: ${profile?.desired_role || 'Not provided'}

${resumeText ? `Resume Summary:\n${resumeText.substring(0, 1500)}` : 'No resume provided'}

Please provide a comprehensive skill gap analysis:

1. **Required Skills for ${targetRole}**
   - Technical skills
   - Soft skills
   - Tools and technologies
   - Certifications (if applicable)

2. **Skills You Already Have**
   - List matching skills from the user's profile
   - Rate proficiency level if possible

3. **Skills Gap - What You Need to Develop**
   - Critical skills to acquire
   - Nice-to-have skills
   - Priority order for learning

4. **Recommended Learning Path**
   - Specific courses or certifications
   - Online resources
   - Books or materials
   - Estimated time to develop each skill

5. **Experience Gap**
   - What type of experience is needed
   - How to gain relevant experience
   - Projects to build

6. **Action Plan**
   - 30-day quick wins
   - 90-day milestones
   - 6-month goals
   - 1-year target

Be specific, practical, and provide actionable recommendations.`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a career development expert who helps professionals identify and bridge skill gaps. Provide detailed, actionable analysis."
        },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 2048,
    })

    const analysis = completion.choices[0]?.message?.content || "Unable to analyze skill gap. Please try again."

    if (user) {
      await supabase.from("skill_gap_analyses").insert({
        user_id: user.id,
        target_role: targetRole,
        analysis: analysis
      })
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Skill gap analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze skill gap", analysis: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}
