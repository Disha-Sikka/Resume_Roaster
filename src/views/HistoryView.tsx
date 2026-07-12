import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  History, Search, Trash2, Edit2, Play, Calendar, 
  Flame, Award, AlertCircle, Check, X 
} from "lucide-react";
import { useHistory } from "../contexts/HistoryContext";
import { RoastHistoryItem } from "../types";

interface HistoryViewProps {
  onSelectHistoryItem: (item: RoastHistoryItem) => void;
}

export default function HistoryView({ onSelectHistoryItem }: HistoryViewProps) {
  const { history, deleteRoast, renameRoast, searchHistory } = useHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const filteredHistory = searchHistory(searchQuery);

  const handleStartRename = (item: RoastHistoryItem) => {
    setEditingId(item.id);
    setNewName(item.fileName);
  };

  const handleSaveRename = (id: string) => {
    if (newName.trim()) {
      renameRoast(id, newName.trim());
    }
    setEditingId(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { 
      year: "numeric", 
      month: "short", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex justify-center items-center gap-2.5">
          <History className="w-8 h-8 text-purple-600" />
          Roast Archive
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Access every resume you have previously roasted. Click view to reload the metrics and audit charts.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 relative max-w-md mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by candidate name, filename, roast text..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
        />
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-purple-500/30 transition-all shadow-sm"
            >
              <div className="flex-1 space-y-2 w-full">
                {editingId === item.id ? (
                  <div className="flex items-center gap-2 max-w-md">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                    />
                    <button
                      onClick={() => handleSaveRename(item.id)}
                      className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-600 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                      {item.fileName}
                    </h3>
                    <button
                      onClick={() => handleStartRename(item)}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      title="Rename"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    {formatDate(item.date)}
                  </span>
                  <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    {item.mode}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Candidate: {item.parsedData.name}
                  </span>
                </div>
              </div>

              {/* Scores and Actions */}
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-850 pt-3 md:pt-0">
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-lg font-extrabold text-purple-600 dark:text-purple-400">
                      {item.result.overallScore}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                      {item.result.atsScore}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">ATS %</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectHistoryItem(item)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    View
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this roast record?")) {
                        deleteRoast(item.id);
                      }
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 text-slate-400 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">No Roasts Found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 px-4">
              {searchQuery ? "No records matched your current query." : "You haven't roasted any resumes yet! Feed the flame to see your history."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
