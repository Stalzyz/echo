"use client"

import { useState, useRef, useEffect } from  "react"
import { Bell, CheckCircle2, Loader2, CreditCard, MessageSquare, Trophy, Clock, AlertCircle, Info, X, CheckCheck, ExternalLink } from  "lucide-react"
import { motion, AnimatePresence } from  "framer-motion"
import { useCurrentUser } from  "@/context/CurrentUserContext"
import Link from "next/link"
import { formatDistanceToNow } from  "date-fns"

function getNotifIcon(type: string) {
  switch (type) {
    case "PAYMENT_RECEIVED":
      return <CreditCard className="w-4 h-4 text-emerald-600" />
    case "PAYMENT_OVERDUE":
      return <AlertCircle className="w-4 h-4 text-rose-600" />
    case "NEW_MESSAGE":
      return <MessageSquare className="w-4 h-4 text-teal-600" />
    case "ASSIGNMENT_GRADED":
      return <Trophy className="w-4 h-4 text-amber-600" />
    case "DEADLINE_APPROACHING":
      return <Clock className="w-4 h-4 text-amber-600" />
    case "TASK_ASSIGNED":
      return <CheckCircle2 className="w-4 h-4 text-teal-600" />
    case "LEAVE_APPROVED":
      return <CheckCircle2 className="w-4 h-4 text-teal-600" />
    case "MILESTONE_REACHED":
      return <Trophy className="w-4 h-4 text-amber-600" />
    default:
      return <Info className="w-4 h-4 text-slate-400" />
  }
}

function getNotifAccent(type: string) {
  switch (type) {
    case "PAYMENT_RECEIVED":   return "border-emerald-200 bg-emerald-50/50"
    case "PAYMENT_OVERDUE":    return "border-rose-200 bg-rose-50/50"
    case "NEW_MESSAGE":        return "border-teal-200 bg-teal-50/50"
    case "ASSIGNMENT_GRADED":  return "border-amber-200 bg-amber-50/50"
    case "DEADLINE_APPROACHING": return "border-amber-200 bg-amber-50/50"
    case "TASK_ASSIGNED":      return "border-teal-200 bg-teal-50/50"
    default:                   return "border-slate-200 bg-slate-50"
  }
}

export function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    isLoading,
  } = useCurrentUser()

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleNotifClick = (notif: any) => {
    if (!notif.isRead) {
      markNotificationRead(notif.id)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ''}`}
        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center shrink-0 transition-colors relative"
      >
        <Bell className={`w-4 h-4 transition-colors ${isOpen ? 'text-teal-600' : 'text-slate-600'}`} />
        
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-teal-600 flex items-center justify-center text-[9px] font-black text-white border-2 border-white shadow-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div 
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-11 w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden text-slate-900"
            >
              <div className="px-4 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-teal-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-extrabold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllNotificationsRead} 
                      className="flex items-center gap-1 text-[10px] font-bold text-teal-700 hover:text-teal-800 transition-colors uppercase tracking-wider"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      All read
                    </button>
                  )}
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                    <span className="text-slate-500 text-xs font-medium">Loading notifications...</span>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="text-center mt-1">
                      <p className="text-xs font-bold text-slate-700">All caught up!</p>
                      <p className="text-[11px] text-slate-400 font-medium">No new notifications.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    <AnimatePresence initial={false}>
                      {notifications.map((notif, idx) => (
                        <motion.div
                          key={notif.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: notif.isRead ? 0.6 : 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          onClick={() => handleNotifClick(notif)}
                          className={`
                            group flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150
                            ${notif.isRead 
                              ? 'border-slate-100 bg-white hover:bg-slate-50' 
                              : `${getNotifAccent(notif.type)} hover:brightness-95`
                            }
                          `}
                        >
                          <div className="shrink-0 mt-0.5 w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                            {getNotifIcon(notif.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-bold text-slate-900 leading-tight line-clamp-1">
                                {!notif.isRead && (
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-600 mr-1.5 mb-0.5 align-middle" />
                                )}
                                {notif.title}
                              </p>
                              <span className="text-[9px] font-mono font-medium text-slate-400 shrink-0">
                                {notif.createdAt 
                                  ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })
                                  : "now"
                                }
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed line-clamp-2 font-medium">
                              {notif.body}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-slate-200 bg-slate-50">
                <Link 
                  href="/dashboard/notifications"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <span>View all notifications</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
