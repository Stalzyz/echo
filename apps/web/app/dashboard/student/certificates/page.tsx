"use client"

import { useState, useEffect } from "react"
import { Award, Download, ExternalLink, Calendar, CheckCircle, Sparkles, Share2 } from "lucide-react"
import { fetchApi } from "@/lib/useApi"
import { toast } from "sonner"
import { BragGeneratorModal, BragData } from "@/components/BragGeneratorModal"

const SAMPLE_CERTIFICATES = [
  {
    id: "cert-001",
    certificateId: "ECHO-2026-AI-9912",
    title: "Fullstack AI & Web Engineering Masterclass",
    academy: "Grekam Academy of Technology",
    issuedAt: "2026-09-15T00:00:00.000Z",
    verificationCode: "ECHO-2026-AI-9912",
    pdfUrl: "#",
    skills: ["Next.js 16", "LLM Fine-tuning", "Tailwind CSS", "Prisma Postgres"]
  },
  {
    id: "cert-002",
    certificateId: "ECHO-2026-UX-4091",
    title: "Advanced Product Design & Design Systems",
    academy: "echo Studio Academy",
    issuedAt: "2026-08-10T00:00:00.000Z",
    verificationCode: "ECHO-2026-UX-4091",
    pdfUrl: "#",
    skills: ["Figma Systems", "Glassmorphism", "Micro-animations", "Mobile UX"]
  }
]

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [bragModal, setBragModal] = useState<{ isOpen: boolean; data: BragData }>({
    isOpen: false,
    data: { type: "CERTIFICATE", title: "" }
  })

  useEffect(() => {
    setTimeout(() => {
      setCertificates(SAMPLE_CERTIFICATES)
      setIsLoading(false)
    }, 600)
  }, [])

  return (
    <div className="p-8 h-full overflow-y-auto bg-[#0a0a0a] text-white">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Award className="w-8 h-8 text-purple-500" />
            My Certificates
          </h1>
          <p className="text-white/50">View, download, and brag about your earned credentials on social media.</p>
        </div>

        <button
          onClick={() =>
            setBragModal({
              isOpen: true,
              data: {
                type: "CERTIFICATE",
                title: "Fullstack AI & Web Engineering Masterclass",
                authorOrAcademy: "Grekam Academy of Technology",
                priceOrId: "ECHO-2026-AI-9912",
                highlights: [
                  "100% Verified Industry Credential",
                  "Built Real-world AI SaaS Platforms",
                  "Scored 98% Capstone Rating"
                ],
                linkUrl: "https://echo.grekam.in/verify/ECHO-2026-AI-9912"
              }
            })
          }
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          ⚡ Create Social Launch Video
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
      ) : certificates.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center max-w-2xl mx-auto mt-20">
          <Award className="w-16 h-16 text-white/20 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3">No certificates yet</h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            Complete courses and assignments to earn certificates. They will appear here once issued by your educators.
          </p>
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition-colors">
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group flex flex-col justify-between">
              <div>
                <div className="h-48 bg-gradient-to-br from-purple-900/40 via-slate-900 to-blue-900/40 relative flex flex-col items-center justify-center p-6 text-center border-b border-white/10">
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-10 gap-3">
                    <button
                      onClick={() =>
                        setBragModal({
                          isOpen: true,
                          data: {
                            type: "CERTIFICATE",
                            title: cert.title,
                            authorOrAcademy: cert.academy,
                            priceOrId: cert.certificateId,
                            highlights: cert.skills || ["Verified Industry Skills"],
                            linkUrl: `https://echo.grekam.in/verify/${cert.verificationCode}`
                          }
                        })
                      }
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 hover:scale-105 transition-transform"
                    >
                      <Sparkles className="w-4 h-4" /> Brag Card
                    </button>
                    <a href={`/verify/${cert.verificationCode}`} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/20 text-white rounded-xl hover:scale-110 transition-transform">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <Award className="w-12 h-12 text-purple-400 mb-3" />
                  <h3 className="font-serif text-lg font-bold text-white/90 line-clamp-2">{cert.title}</h3>
                  <p className="text-xs text-purple-300 mt-1">{cert.academy}</p>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span>{new Date(cert.issuedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-400 font-semibold bg-green-400/10 px-2 py-1 rounded">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </div>
                  </div>
                  <div className="text-xs text-white/40 font-mono mb-4">
                    ID: {cert.certificateId}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() =>
                    setBragModal({
                      isOpen: true,
                      data: {
                        type: "CERTIFICATE",
                        title: cert.title,
                        authorOrAcademy: cert.academy,
                        priceOrId: cert.certificateId,
                        highlights: cert.skills || ["Verified Industry Skills"],
                        linkUrl: `https://echo.grekam.in/verify/${cert.verificationCode}`
                      }
                    })
                  }
                  className="w-full py-2.5 px-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" /> ⚡ Brag & Share Achievement
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BragGeneratorModal
        isOpen={bragModal.isOpen}
        onClose={() => setBragModal(prev => ({ ...prev, isOpen: false }))}
        data={bragModal.data}
      />
    </div>
  )
}

