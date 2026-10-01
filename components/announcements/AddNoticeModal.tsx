'use client';

import React, { useState } from 'react';
import { useAppStore, Announcement } from '@/lib/store';
import { X, Sparkles, Check } from 'lucide-react';

export const AddNoticeModal: React.FC = () => {
  const { isAddNoticeOpen, closeAddNoticeModal, addAnnouncement } = useAppStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<Announcement['type']>('info');
  const [targetAudience, setTargetAudience] = useState<Announcement['targetAudience']>('all');

  if (!isAddNoticeOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    addAnnouncement({
      title,
      content,
      type,
      targetAudience,
      date: new Date().toISOString().split('T')[0],
      author: 'Valérie Dupont (Directrice)',
    });

    closeAddNoticeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-nursery-sand overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-nursery-orange to-nursery-coral p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl">
              📢
            </div>
            <div>
              <h3 className="font-bold text-lg">Publier une Nouvelle Annonce</h3>
              <p className="text-xs text-white/80">Diffusion aux parents et éducatrices</p>
            </div>
          </div>
          <button
            onClick={closeAddNoticeModal}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Titre de l'Annonce *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: 🎉 Atelier Pâtisserie Vendredi Prochain"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-nursery-orange focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Type d'Annonce</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Announcement['type'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="info">📌 Information Générale</option>
                <option value="important">⚠️ Rappel Important</option>
                <option value="event">🎉 Événement / Fête</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Destinataires</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as Announcement['targetAudience'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="all">Tous (Parents & Équipe)</option>
                <option value="parents">Parents Uniquement</option>
                <option value="staff">Équipe Éducative</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Contenu du Message *</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Saisissez le texte détaillé de votre communication..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-nursery-orange focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeAddNoticeModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-nursery-orange text-white font-bold shadow-lg shadow-nursery-orange/20 hover:bg-nursery-orange-dark transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Publier l'Annonce</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
