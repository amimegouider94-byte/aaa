'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { X, UserCheck, Check, Key } from 'lucide-react';

export const AddStaffModal: React.FC = () => {
  const { isAddStaffOpen, closeAddStaffModal, addStaff, sections } = useAppStore();

  const [name, setName] = useState('');
  const [role, setRole] = useState('Éducatrice Petite Section');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [assignedSectionId, setAssignedSectionId] = useState(sections[0]?.id || 'petite');
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
  );

  if (!isAddStaffOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const assignedSec = sections.find((s) => s.id === assignedSectionId);

    addStaff({
      name,
      role,
      email,
      phone,
      assignedSectionId,
      assignedSectionName: assignedSec ? assignedSec.name : undefined,
      avatar,
      status: 'on_duty',
    });

    closeAddStaffModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-nursery-sand overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-nursery-mint-dark to-emerald-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl">
              👩‍🏫
            </div>
            <div>
              <h3 className="font-bold text-lg">Créer un Compte Éducatrice / Personnel</h3>
              <p className="text-xs text-white/80">Accès au registre de présence et journal d'activité</p>
            </div>
          </div>
          <button
            onClick={closeAddStaffModal}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Nom Complet de l'Éducatrice *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Amina Benali"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-nursery-mint focus:outline-none font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Intitulé du Poste</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Éducatrice Petite Section"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Classe / Section Assignée</label>
              <select
                value={assignedSectionId}
                onChange={(e) => setAssignedSectionId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name} ({sec.codeName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Téléphone *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 33 22 11 00"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Professionnel *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="educatrice@garderie.fr"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs text-emerald-900 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-emerald-600" /> Identifiants de connexion générés:
            </p>
            <p>
              Nom d'utilisateur: <code className="bg-white px-1.5 py-0.5 rounded font-mono">educatrice_{name.toLowerCase().replace(/\s+/g, '_')}</code>
            </p>
            <p>
              Mot de passe temporaire: <code className="bg-white px-1.5 py-0.5 rounded font-mono">password123</code>
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeAddStaffModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-nursery-mint-dark text-white font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Créer le Compte Éducatrice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
