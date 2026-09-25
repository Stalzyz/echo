"use client"

import { useState } from  "react"
import { useApi } from  "@/lib/useApi"
import Link from "next/link"
import { ArrowLeft, FileText, Upload, CheckCircle2, Clock, Award, AlertCircle, ExternalLink, Loader2, RefreshCw } from  "lucide-react"

export default function StudentAssignmentsPage() {
  const { data: contextData } = useApi<any>("/lms/assignments/mock-context")
  const studentId = contextData?.studentId

  const { data: assignmentsData, isLoading, mutate } = useApi<any>(
    studentId ? `/lms/assignments/student/${studentId}` : "/lms/assignments"
  )

  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState("")

  const submissions = assignmentsData?.submissions || assignmentsData?.assignments || []

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAssignment || !file) return

    setUploading(true)
    setUploadStatus("Requesting presigned upload URL from Cloudflare R2 (echo)...")

    try {
      const presignRes = await fetch("http://127.0.0.1:4400/api/v1/storage/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          prefix: "assignments",
        }),
      })

      if (!presignRes.ok) throw new Error("Failed to get presigned upload URL")
      const { uploadUrl, downloadUrl } = await presignRes.json()

      setUploadStatus("Uploading project file to echo.grekam.in...")
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: uploadUrl.includes("mock-upload") ? {} : { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      })

      if (!uploadRes.ok) throw new Error("Failed to upload file binary")

      setUploadStatus("Submitting assignment for Matrix AI grading...")
      const submitRes = await fetch("http://127.0.0.1:4400/api/v1/lms/assignments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: selectedAssignment.id,
          studentId: studentId || "cuid-student-demo",
          submissionUrl: downloadUrl,
        }),
      })

      if (!submitRes.ok) throw new Error("Failed to record assignment submission")

      setUploadStatus("Submission successful!")
      setSelectedAssignment(null)
      setFile(null)
      mutate()
    } catch (err: any) {
      console.error(err)
      setUploadStatus(`Error: ${err.message || "Upload failed"}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8 font-sans relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-200/50 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-200/50 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <Link href="/student" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-slate-700 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest block font-mono">Student Portal</span>
              <h1 className="text-2xl font-black text-slate-900">Assignments & Projects</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-violet-50 border border-violet-200 px-4 py-2 rounded-2xl">
            
            <span className="text-xs font-bold text-violet-800">Matrix AI Auto-Grading Enabled</span>
          </div>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Total Submissions</div>
            <div className="text-3xl font-black text-slate-900">{submissions.length}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="text-emerald-600 text-xs font-medium uppercase tracking-wider mb-1">Graded Projects</div>
            <div className="text-3xl font-black text-emerald-600">
              {submissions.filter((s: any) => s.status === "GRADED").length}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="text-cyan-700 text-xs font-medium uppercase tracking-wider mb-1">Cloud Storage</div>
            <div className="text-xs font-mono text-slate-600 mt-2">Target: echo.grekam.in (R2)</div>
          </div>
        </div>

        {/* Main List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-600" /> Active & Past Submissions
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-slate-500 flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-violet-600" />
              <span className="text-xs">Fetching assignment records...</span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No assignment submissions recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((item: any) => {
                const isSubmission = !!item.linkUrl
                const assignment = isSubmission ? item.assignment : item
                const status = isSubmission ? item.status : "PENDING"
                const score = isSubmission ? item.grade : null

                return (
                  <div
                    key={item.id}
                    className="p-5 bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-2xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                          status === "GRADED" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                          status === "SUBMITTED" ? "bg-cyan-100 text-cyan-800 border border-cyan-300" :
                          "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}>
                          {status}
                        </span>
                        {score !== null && score !== undefined && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-black bg-violet-100 text-violet-800 font-mono border border-violet-200">
                            {score} / 100
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{assignment?.title || "Assignment"}</h3>
                      <p className="text-xs text-slate-500">{assignment?.brief || assignment?.description || "Project assignment submission"}</p>
                      
                      {item.feedback && (
                        <div className="mt-2 text-xs p-3 bg-violet-50 border border-violet-200 rounded-xl text-violet-900">
                          <strong className="text-violet-700 font-mono">AI Evaluation: </strong> {item.feedback}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {isSubmission && item.linkUrl && (
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 transition-all shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View File
                        </a>
                      )}

                      <button
                        onClick={() => setSelectedAssignment(assignment || item)}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center gap-2"
                      >
                        <Upload className="w-3.5 h-3.5" /> Submit Work
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Upload Modal Drawer */}
        {selectedAssignment && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="text-[10px] font-bold text-violet-600 uppercase tracking-widest font-mono">Direct R2 Upload</div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedAssignment.title || "Submit Assignment"}</h3>
                </div>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="text-slate-400 hover:text-slate-900 text-xs font-mono p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleFileSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 hover:border-violet-600 rounded-2xl p-6 text-center transition-all bg-slate-50/50">
                  <Upload className="w-8 h-8 text-violet-600 mx-auto mb-2 opacity-80" />
                  <label className="cursor-pointer block">
                    <span className="text-xs font-bold text-slate-900 hover:underline block">Choose project file to upload</span>
                    <span className="text-[10px] text-slate-500 mt-1 block">ZIP, PDF, MP4, or Code files (Uploaded to R2 bucket)</span>
                    <input
                      type="file"
                      required
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {file && (
                    <div className="mt-3 text-xs font-mono text-cyan-800 bg-cyan-50 py-1.5 px-3 rounded-lg inline-block border border-cyan-200">
                      Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                    </div>
                  )}
                </div>

                {uploadStatus && (
                  <div className="text-xs p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-mono flex items-center gap-2">
                    {uploading && <Loader2 className="w-3.5 h-3.5 text-violet-600 animate-spin shrink-0" />}
                    <span>{uploadStatus}</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAssignment(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !file}
                    className="px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center gap-2"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Upload to R2 & Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
