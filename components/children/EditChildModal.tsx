'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore, Child } from '@/lib/store';
import { X, Edit, Trash2, Check } from 'lucide-react';

interface EditChildModalProps {
  child: Child | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditChildModal: React.FC<EditChildModalProps> = ({ child, isOpen, onClose }) => {
  const { updateChild, deleteChild, sections, parents } = useAppStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [sectionId, setSectionId] = useState('');
  const [medicalNoteText, setMedicalNoteText] = useState('');
  const [parentId, setParentId] = useState('');

  useEffect(() => {
    if (child) {
      setFirstName(child.firstName);
      setLastName(child.lastName);
      setDateOfBirth(child.dateOfBirth);
      setGender(child.gender);
      setSectionId(child.sectionId);
      setMedicalNoteText(child.medicalNotes.join(', '));
      setParentId(child.parentId);
    }
  }, [child]);

  if (!isOpen || !child) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sectionObj = sections.find((s) => s.id === sectionId);
    const parentObj = parents.find((p) => p.id === parentId);

    const medArray = medicalNoteText
      ? medicalNoteText.split(',').map((s) => s.trim())
      : [];

    updateChild(child.id, {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      sectionId,
      sectionName: sectionObj ? `${sectionObj.name} - ${sectionObj.codeName}` : child.sectionName,
      medicalNotes: medArray,
      hasMedicalAlert: medArray.length > 0,
      parentId,
      parentName: parentObj ? parentObj.name : child.parentName,
    });

    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Voulez-vous vraiment supprimer définitivement le dossier de ${child.firstName} ${child.lastName}?`)) {
      deleteChild(child.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-nursery-sand overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-nursery-purple-dark to-indigo-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl">
              ✏️
            </div>
            <div>
              <h3 className="font-bold text-lg">Modifier l'Enfant ({child.firstName})</h3>
              <p className="text-xs text-white/80">Mise à jour des informations administratives</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Prénom *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-nursery-purple focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nom de Famille *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-nursery-purple focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Date de Naissance</label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Genre</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="M">Garçon 👦</option>
                <option value="F">Fille 👧</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Classe / Section</label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.codeName})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Parent Référent</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Notes Médicales / Allergies</label>
            <input
              type="text"
              value={medicalNoteText}
              onChange={(e) => setMedicalNoteText(e.target.value)}
              placeholder="ex: Allergie arachides, Ventoline"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold hover:bg-rose-100 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer Enfant</span>
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
                className="px-6 py-2.5 rounded-xl bg-nursery-purple-dark text-white font-bold shadow-lg hover:bg-indigo-800 transition-all flex items-center gap-2"
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
