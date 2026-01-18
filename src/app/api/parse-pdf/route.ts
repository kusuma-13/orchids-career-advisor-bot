import { NextResponse } from "next/server"
import { PDFParse } from "pdf-parse"
import mammoth from "mammoth"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const arrayBuffer = await file.arrayBuffer()

    let text = ""

    if (file.type === "application/pdf" || fileExtension === "pdf") {
      const uint8Array = new Uint8Array(arrayBuffer)
      const parser = new PDFParse({ data: uint8Array })
      const result = await parser.getText()
      await parser.destroy()
      text = result.text
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileExtension === "docx"
    ) {
      const buffer = Buffer.from(arrayBuffer)
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else if (file.type === "application/msword" || fileExtension === "doc") {
      return NextResponse.json({ 
        error: "Old .doc format is not supported. Please convert to .docx or PDF" 
      }, { status: 400 })
    } else {
      return NextResponse.json({ 
        error: "File must be a PDF or Word document (DOCX)" 
      }, { status: 400 })
    }

    return NextResponse.json({ text })
  } catch (error) {
    console.error("File parsing error:", error)
    return NextResponse.json({ error: "Failed to parse file" }, { status: 500 })
  }
}
