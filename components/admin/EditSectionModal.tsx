'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore, Section } from '@/lib/store';
import { X, Edit, Trash2, Check } from 'lucide-react';

interface EditSectionModalProps {
  section: Section | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditSectionModal: React.FC<EditSectionModalProps> = ({ section, isOpen, onClose }) => {
  const { updateSection, deleteSection, staff } = useAppStore();

  const [name, setName] = useState('');
  const [codeName, setCodeName] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [educatorId, setEducatorId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState(12);

  useEffect(() => {
    if (section) {
      setName(section.name);
      setCodeName(section.codeName);
      setAgeRange(section.ageRange);
      setEducatorId(section.educatorId || '');
      setRoomNumber(section.roomNumber);
      setCapacity(section.capacity);
    }
  }, [section]);

  if (!isOpen || !section) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const educatorObj = staff.find((s) => s.id === educatorId);

    updateSection(section.id, {
      name,
      codeName,
      ageRange,
      educatorId,
      educatorName: educatorObj ? educatorObj.name : 'Non assigné',
      roomNumber,
      capacity,
    });

    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Voulez-vous vraiment supprimer la section ${section.name}?`)) {
      deleteSection(section.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-nursery-sand overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl">
              ✏️
            </div>
            <div>
              <h3 className="font-bold text-lg">Modifier la Section ({section.name})</h3>
              <p className="text-xs text-white/80">Nom, nom ludique, tranche d'âge et éducatrice</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Nom Officiel *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
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
                <option value="">Non assignée</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Salle & Capacité</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold hover:bg-rose-100 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer Section</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
