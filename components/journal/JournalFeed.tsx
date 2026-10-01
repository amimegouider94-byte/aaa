'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  BookOpenText,
  PlusCircle,
  Clock,
  Smile,
  Utensils,
  Moon,
  Heart,
  Sparkles,
  Filter,
  Trash2,
} from 'lucide-react';

export const JournalFeed: React.FC = () => {
  const {
    dailyLogs,
    children,
    openAddLogModal,
    role,
    staff,
    currentUser,
    deleteDailyLog,
    t,
  } = useAppStore();
  const labels = t();

  const [selectedChildFilter, setSelectedChildFilter] = useState<string>('all');

  // Lock educator to their own assigned section using currentUser.id
  const currentStaff = role === 'staff' ? staff.find((s) => s.id === currentUser?.id) : null;
  const staffSectionId = currentStaff?.assignedSectionId || null;

  // Filter children visible to this user
  const visibleChildren = children.filter((c) => {
    if (role === 'staff') {
      return staffSectionId ? c.sectionId === staffSectionId : false;
    }
    return true;
  });

  const visibleChildIds = visibleChildren.map((c) => c.id);

  const filteredLogs = dailyLogs.filter((log) => {
    if (role === 'staff' && !visibleChildIds.includes(log.childId)) return false;
    return selectedChildFilter === 'all' || log.childId === selectedChildFilter;
  });

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'joyful':
        return { emoji: '😊', label: 'Joyeux & Souriant', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'calm':
        return { emoji: '😌', label: 'Calme & Posé', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'tired':
        return { emoji: '🥱', label: 'Fatigué', color: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'crying':
        return { emoji: '😢', label: 'Besoin de Câlins', color: 'bg-rose-100 text-rose-900 border-rose-300' };
      default:
        return { emoji: '⚡', label: 'Très Dynamique', color: 'bg-sky-100 text-sky-900 border-sky-300' };
    }
  };

  const getMealBadge = (meal: string) => {
    switch (meal) {
      case 'all':
        return { text: 'Tout Mangé 🥗', color: 'bg-emerald-100 text-emerald-900' };
      case 'partial':
        return { text: 'Partiellement Mangé 🍲', color: 'bg-amber-100 text-amber-900' };
      case 'little':
        return { text: 'Peu Mangé 🥣', color: 'bg-orange-100 text-orange-900' };
      default:
        return { text: 'Refusé ❌', color: 'bg-rose-100 text-rose-900' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpenText className="w-6 h-6 text-nursery-purple" />
            Journal Quotidien d'Éveil & Soins
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Fil d'actualité en direct rédigé par les éducatrices pour les parents.
          </p>
        </div>

        {role !== 'parent' && (
          <button
            onClick={openAddLogModal}
            className="bg-nursery-purple hover:bg-nursery-purple-dark text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-lg shadow-nursery-purple/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Rédiger une Note</span>
          </button>
        )}
      </div>

      {/* Filter by Child */}
      <div className="bg-white p-4 rounded-3xl border border-nursery-sand shadow-card flex items-center gap-3 overflow-x-auto">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="text-xs font-bold text-slate-500 shrink-0">Filtrer par enfant:</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedChildFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedChildFilter === 'all'
                ? 'bg-nursery-purple text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tous les enfants
          </button>
          {visibleChildren.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChildFilter(child.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedChildFilter === child.id
                  ? 'bg-nursery-purple text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{child.firstName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Feed Cards */}
      <div className="space-y-4">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => {
            const mood = getMoodEmoji(log.mood);
            const meal = getMealBadge(log.meal);
            const childObj = children.find((c) => c.id === log.childId);

            return (
              <div
                key={log.id}
                className="bg-white rounded-3xl border border-nursery-sand shadow-card p-5 hover:shadow-hover transition-all space-y-4"
              >
                {/* Top Author & Child Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    {childObj ? (
                      <img
                        src={childObj.photo}
                        alt=""
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-nursery-purple-light"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-nursery-purple-light text-nursery-purple-dark flex items-center justify-center font-bold text-lg">
                        👶
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {log.childName}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        ✍️ Éducatrice: <span className="font-semibold text-slate-700">{log.educatorName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5" /> {log.createdAt}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{log.date}</span>
                    </div>

                    {role !== 'parent' && (
                      <button
                        onClick={() => {
                          if (confirm('Voulez-vous vraiment supprimer cette note du journal?')) {
                            deleteDailyLog(log.id);
                          }
                        }}
                        title="Supprimer cette observation"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Meal */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <Utensils className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Repas du Midi
                      </span>
                      <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full inline-block mt-1 ${meal.color}`}>
                        {meal.text}
                      </span>
                      {log.mealNote && <p className="text-slate-600 text-[11px] mt-1">{log.mealNote}</p>}
                    </div>
                  </div>

                  {/* Nap */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <Moon className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Sieste & Repos
                      </span>
                      <p className="font-bold text-slate-800 mt-1">
                        {log.napStart && log.napEnd ? `${log.napStart} à ${log.napEnd}` : 'Non réalisée'}
                      </p>
                      {log.napQuality && (
                        <span className="text-[10px] text-indigo-700 font-semibold block mt-0.5">
                          Qualité: {log.napQuality}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mood */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <Smile className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Humeur
                      </span>
                      <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full inline-block mt-1 border ${mood.color}`}>
                        {mood.emoji} {mood.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Observation Note */}
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 text-xs sm:text-sm text-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                    💬 Observations Éducatives
                  </span>
                  <p className="leading-relaxed font-medium text-slate-800">
                    "{log.educatorNote}"
                  </p>
                  {log.hygiene && (
                    <p className="text-xs text-purple-800/80 pt-1 border-t border-purple-100">
                      🧼 Hygiène: {log.hygiene}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl border border-nursery-sand p-10 text-center text-slate-400 space-y-2">
            <BookOpenText className="w-10 h-10 mx-auto opacity-30 text-nursery-purple" />
            <p className="font-bold text-slate-600">Aucun journal trouvé pour la sélection</p>
          </div>
        )}
      </div>
    </div>
  );
};
