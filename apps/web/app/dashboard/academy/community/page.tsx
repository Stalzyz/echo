"use client"

import { useState } from "react"
import { 
  MessageSquare, Heart, Share2, Pin, CheckCircle2, User, 
  Send, Plus, Image as ImageIcon, Code, Sparkles, Filter, Search, Award
} from "lucide-react"
import { toast } from "sonner"

interface Post {
  id: string
  authorName: string
  authorRole: "INSTRUCTOR" | "STUDENT" | "MENTOR"
  authorAvatar: string
  channel: "ANNOUNCEMENTS" | "DOUBTS_QA" | "PROJECT_SHOWCASE" | "GENERAL"
  timeAgo: string
  content: string
  likes: number
  commentsCount: number
  isLiked?: boolean
  isPinned?: boolean
}

const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    authorName: "Stalin Kumar",
    authorRole: "INSTRUCTOR",
    authorAvatar: "SK",
    channel: "ANNOUNCEMENTS",
    timeAgo: "2 hours ago",
    content: "📢 Batch 14 Announcement: The Module 4 Live Project guidelines for Full Stack MERN development have been published. Please review the repo template before tomorrow's live studio session!",
    likes: 42,
    commentsCount: 9,
    isPinned: true
  },
  {
    id: "post-2",
    authorName: "Pooja Hegde",
    authorRole: "STUDENT",
    authorAvatar: "PH",
    channel: "DOUBTS_QA",
    timeAgo: "4 hours ago",
    content: "Hey everyone! Having an issue with Next.js Turbopack hydration error on custom dynamic CSS variables. Anyone faced this in the Theme Editor assignment?",
    likes: 12,
    commentsCount: 5
  },
  {
    id: "post-3",
    authorName: "Rohan Verma",
    authorRole: "STUDENT",
    authorAvatar: "RV",
    channel: "PROJECT_SHOWCASE",
    timeAgo: "1 day ago",
    content: "🚀 Just launched my capstone project: AI Resume Analyzer with Fastify API & Next.js 15! Check out the live demo and let me know your thoughts!",
    likes: 89,
    commentsCount: 14
  }
]

export default function SocialCommunityPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS)
  const [activeChannel, setActiveChannel] = useState<"ALL" | "ANNOUNCEMENTS" | "DOUBTS_QA" | "PROJECT_SHOWCASE">("ALL")
  const [newPostText, setNewPostText] = useState("")
  const [selectedChannel, setSelectedChannel] = useState<"ANNOUNCEMENTS" | "DOUBTS_QA" | "PROJECT_SHOWCASE" | "GENERAL">("GENERAL")

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostText.trim()) return

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorName: "Current User",
      authorRole: "INSTRUCTOR",
      authorAvatar: "CU",
      channel: selectedChannel,
      timeAgo: "Just now",
      content: newPostText,
      likes: 0,
      commentsCount: 0
    }

    setPosts([newPost, ...posts])
    setNewPostText("")
    toast.success("Post published to Social Connect feed!")
  }

  const handleToggleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1
        }
      }
      return p
    }))
  }

  const filtered = posts.filter(p => {
    if (activeChannel !== "ALL" && p.channel !== activeChannel) return false
    return true
  })

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Top Header */}
      <div className="flex-none px-8 py-6 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-black shadow-xs">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Social Connect & Student Community</h1>
            <p className="text-xs text-slate-500 font-medium">Community discussion feeds, batch announcements, doubt resolution, and project showcases.</p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-xl flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Active Student Wall
        </span>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 p-8 flex gap-6 overflow-hidden">
        
        {/* Left Feed Column */}
        <div className="flex-1 flex flex-col space-y-6 overflow-y-auto custom-scrollbar pr-2">
          
          {/* Create Post Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea 
                rows={3}
                placeholder="Share an announcement, doubt, or project showcase with your academy..."
                value={newPostText}
                onChange={e => setNewPostText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium resize-none focus:bg-white focus:outline-teal-600"
              />

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedChannel}
                    onChange={e => setSelectedChannel(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700"
                  >
                    <option value="GENERAL">General</option>
                    <option value="ANNOUNCEMENTS">Announcements</option>
                    <option value="DOUBTS_QA">Doubts & Q&A</option>
                    <option value="PROJECT_SHOWCASE">Project Showcase</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  disabled={!newPostText.trim()}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Post to Feed
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {filtered.map(post => (
              <div key={post.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs relative">
                {post.isPinned && (
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-teal-700 mb-1">
                    <Pin className="w-3 h-3 text-teal-600 fill-teal-600" /> Pinned Announcement
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {post.authorAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">{post.authorName}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-full border ${
                          post.authorRole === "INSTRUCTOR" ? "bg-teal-50 text-teal-800 border-teal-200" : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          {post.authorRole}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">{post.timeAgo}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full border border-slate-200">
                    #{post.channel}
                  </span>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-line">{post.content}</p>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-4 text-xs font-bold text-slate-500">
                  <button 
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${post.isLiked ? "text-rose-600" : "hover:text-slate-900"}`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? "fill-rose-600 text-rose-600" : ""}`} />
                    {post.likes} Likes
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    {post.commentsCount} Comments
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Channels Sidebar */}
        <div className="w-72 space-y-4 flex-none">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Channels</h3>
            
            <div className="space-y-1">
              {[
                { id: "ALL", label: "All Feeds" },
                { id: "ANNOUNCEMENTS", label: "📢 Announcements" },
                { id: "DOUBTS_QA", label: "❓ Doubts & Q&A" },
                { id: "PROJECT_SHOWCASE", label: "🚀 Project Showcase" },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveChannel(c.id as any)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeChannel === c.id ? "bg-teal-50 text-teal-800 border border-teal-200" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
