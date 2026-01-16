import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import { createClient } from "@/lib/supabase/server"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { message, history, profile, userId } = await request.json()
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const systemPrompt = `You are a helpful, professional career advisor assistant. You provide expert guidance on:
- Career planning and development
- Job search strategies
- Interview preparation
- Resume and cover letter advice
- Skill development recommendations
- Industry insights and trends
- Salary negotiation tips
- Work-life balance advice

${profile ? `User Profile Information:
- Name: ${profile.full_name || 'Not provided'}
- Skills: ${profile.skills?.join(', ') || 'Not provided'}
- Experience: ${profile.experience_years || 0} years
- Education: ${profile.education || 'Not provided'}
- Desired Role: ${profile.desired_role || 'Not provided'}` : ''}

Be concise, practical, and encouraging. Provide actionable advice. If the user asks about topics outside career advice, politely redirect the conversation back to career-related topics.`

    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      ...(history || []).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content
      })),
      { role: "user" as const, content: message }
    ]

    const completion = await groq.chat.completions.create({
      messages: chatMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    })

    const response = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again."

    if (user) {
      await supabase.from("chat_history").insert([
        { user_id: user.id, message: message, role: "user" },
        { user_id: user.id, message: response, role: "assistant" }
      ])
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Failed to process chat message", response: "Sorry, I encountered an error. Please try again." },
      { status: 500 }
    )
  }
}
