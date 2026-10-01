'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Megaphone, PlusCircle, Calendar, Info, AlertTriangle, Sparkles } from 'lucide-react';

export const Announcements: React.FC = () => {
  const { announcements, openAddNoticeModal, role, t } = useAppStore();
  const labels = t();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-nursery-orange" />
            Annonces & Communication Garderie
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Notes d'information, évènements et rappels importants diffusés aux parents et à l'équipe.
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={openAddNoticeModal}
            className="bg-nursery-orange hover:bg-nursery-orange-dark text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-lg shadow-nursery-orange/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publier une Annonce</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`p-6 rounded-3xl border shadow-card transition-all ${
              ann.type === 'event'
                ? 'bg-purple-50/70 border-purple-200 text-purple-950'
                : ann.type === 'important'
                ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                : 'bg-blue-50/70 border-blue-200 text-blue-950'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                    ann.type === 'event'
                      ? 'bg-purple-200 text-purple-900'
                      : ann.type === 'important'
                      ? 'bg-rose-200 text-rose-900'
                      : 'bg-blue-200 text-blue-900'
                  }`}
                >
                  {ann.type === 'event' ? '🎉 Événement' : ann.type === 'important' ? '⚠️ Important' : '📌 Information'}
                </span>
                <span className="text-xs font-semibold opacity-75">
                  Audience: {ann.targetAudience === 'all' ? 'Tous' : ann.targetAudience === 'parents' ? 'Parents' : 'Personnel'}
                </span>
              </div>
              <span className="text-xs opacity-70 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {ann.date}
              </span>
            </div>

            <h3 className="text-lg font-black">{ann.title}</h3>
            <p className="text-sm mt-2 leading-relaxed opacity-90">{ann.content}</p>

            <div className="mt-4 pt-3 border-t border-black/10 flex justify-between items-center text-xs opacity-75 font-semibold">
              <span>Auteur: {ann.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
