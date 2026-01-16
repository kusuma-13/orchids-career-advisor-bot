import { NextResponse } from "next/server"
import { PDFParse } from "pdf-parse"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const parser = new PDFParse({ data: uint8Array })
    const result = await parser.getText()
    await parser.destroy()

    return NextResponse.json({ text: result.text })
  } catch (error) {
    console.error("PDF parsing error:", error)
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 })
  }
}
