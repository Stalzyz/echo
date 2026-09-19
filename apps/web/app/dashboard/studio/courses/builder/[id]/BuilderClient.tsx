"use client"

import { useState, useTransition, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Settings,
  DollarSign, 
  Video, 
  FileText, 
  HelpCircle, 
  GripVertical, 
  ChevronRight,
  ChevronDown,
  Trash2,
  Save,
  Eye,
  MonitorPlay,
  Image as ImageIcon,
  MoreVertical,
  Link as LinkIcon,
  Loader2,
  Search
} from "lucide-react"
import { cn } from "@/lib/utils"

import { ApiClient } from "@/lib/api"
import { createModule, updateModule, deleteModule, reorderModules, createLesson, updateLesson, deleteLesson, reorderLessons } from "./actions"
import { RichTextEditor } from "./RichTextEditor"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type LessonType = "VIDEO" | "RICH_TEXT" | "QUIZ" | "PDF"

interface Lesson {
  id: string
  title: string
  type: LessonType
  orderIndex?: number
  sortOrder?: number
  contentUrl?: string | null
  richText?: string | null
  resources?: any
}

interface Module {
  id: string
  title: string
  orderIndex?: number
  sortOrder?: number
  lessons: Lesson[]
}

export default function BuilderClient({ initialCourse }: { initialCourse: any }) {
  const [isPending, startTransition] = useTransition()
  
  const [activeTab, setActiveTab] = useState<"SETTINGS" | "CURRICULUM">("CURRICULUM")
  const [modules, setModules] = useState<Module[]>(initialCourse?.modules || [])
  const [expandedModules, setExpandedModules] = useState<string[]>(initialCourse?.modules?.map((m: any) => m.id) || [])
  const [activeItem, setActiveItem] = useState<{ type: "COURSE" | "MODULE" | "LESSON" | "THUMBNAIL" | "PRICING", id?: string } | null>(null)

  const [actualPrice, setActualPrice] = useState<number>(initialCourse.course?.fee ? Math.round(initialCourse.course.fee * 1.3) : 10000)
  const [sellingPrice, setSellingPrice] = useState<number>(initialCourse.course?.fee || 7499)
  const [generatedCoupon, setGeneratedCoupon] = useState<string>("")
  const [couponDiscount, setCouponDiscount] = useState<number>(20)
  const [couponType, setCouponType] = useState<"PERCENT" | "FIXED">("PERCENT")
  const [activeCoupons, setActiveCoupons] = useState<Array<{ code: string; type: string; value: number }>>([
    { code: "EARLYBIRD20", type: "PERCENT", value: 20 },
    { code: "SPECIAL500", type: "FIXED", value: 500 }
  ])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const toggleModule = (id: string) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  // --- Actions ---

  const handleAddModule = () => {
    const tempId = `mod_${Date.now()}`
    const newModTitle = `Section ${modules.length + 1}`
    
    // Optimistic Update
    setModules(prev => [...prev, { id: tempId, title: newModTitle, orderIndex: prev.length, lessons: [] }])
    setExpandedModules(prev => [...prev, tempId])
    setActiveItem({ type: "MODULE", id: tempId })

    startTransition(async () => {
      const courseTargetId = initialCourse?.id || initialCourse?.courseId
      const dbModule = await createModule(courseTargetId, newModTitle)
      if (dbModule) {
        setModules(prev => prev.map(m => m.id === tempId ? { ...dbModule, orderIndex: dbModule.sortOrder, lessons: [] } : m))
        setExpandedModules(prev => prev.map(id => id === tempId ? dbModule.id : id))
        setActiveItem({ type: "MODULE", id: dbModule.id })
      }
    })
  }

  const handleUpdateModule = (moduleId: string, title: string) => {
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, title } : m))
    startTransition(async () => {
      await updateModule(moduleId, title)
    })
  }

  const handleDeleteModule = (moduleId: string) => {
    setModules(prev => prev.filter(m => m.id !== moduleId))
    if (activeItem?.id === moduleId) setActiveItem(null)
    startTransition(async () => {
      await deleteModule(moduleId)
    })
  }

  const handleAddLesson = (moduleId: string, type: string) => {
    const mod = modules.find(m => m.id === moduleId)
    if (!mod) return

    const tempId = `les_${Date.now()}`
    const newLessonObj: Lesson = {
      id: tempId,
      title: type === "VIDEO" ? "Video Lesson" : type === "QUIZ" ? "Practice Quiz" : "Reading Material",
      type: type as LessonType,
      orderIndex: mod.lessons.length,
      contentUrl: "",
      richText: ""
    }
    
    // Optimistic Update
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) return { ...m, lessons: [...m.lessons, newLessonObj] }
      return m
    }))
    setActiveItem({ type: "LESSON", id: tempId })
    if (!expandedModules.includes(moduleId)) {
      setExpandedModules(prev => [...prev, moduleId])
    }

    startTransition(async () => {
      const dbLesson = await createLesson(moduleId, newLessonObj.title, type)
      if (dbLesson) {
        setModules(prev => prev.map(m => {
          if (m.id === moduleId) return { ...m, lessons: m.lessons.map(l => l.id === tempId ? { ...dbLesson, orderIndex: dbLesson.sortOrder } as Lesson : l) }
          return m
        }))
        setActiveItem({ type: "LESSON", id: dbLesson.id })
      }
    })
  }

  const handleUpdateLesson = (moduleId: string, lessonId: string, title: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) return { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, title } : l) }
      return m
    }))
    startTransition(async () => {
      await updateLesson(lessonId, { title })
    })
  }

  const handleUpdateLessonContent = (moduleId: string, lessonId: string, richText: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) return { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, richText } : l) }
      return m
    }))
    startTransition(async () => {
      await updateLesson(lessonId, { richText })
    })
  }

  const handleUpdateLessonVideo = (moduleId: string, lessonId: string, contentUrl: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) return { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, contentUrl } : l) }
      return m
    }))
    startTransition(async () => {
      await updateLesson(lessonId, { contentUrl })
    })
  }

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
      return m
    }))
    if (activeItem?.id === lessonId) setActiveItem(null)
    startTransition(async () => {
      await deleteLesson(lessonId)
    })
  }

  const handleDragEndModules = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setModules((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over?.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        
        const orderedIds = newItems.map(item => item.id)
        startTransition(() => { reorderModules(initialCourse.id, orderedIds) })
        return newItems
      })
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center border border-teal-200">
            <MonitorPlay className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-sm text-slate-900">{initialCourse.course?.name || "Course Builder"}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className={cn("w-2 h-2 rounded-full", initialCourse.isPublished ? "bg-emerald-500" : "bg-amber-500")} /> 
              {initialCourse.isPublished ? "PUBLISHED" : "DRAFT"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isPending && <Loader2 className="w-4 h-4 animate-spin text-teal-600" />}
          <button className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors flex items-center gap-2">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs">
            <Save className="w-4 h-4" /> Publish Course
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL - Curriculum Sidebar */}
        <aside className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 h-full overflow-hidden shadow-xs">
          
          {/* Tabs */}
          <div className="flex p-2 border-b border-slate-200 shrink-0 bg-slate-50">
            <button 
              onClick={() => setActiveTab("SETTINGS")}
              className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-colors", activeTab === "SETTINGS" ? "bg-white text-teal-700 shadow-xs border border-slate-200" : "text-slate-500 hover:text-slate-900")}
            >
              SETTINGS
            </button>
            <button 
              onClick={() => setActiveTab("CURRICULUM")}
              className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-colors", activeTab === "CURRICULUM" ? "bg-white text-teal-700 shadow-xs border border-slate-200" : "text-slate-500 hover:text-slate-900")}
            >
              CURRICULUM
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === "SETTINGS" ? (
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveItem({ type: "COURSE" })}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors text-left",
                    activeItem?.type === "COURSE" ? "bg-teal-50 text-teal-700 border border-teal-200 font-bold" : "bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700"
                  )}
                >
                  <Settings className="w-4 h-4 text-teal-600" /> General Settings
                </button>
                <button 
                  onClick={() => setActiveItem({ type: "THUMBNAIL" })}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors text-left",
                    activeItem?.type === "THUMBNAIL" ? "bg-teal-50 text-teal-700 border border-teal-200 font-bold" : "bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700"
                  )}
                >
                  <ImageIcon className="w-4 h-4 text-teal-600" /> Thumbnail & Trailer
                </button>
                <button 
                  onClick={() => setActiveItem({ type: "PRICING" })}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors text-left",
                    activeItem?.type === "PRICING" ? "bg-teal-50 text-teal-700 border border-teal-200 font-bold" : "bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700"
                  )}
                >
                  <DollarSign className="w-4 h-4 text-teal-600" /> Pricing & SEO
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Modules List */}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndModules}>
                  <SortableContext items={modules.map(m => m.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {modules.map((module, mIdx) => (
                        <SortableModule 
                          key={module.id} 
                          module={module} 
                          mIdx={mIdx} 
                          expandedModules={expandedModules} 
                          toggleModule={toggleModule} 
                          activeItem={activeItem} 
                          setActiveItem={setActiveItem} 
                          handleAddLesson={handleAddLesson}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                <button 
                  onClick={handleAddModule}
                  className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:text-teal-700 hover:border-teal-400 hover:bg-teal-50 text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-teal-600" /> Add Section
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT PANEL - Editor Area */}
        <main className="flex-1 bg-slate-50 overflow-y-auto relative p-8 lg:p-12 text-slate-900">
          
          <div className="max-w-3xl mx-auto">
            {activeItem?.type === "COURSE" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-slate-900">Course Settings</h2>
                  <p className="text-slate-500 text-sm">Manage the high-level details of your course.</p>
                </div>
                <div className="space-y-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-2">Course Name</label>
                    <input type="text" defaultValue={initialCourse.course?.name || ""} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-teal-500 outline-none" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeItem?.type === "MODULE" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-slate-900">Section Settings</h2>
                  <p className="text-slate-500 text-sm">Update section title and rules.</p>
                </div>
                <div className="space-y-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <label className="text-xs font-bold text-slate-600 block mb-2">Section Title</label>
                  <input 
                    type="text" 
                    value={modules.find(m => m.id === activeItem.id)?.title || ""} 
                    onChange={(e) => activeItem.id && handleUpdateModule(activeItem.id, e.target.value)}
                    className="w-full h-14 text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 focus:outline-none focus:border-teal-500" 
                  />
                </div>
                <button 
                  onClick={() => activeItem.id && handleDeleteModule(activeItem.id)}
                  className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl hover:bg-rose-100 text-sm font-bold transition-colors shadow-xs"
                >
                  Delete Section
                </button>
              </motion.div>
            )}

            {activeItem?.type === "LESSON" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                
                {(() => {
                  const mod = modules.find(m => m.lessons.some(l => l.id === activeItem.id))
                  const lesson = mod?.lessons.find(l => l.id === activeItem.id)
                  if (!lesson || !mod) return null
                  
                  return (
                    <>
                      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                        <div className="flex-1">
                          <input 
                            type="text" 
                            value={lesson.title} 
                            onChange={(e) => handleUpdateLesson(mod.id, lesson.id, e.target.value)}
                            className="w-full bg-transparent text-3xl font-bold text-slate-900 focus:outline-none placeholder:text-slate-300" 
                            placeholder="Lesson Title" 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleDeleteLesson(mod.id, lesson.id)}
                            className="w-10 h-10 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center justify-center transition-colors text-rose-600 shadow-xs"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Lesson Content Builder */}
                      <div className="space-y-6">
                        {lesson.type === "VIDEO" && (
                          <div className="space-y-4">
                            {!lesson.contentUrl ? (
                              <div className="border-2 border-dashed border-slate-300 hover:border-teal-400 bg-white rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-colors shadow-sm">
                                <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
                                  <MonitorPlay className="w-8 h-8 text-teal-600" />
                                </div>
                                <h3 className="text-lg font-bold mb-1 text-slate-900">Add Video Content</h3>
                                <p className="text-sm text-slate-500 mb-6">Paste a YouTube or Vimeo link</p>
                                <input 
                                  type="text"
                                  placeholder="https://youtube.com/watch?v=..."
                                  className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleUpdateLessonVideo(mod.id, lesson.id, e.currentTarget.value)
                                    }
                                  }}
                                />
                                <p className="text-xs text-slate-400 mt-2">Press Enter to save</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-bold text-sm text-slate-700">Video Content</h3>
                                  <button onClick={() => handleUpdateLessonVideo(mod.id, lesson.id, "")} className="text-xs text-rose-600 font-bold hover:text-rose-700">Remove Video</button>
                                </div>
                                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                                  <iframe 
                                    src={lesson.contentUrl.includes('youtube') ? lesson.contentUrl.replace('watch?v=', 'embed/') : lesson.contentUrl} 
                                    className="w-full h-full"
                                    allowFullScreen
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="group relative mt-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                            <h3 className="font-bold text-sm text-slate-700">Lesson Content / Article</h3>
                          </div>
                          
                          <RichTextEditor 
                            initialContent={lesson.richText || ""}
                            onChange={(content) => handleUpdateLessonContent(mod.id, lesson.id, content)}
                            isSaving={isPending}
                          />
                        </div>
                      </div>
                    </>
                  )
                })()}

              </motion.div>
            )}

            {activeItem?.type === "PRICING" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-slate-900">Pricing, Discounts & Coupons</h2>
                  <p className="text-slate-500 text-sm">Set list price, selling price, discounts, and generate promotional coupons for students.</p>
                </div>
                
                {/* Pricing Box */}
                <div className="space-y-6 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-slate-900"><DollarSign className="w-5 h-5 text-teal-600" /> Course Pricing</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 ml-1">Actual Price / MRP (₹)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 10000"
                        value={actualPrice}
                        onChange={(e) => setActualPrice(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 font-semibold" 
                      />
                      <p className="text-[11px] text-slate-400">Original value displayed crossed-out.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-teal-700 ml-1">Selling Price (₹)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 7499"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(Number(e.target.value))}
                        className="w-full bg-teal-50/50 border border-teal-300 rounded-xl px-4 py-3 text-sm text-teal-900 font-bold focus:outline-none focus:border-teal-500" 
                      />
                      <p className="text-[11px] text-slate-400">Final price charged to student.</p>
                    </div>

                    <div className="space-y-2 flex flex-col justify-center">
                      <label className="text-xs font-bold text-slate-600 ml-1">Student Discount</label>
                      <div className="h-11 bg-emerald-50 border border-emerald-200 rounded-xl px-4 flex items-center justify-between">
                        <span className="text-xs text-emerald-700 font-medium">You Save:</span>
                        <span className="text-sm font-bold text-emerald-800">
                          {actualPrice > sellingPrice ? `${Math.round(((actualPrice - sellingPrice) / actualPrice) * 100)}% OFF (₹${actualPrice - sellingPrice})` : "No Discount"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coupon Generator Box */}
                <div className="space-y-6 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-teal-600" /> Promotional Coupon Generator
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Generate single or batch discount promo codes for campaigns.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 ml-1">Discount Type</label>
                      <select 
                        value={couponType}
                        onChange={(e: any) => setCouponType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500"
                      >
                        <option value="PERCENT">Percentage OFF (%)</option>
                        <option value="FIXED">Flat Fixed Amount (₹)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 ml-1">
                        {couponType === "PERCENT" ? "Discount Percentage (%)" : "Discount Amount (₹)"}
                      </label>
                      <input 
                        type="number"
                        value={couponDiscount}
                        onChange={(e) => setCouponDiscount(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 font-semibold"
                      />
                    </div>

                    <div className="flex items-end">
                      <button 
                        onClick={() => {
                          const code = `ECHO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
                          setGeneratedCoupon(code)
                          setActiveCoupons(prev => [{ code, type: couponType, value: couponDiscount }, ...prev])
                        }}
                        className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 text-sm"
                      >
                        <Plus className="w-4 h-4" /> Generate Coupon Code
                      </button>
                    </div>
                  </div>

                  {/* Active Coupons List */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Course Coupons</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {activeCoupons.map((coupon, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between group hover:border-teal-300">
                          <div>
                            <div className="font-mono font-bold text-sm text-teal-700">{coupon.code}</div>
                            <div className="text-[11px] text-slate-500">
                              {coupon.type === "PERCENT" ? `${coupon.value}% Discount` : `Flat ₹${coupon.value} OFF`}
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(coupon.code)
                              alert(`Copied code: ${coupon.code}`)
                            }}
                            className="text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors bg-white border border-slate-200 px-2 py-1 rounded-lg"
                          >
                            Copy
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => {
                      startTransition(async () => {
                        const targetId = initialCourse?.id || initialCourse?.courseId
                        const updateCoursePricing = (await import("./actions")).updateCoursePricing
                        await updateCoursePricing(targetId, { fee: sellingPrice, salePrice: sellingPrice, listPrice: actualPrice })
                        alert("Pricing & Coupon Settings Saved Successfully!")
                      })
                    }}
                    className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors shadow-sm flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Pricing Settings
                  </button>
                </div>
              </motion.div>
            )}

            {!activeItem && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-20">
                <FileText className="w-16 h-16 mb-4 text-slate-300" />
                <p className="text-lg font-bold text-slate-700">Select a section or lesson from the sidebar <br/> to start editing.</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

function SortableModule({ module, mIdx, expandedModules, toggleModule, activeItem, setActiveItem, handleAddLesson }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: module.id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      
      {/* Module Header */}
      <div 
        className={cn(
          "flex items-center gap-2 p-3 cursor-pointer hover:bg-slate-50 transition-colors",
          activeItem?.id === module.id && "bg-teal-50 text-teal-700 font-bold"
        )}
        onClick={() => {
          toggleModule(module.id)
          setActiveItem({ type: "MODULE", id: module.id })
        }}
      >
        <button className="text-slate-400 hover:text-slate-700 transition-colors">
          {expandedModules.includes(module.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        <div className="flex-1 font-bold text-sm truncate text-slate-900">Section {mIdx + 1}: {module.title}</div>
        <button {...attributes} {...listeners} className="text-slate-300 hover:text-slate-600 cursor-grab focus:outline-none">
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Lessons List */}
      <AnimatePresence>
        {expandedModules.includes(module.id) && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-slate-100"
          >
            <div className="p-2 space-y-1 bg-slate-50">
              {module.lessons.map((lesson: any) => (
                <div 
                  key={lesson.id}
                  onClick={(e) => { e.stopPropagation(); setActiveItem({ type: "LESSON", id: lesson.id }) }}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-xl text-sm cursor-pointer transition-all",
                    activeItem?.id === lesson.id 
                      ? "bg-teal-50 text-teal-700 border border-teal-200 font-bold shadow-xs" 
                      : "hover:bg-white border border-transparent text-slate-700"
                  )}
                >
                  {lesson.type === "VIDEO" && <Video className="w-3.5 h-3.5 flex-shrink-0 text-teal-600" />}
                  {lesson.type === "RICH_TEXT" && <FileText className="w-3.5 h-3.5 flex-shrink-0 text-teal-600" />}
                  {lesson.type === "QUIZ" && <HelpCircle className="w-3.5 h-3.5 flex-shrink-0 text-teal-600" />}
                  {lesson.type === "PDF" && <LinkIcon className="w-3.5 h-3.5 flex-shrink-0 text-teal-600" />}
                  <span className="truncate flex-1">{lesson.title}</span>
                </div>
              ))}
              
              {/* Add Lesson Menu */}
              <div className="pt-2 px-2 pb-1 flex items-center gap-3 border-t border-slate-200/60 mt-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAddLesson(module.id, "VIDEO") }}
                  className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-teal-700 transition-colors py-1"
                >
                  <Plus className="w-3 h-3 text-teal-600" /> Video
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAddLesson(module.id, "RICH_TEXT") }}
                  className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-teal-700 transition-colors py-1"
                >
                  <Plus className="w-3 h-3 text-teal-600" /> Text Article
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
