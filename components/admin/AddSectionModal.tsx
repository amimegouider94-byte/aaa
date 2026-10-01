'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { X, Layers, Check } from 'lucide-react';

export const AddSectionModal: React.FC = () => {
  const { isAddSectionOpen, closeAddSectionModal, addSection, staff } = useAppStore();

  const [name, setName] = useState('');
  const [codeName, setCodeName] = useState('');
  const [ageRange, setAgeRange] = useState('1 - 2 ans');
  const [educatorId, setEducatorId] = useState(staff[1]?.id || '');
  const [roomNumber, setRoomNumber] = useState('Salle 104');
  const [capacity, setCapacity] = useState(12);

  if (!isAddSectionOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !codeName) return;

    const educatorObj = staff.find((s) => s.id === educatorId);

    addSection({
      name,
      codeName,
      ageRange,
      educatorId,
      educatorName: educatorObj ? educatorObj.name : 'Non assigné',
      roomNumber,
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      capacity,
    });

    closeAddSectionModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-nursery-sand overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-nursery-mint-dark to-teal-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl">
              🏫
            </div>
            <div>
              <h3 className="font-bold text-lg">Ajouter une Nouvelle Classe / Section</h3>
              <p className="text-xs text-white/80">Définir le nom, la tranche d'âge et l'éducatrice</p>
            </div>
          </div>
          <button
            onClick={closeAddSectionModal}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Nom Officiel de la Section *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Petite Section, Section Bébés..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-nursery-mint focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nom Ludique / Emoji *</label>
              <input
                type="text"
                required
                value={codeName}
                onChange={(e) => setCodeName(e.target.value)}
                placeholder="ex: Les Poussins 🐣"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tranche d'Âge *</label>
              <input
                type="text"
                required
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                placeholder="ex: 6 à 18 mois, 2-3 ans"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Éducatrice Référente</label>
              <select
                value={educatorId}
                onChange={(e) => setEducatorId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">N° de Salle & Capacité</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Salle 101"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeAddSectionModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-nursery-mint-dark text-white font-bold shadow-lg hover:bg-teal-700 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Créer la Classe</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
