'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { LogIn, Lock, User, RefreshCw } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, daycareSettings } = useAppStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username || !password) {
      setErrorMsg('Veuillez remplir tous les champs.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(username, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Identifiant ou mot de passe incorrect. Veuillez réessayer.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erreur lors de la connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-nursery-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-nursery-sand shadow-2xl overflow-hidden animate-in fade-in">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-nursery-orange via-nursery-coral to-rose-400 p-8 text-center text-white space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-3xl font-black mx-auto shadow-lg ring-4 ring-white/30 animate-bounce">
            {daycareSettings.logo || '🎈'}
          </div>
          <h1 className="text-2xl font-black tracking-tight">{daycareSettings.name}</h1>
          <p className="text-xs text-white/80">{daycareSettings.subtitle}</p>
        </div>

        {/* Uniform Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div className="text-center space-y-1">
            <h2 className="font-extrabold text-slate-800 text-lg">Espace de Connexion Unique</h2>
            <p className="text-xs text-slate-500 font-medium">Authentification Supabase avec Rôles ('admin', 'educator', 'parent')</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">Email / Nom d'utilisateur</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: admin@garderie.com, educatrice@garderie.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:border-nursery-orange focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:border-nursery-orange focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 text-nursery-orange animate-spin" />
                <span>Vérification des identifiants...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-nursery-orange" />
                <span>Se Connecter au Système</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
