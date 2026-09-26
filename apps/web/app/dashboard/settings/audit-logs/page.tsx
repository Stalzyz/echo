"use client";

import { useEffect, useState } from "react";
import { ApiClient } from "@/lib/api";
import { Loader2, ShieldCheck, RefreshCw } from "lucide-react";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "text-emerald-700 bg-emerald-50 border-emerald-200",
  UPDATE: "text-blue-700 bg-blue-50 border-blue-200",
  DELETE: "text-rose-700 bg-rose-50 border-rose-200",
  VIEW:   "text-slate-700 bg-slate-100 border-slate-200",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.get(`/settings/audit-logs?page=${page}&limit=50`);
      setLogs(data.logs || []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [page]);

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 max-w-6xl mx-auto custom-scrollbar">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-teal-600" /> System Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">A tamper-evident log of every security, administrative, and data mutation event inside the OS.</p>
        </div>
        <button 
          onClick={fetchLogs} 
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-xs shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-teal-600" /> Refresh Audit Logs
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-3xl shadow-xs">
          <Loader2 className="animate-spin text-teal-600 w-8 h-8 mb-2" />
          <span className="text-xs font-bold text-slate-500">Loading audit trail...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs text-slate-500 font-medium text-xs">
          No audit logs recorded yet. System events will automatically appear here as team members take actions.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3.5">Timestamp</th>
                  <th className="px-4 py-3.5">Action</th>
                  <th className="px-4 py-3.5">Resource</th>
                  <th className="px-4 py-3.5">User / Initiator</th>
                  <th className="px-4 py-3.5">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {logs.map((log, i) => (
                  <tr key={log.id || i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-xs whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border font-mono ${ACTION_COLORS[log.action] || 'text-slate-700 bg-slate-100 border-slate-200'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-slate-900 font-bold text-xs">{log.resource}</span>
                      {log.resourceId && <span className="text-slate-400 font-mono text-[11px] ml-2">#{log.resourceId?.slice(0, 8)}</span>}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 font-semibold text-xs">
                      {log.user?.email || log.user?.name || log.userId?.slice(0, 8) || "System / Automated"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs font-mono">{log.ipAddress || '127.0.0.1'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
