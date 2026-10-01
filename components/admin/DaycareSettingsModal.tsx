'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { X, Settings, Trash2, RefreshCw, Check, UserCheck, Key, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const DaycareSettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    closeSettingsModal,
    daycareSettings,
    updateDaycareSettings,
    clearAllData,
    resetToDefaultDemo,
    staff,
    parents,
    updateStaff,
    updateParent,
  } = useAppStore();

  const [showPasswords, setShowPasswords] = useState(false);

  const [name, setName] = useState(daycareSettings.name);
  const [subtitle, setSubtitle] = useState(daycareSettings.subtitle);
  const [logo, setLogo] = useState(daycareSettings.logo);
  const [directorName, setDirectorName] = useState(daycareSettings.directorName || 'Valérie Dupont (Directrice)');
  const [address, setAddress] = useState(daycareSettings.address);
  const [phone, setPhone] = useState(daycareSettings.phone);
  const [email, setEmail] = useState(daycareSettings.email);
  const [siret, setSiret] = useState(daycareSettings.siret);
  const [currency, setCurrency] = useState(daycareSettings.currency || 'DT');
  const [monthlyFee, setMonthlyFee] = useState(String(daycareSettings.monthlyFee || 480));
  const [registrationFee, setRegistrationFee] = useState(String(daycareSettings.registrationFee || 200));

  useEffect(() => {
    if (isSettingsOpen) {
      setName(daycareSettings.name);
      setSubtitle(daycareSettings.subtitle);
      setLogo(daycareSettings.logo);
      setDirectorName(daycareSettings.directorName || 'Valérie Dupont (Directrice)');
      setAddress(daycareSettings.address);
      setPhone(daycareSettings.phone);
      setEmail(daycareSettings.email);
      setSiret(daycareSettings.siret);
      setCurrency(daycareSettings.currency || 'DT');
      setMonthlyFee(String(daycareSettings.monthlyFee || 480));
      setRegistrationFee(String(daycareSettings.registrationFee || 200));
    }
  }, [isSettingsOpen, daycareSettings]);

  if (!isSettingsOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDaycareSettings({
      name,
      subtitle,
      logo,
      directorName,
      address,
      phone,
      email,
      siret,
      currency,
      monthlyFee: parseFloat(monthlyFee) || 480,
      registrationFee: parseFloat(registrationFee) || 200,
    });
    closeSettingsModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-nursery-sand overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-xl">
              ⚙️
            </div>
            <div>
              <h3 className="font-bold text-lg">Configuration & Direction de la Garderie</h3>
              <p className="text-xs text-white/70">Nom, directrice, logo et réinitialisation</p>
            </div>
          </div>
          <button
            onClick={closeSettingsModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm max-h-[75vh] overflow-y-auto">
          {/* Logo & Name */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Logo / Emoji *</label>
              <input
                type="text"
                required
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="🎈"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl focus:border-nursery-orange focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Nom de la Garderie *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Les Petits Champions"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-nursery-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nom de la Directrice / Propriétaire *</label>
              <input
                type="text"
                required
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
                placeholder="ex: Valérie Dupont (Directrice)"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Devise (ex: DT, EUR, USD)</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="DT"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Sous-titre / Description</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="ex: Crèche & Garderie Privée Agrée"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Numéro Téléphone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Adresse Email Officielle</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Adresse Physique</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">N° SIRET / Agrément</label>
              <input
                type="text"
                value={siret}
                onChange={(e) => setSiret(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Billing Fees */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
            <label className="font-bold text-amber-900 block text-xs uppercase tracking-wider">
              💰 Paramètres de Facturation
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Frais Mensuel de Scolarité ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-xl font-bold text-amber-900"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">Appliqué lors de la génération mensuelle</p>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Frais d'Inscription ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={registrationFee}
                  onChange={(e) => setRegistrationFee(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-xl font-bold text-amber-900"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">Montant par défaut à l'inscription</p>
              </div>
            </div>
          </div>

          {/* Master Password Directory Section */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 block text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-4 h-4 text-indigo-600" />
                🔑 Annuaire des Comptes & Mots de Passe (Admin)
              </label>
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
              >
                {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPasswords ? 'Masquer' : 'Afficher les mots de passe'}</span>
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 max-h-48 overflow-y-auto space-y-2">
              {/* Staff Accounts */}
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Éducatrices & Direction ({staff.length})</p>
              {staff.map((s) => (
                <div key={s.id} className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-semibold">
                  <div>
                    <span className="font-bold text-slate-900">{s.name}</span>
                    <span className="text-[10px] text-slate-500 block">{s.role}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-indigo-900 font-bold">{s.username || `educatrice_${s.id}`}</span>
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      {showPasswords ? (s.password || 'password123') : '••••••••'}
                    </span>
                  </div>
                </div>
              ))}

              {/* Parent Accounts */}
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-2 border-t border-slate-200">Parents ({parents.length})</p>
              {parents.map((p) => (
                <div key={p.id} className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-semibold">
                  <div>
                    <span className="font-bold text-slate-900">{p.name}</span>
                    <span className="text-[10px] text-slate-500 block">{p.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-indigo-900 font-bold">{p.username || `parent_${p.id}`}</span>
                    <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded font-bold">
                      {showPasswords ? (p.password || 'password123') : '••••••••'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wipe & Reset Section */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <label className="font-bold text-slate-800 block">🧹 Gestion des Données (Effacer / Réinitialiser)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Voulez-vous vraiment effacer tous les enfants, parents et registres pour recommencer à zéro?')) {
                    clearAllData();
                    closeSettingsModal();
                  }
                }}
                className="p-3 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs hover:bg-rose-100 transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Tout Effacer (Base Vierge)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Recharger les données de démonstration d\'origine?')) {
                    resetToDefaultDemo();
                    closeSettingsModal();
                  }
                }}
                className="p-3 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs hover:bg-indigo-100 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recharger la Démo</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeSettingsModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Enregistrer les Modifs</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
