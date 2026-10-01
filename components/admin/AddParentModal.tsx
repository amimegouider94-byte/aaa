'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { X, UserPlus, Check, Key } from 'lucide-react';

export const AddParentModal: React.FC = () => {
  const { isAddParentOpen, closeAddParentModal, addParent } = useAppStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Paris, France');
  const [occupation, setOccupation] = useState('Cadre');
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  );

  if (!isAddParentOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addParent({
      name,
      phone,
      email,
      address,
      occupation,
      avatar,
    });

    closeAddParentModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-nursery-sand overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-nursery-sky-dark to-blue-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl">
              👨‍👩‍👧
            </div>
            <div>
              <h3 className="font-bold text-lg">Créer un Compte Parent</h3>
              <p className="text-xs text-white/80">Génère automatiquement les accès Espace Parent</p>
            </div>
          </div>
          <button
            onClick={closeAddParentModal}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Nom Complet du/des Parent(s) *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Marc & Sophie Martin"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-nursery-sky focus:outline-none font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Téléphone *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email (Accès Connexion) *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@email.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Adresse Résidence</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Profession</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-900 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-blue-600" /> Identifiants de connexion générés:
            </p>
            <p>
              Nom d'utilisateur: <code className="bg-white px-1.5 py-0.5 rounded font-mono">parent_{name.toLowerCase().replace(/\s+/g, '_')}</code>
            </p>
            <p>
              Mot de passe temporaire: <code className="bg-white px-1.5 py-0.5 rounded font-mono">password123</code>
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeAddParentModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-nursery-sky-dark text-white font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Créer le Compte Parent</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
