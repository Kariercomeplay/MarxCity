'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import eventsData from '@/data/events.json';
import quizData from '@/data/quiz.json';

type Tab = 'events' | 'quiz' | 'explanations';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('events');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'events', label: `Sự kiện (${(eventsData as any[]).length})` },
    { id: 'quiz', label: `Quiz (${(quizData as any[]).length})` },
  ];

  const events = eventsData as any[];
  const quiz = quizData as any[];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">ADMIN DASHBOARD</h1>
          <a href="/" className="text-sm text-zinc-500 hover:text-zinc-700">← Về trang chủ</a>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-700 pb-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                tab === t.id
                  ? 'bg-white dark:bg-zinc-800 text-red-600 border border-b-0 border-zinc-200 dark:border-zinc-700'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Events Table */}
        {tab === 'events' && (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
                  <tr>
                    <th className="p-3 text-left font-semibold text-zinc-600">ID</th>
                    <th className="p-3 text-left font-semibold text-zinc-600">Title</th>
                    <th className="p-3 text-center font-semibold text-zinc-600">Ch</th>
                    <th className="p-3 text-center font-semibold text-zinc-600">Turn</th>
                    <th className="p-3 text-center font-semibold text-zinc-600">CLO</th>
                    <th className="p-3 text-center font-semibold text-zinc-600">Choices</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                  {events.map((ev, i) => (
                    <motion.tr
                      key={ev.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                      <td className="p-3 text-xs font-mono text-zinc-500">{ev.id}</td>
                      <td className="p-3 font-medium text-zinc-800 dark:text-zinc-200 max-w-xs truncate">{ev.title}</td>
                      <td className="p-3 text-center">{ev.chapter}</td>
                      <td className="p-3 text-center">{ev.turn}</td>
                      <td className="p-3 text-center">
                        <div className="flex gap-1 justify-center">
                          {ev.cloReferences?.map((c: string) => (
                            <span key={c} className="px-1.5 py-0.5 text-xs rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex gap-1 justify-center">
                          {ev.choices?.map((c: any) => (
                            <span key={c.id} className={`px-1.5 py-0.5 text-xs rounded font-medium ${
                              c.id === 'a' ? 'bg-red-100 text-red-700' :
                              c.id === 'b' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {c.id.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quiz Table */}
        {tab === 'quiz' && (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
                  <tr>
                    <th className="p-3 text-left font-semibold text-zinc-600">ID</th>
                    <th className="p-3 text-left font-semibold text-zinc-600">Question</th>
                    <th className="p-3 text-center font-semibold text-zinc-600">Chapter</th>
                    <th className="p-3 text-center font-semibold text-zinc-600">Difficulty</th>
                    <th className="p-3 text-center font-semibold text-zinc-600">Correct</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                  {quiz.map((q, i) => (
                    <tr key={q.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="p-3 text-xs font-mono text-zinc-500">{q.id}</td>
                      <td className="p-3 text-zinc-800 dark:text-zinc-200 max-w-md truncate">{q.question}</td>
                      <td className="p-3 text-center">{q.relatedChapter}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          {q.options?.[q.correctIndex] || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-xs text-zinc-400 text-center">
          Admin dashboard — dữ liệu chỉ đọc. Để sửa, chỉnh sửa file JSON trong <code className="text-red-500">src/data/</code>
        </p>
      </div>
    </div>
  );
}
