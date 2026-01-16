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
    
    let body;
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      return NextResponse.json(
        { error: "Invalid request body", score: 0, analysis: "Could not parse the request. Please try again." },
        { status: 400 }
      )
    }

    const { resumeText } = body

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Please provide more resume content for analysis", score: 0, analysis: "" },
        { status: 400 }
      )
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Calculate a precise ATS score based on these weighted criteria:

SCORING CRITERIA (Total: 100 points):
1. Contact Information (10 points):
   - Full name present: 2 pts
   - Email present: 3 pts  
   - Phone number present: 3 pts
   - Location/City present: 2 pts

2. Professional Summary/Objective (10 points):
   - Has summary section: 5 pts
   - Summary is 2-4 sentences with keywords: 5 pts

3. Work Experience (30 points):
   - Has work experience section: 5 pts
   - Uses action verbs (achieved, managed, developed): 5 pts
   - Includes quantifiable achievements (numbers, %): 10 pts
   - Clear job titles and company names: 5 pts
   - Dates included: 5 pts

4. Skills Section (20 points):
   - Has dedicated skills section: 5 pts
   - Technical/hard skills listed: 10 pts
   - Skills are industry-relevant keywords: 5 pts

5. Education (10 points):
   - Has education section: 5 pts
   - Includes degree, institution, dates: 5 pts

6. Format & Structure (10 points):
   - Clear section headings: 3 pts
   - Consistent formatting: 4 pts
   - Readable structure: 3 pts

7. Keywords & ATS Optimization (10 points):
   - Industry-specific keywords: 5 pts
   - No images/graphics/tables mentioned: 3 pts
   - Standard section names used: 2 pts

Resume Content:
${resumeText}

INSTRUCTIONS:
1. Carefully evaluate each criterion above
2. Add up the points for elements that are present
3. Be strict but fair - only give full points when criteria is well-met

Provide your response EXACTLY in this format:
SCORE: [calculated number 0-100]

ANALYSIS:

**ATS Score Breakdown:**
- Contact Information: X/10
- Professional Summary: X/10
- Work Experience: X/30
- Skills Section: X/20
- Education: X/10
- Format & Structure: X/10
- Keywords & ATS Optimization: X/10

**Strengths:**
[List 3-5 strong points]

**Areas for Improvement:**
[List specific improvements needed]

**Missing Elements:**
[List any missing sections or content]

**Recommendations:**
[Actionable tips to improve the score]`

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set")
      return NextResponse.json(
        { error: "API configuration error", score: 0, analysis: "The AI service is not configured. Please contact support." },
        { status: 500 }
      )
    }

    let completion;
    try {
      completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert resume analyst specializing in ATS optimization. Provide helpful, constructive feedback."
          },
          { role: "user", content: prompt }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        max_tokens: 2048,
      })
    } catch (groqError: any) {
      console.error("Groq API error:", groqError?.message || groqError)
      const errorMessage = groqError?.message?.includes("Invalid API Key") || groqError?.status === 401
        ? "Invalid API key. Please check the GROQ_API_KEY configuration."
        : "AI service temporarily unavailable. Please try again later."
      return NextResponse.json(
        { error: errorMessage, score: 0, analysis: errorMessage },
        { status: 500 }
      )
    }

    const response = completion.choices[0]?.message?.content || ""
    
    const scoreMatch = response.match(/SCORE:\s*(\d+)/)
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 65
    
    const analysisMatch = response.match(/ANALYSIS:\s*([\s\S]*)/)
    const analysis = analysisMatch ? analysisMatch[1].trim() : response

    const finalScore = Math.min(100, Math.max(0, score))

    if (user) {
      await supabase.from("resume_analyses").insert({
        user_id: user.id,
        resume_text: resumeText.substring(0, 5000),
        score: finalScore,
        analysis: analysis
      })
    }

    return NextResponse.json({ score: finalScore, analysis })
  } catch (error) {
    console.error("Resume analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze resume", score: 0, analysis: "An error occurred while analyzing your resume." },
      { status: 500 }
    )
  }
}
