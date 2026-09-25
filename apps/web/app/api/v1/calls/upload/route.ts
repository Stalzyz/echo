import { NextRequest, NextResponse } from  "next/server"
import { auth } from  "../../../../../auth"
import fs from "fs"
import path from "path"

// POST /api/v1/calls/upload - Upload recorded audio file from browser
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as Blob | null
    const callId = (formData.get("callId") as string) || `call_${Date.now()}`

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Determine extension
    let ext = "webm"
    if (file.type.includes("mp4") || file.type.includes("m4a")) ext = "mp4"
    else if (file.type.includes("ogg")) ext = "ogg"
    else if (file.type.includes("wav")) ext = "wav"

    // Ensure uploads/recordings directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "recordings")
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const filename = `${callId}_${Date.now()}.${ext}`
    const filepath = path.join(uploadsDir, filename)
    fs.writeFileSync(filepath, buffer)

    const publicUrl = `/uploads/recordings/${filename}`

    return NextResponse.json({
      success: true,
      recordingUrl: publicUrl,
      sizeBytes: buffer.length,
      mimeType: file.type
    })
  } catch (error: any) {
    console.error("Audio upload error:", error)
    return NextResponse.json({ error: error.message || "Failed to upload recording" }, { status: 500 })
  }
}
