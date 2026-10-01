'use client';

import React, { useState } from 'react';
import { useAppStore, DailyLog } from '@/lib/store';
import { X, Sparkles, Check } from 'lucide-react';

export const AddLogModal: React.FC = () => {
  const { isAddLogOpen, closeAddLogModal, children, addDailyLog, staff, role, currentUser } = useAppStore();

  const currentStaff = role === 'staff' ? staff.find((s) => s.id === currentUser?.id) : null;
  const staffSectionId = currentStaff?.assignedSectionId || null;

  const visibleChildren = children.filter((c) => {
    if (role === 'staff') {
      return staffSectionId ? c.sectionId === staffSectionId : false;
    }
    return true;
  });

  const [childId, setChildId] = useState(visibleChildren[0]?.id || children[0]?.id || 'child-1');
  const [meal, setMeal] = useState<DailyLog['meal']>('all');
  const [mealNote, setMealNote] = useState('A très bien mangé sa purée et son fruit.');
  const [napStart, setNapStart] = useState('13:30');
  const [napEnd, setNapEnd] = useState('15:15');
  const [napQuality, setNapQuality] = useState<'paisible' | 'agite' | 'courte'>('paisible');
  const [mood, setMood] = useState<DailyLog['mood']>('joyful');
  const [hygiene, setHygiene] = useState('2 changes effectués.');
  const [educatorNote, setEducatorNote] = useState('');
  const [educatorName, setEducatorName] = useState(currentUser?.name || 'Sophie Martin');

  if (!isAddLogOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedChild = children.find((c) => c.id === childId);
    if (!selectedChild || !educatorNote) return;

    addDailyLog({
      childId,
      childName: `${selectedChild.firstName} ${selectedChild.lastName}`,
      sectionId: selectedChild.sectionId,
      date: new Date().toISOString().split('T')[0],
      meal,
      mealNote,
      napStart,
      napEnd,
      napQuality,
      mood,
      hygiene,
      educatorNote,
      educatorName,
    });

    closeAddLogModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-nursery-sand overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-nursery-purple to-indigo-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl">
              📝
            </div>
            <div>
              <h3 className="font-bold text-lg">Rédiger un Journal de la Journée</h3>
              <p className="text-xs text-white/80">Transmission quotidienne pour les parents</p>
            </div>
          </div>
          <button
            onClick={closeAddLogModal}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm max-h-[75vh] overflow-y-auto">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Sélectionner l'Enfant *</label>
            <select
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-nursery-purple focus:outline-none font-medium"
            >
              {visibleChildren.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} ({c.sectionName})
                </option>
              ))}
            </select>
          </div>

          {/* Meal Section */}
          <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
            <label className="font-bold text-emerald-900 block">🥗 Repas du Midi</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: 'all', label: 'Tout Mangé 🥗' },
                { val: 'partial', label: 'Partiel 🍲' },
                { val: 'little', label: 'Peu Mangé 🥣' },
                { val: 'refused', label: 'Refusé ❌' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.val}
                  onClick={() => setMeal(m.val as DailyLog['meal'])}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                    meal === m.val
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={mealNote}
              onChange={(e) => setMealNote(e.target.value)}
              placeholder="Détail du repas..."
              className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs focus:outline-none"
            />
          </div>

          {/* Nap Section */}
          <div className="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2">
            <label className="font-bold text-indigo-900 block">🌙 Sieste & Sommeil</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 block">Heure Début</span>
                <input
                  type="text"
                  value={napStart}
                  onChange={(e) => setNapStart(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-indigo-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Heure Fin</span>
                <input
                  type="text"
                  value={napEnd}
                  onChange={(e) => setNapEnd(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-indigo-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Mood Selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">😊 Humeur du jour</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'joyful', label: '😊 Joyeux' },
                { val: 'calm', label: '😌 Calme' },
                { val: 'energetic', label: '⚡ Dynamique' },
                { val: 'tired', label: '🥱 Fatigué' },
                { val: 'crying', label: '😢 Pleurs' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.val}
                  onClick={() => setMood(m.val as DailyLog['mood'])}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    mood === m.val
                      ? 'bg-nursery-purple text-white border-nursery-purple shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hygiene */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">🧼 Hygiene & Soins</label>
            <input
              type="text"
              value={hygiene}
              onChange={(e) => setHygiene(e.target.value)}
              placeholder="ex: 2 changes effectués à 11h et 15h"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          {/* Observation text */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">💬 Remarques & Observations Éducatrice *</label>
            <textarea
              required
              rows={3}
              value={educatorNote}
              onChange={(e) => setEducatorNote(e.target.value)}
              placeholder="ex: Léo a passé une excellente journée! Il a beaucoup apprécié le dessin et s'est montré très calme."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-nursery-purple focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeAddLogModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-nursery-purple text-white font-bold shadow-lg shadow-nursery-purple/20 hover:bg-nursery-purple-dark transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Publier dans le Journal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
