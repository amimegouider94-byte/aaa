'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { X, User, Key, Eye, EyeOff, Check, ShieldCheck, Heart, UserCheck } from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const {
    isProfileOpen,
    closeProfileModal,
    currentUser,
    role,
    staff,
    parents,
    updateStaff,
    updateParent,
    updateDaycareSettings,
    daycareSettings,
  } = useAppStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');

      if (role === 'staff' || role === 'admin') {
        const staffObj = staff.find((s) => s.id === currentUser.id) || staff[0];
        if (staffObj) {
          setName(staffObj.name);
          setEmail(staffObj.email);
          setPhone(staffObj.phone || '');
          setUsername(staffObj.username || '');
          setPassword(staffObj.password || 'password123');
        } else if (role === 'admin') {
          setDirectorNameAndSettings();
        }
      } else if (role === 'parent') {
        const parentObj = parents.find((p) => p.id === currentUser.id) || parents[0];
        if (parentObj) {
          setName(parentObj.name);
          setEmail(parentObj.email);
          setPhone(parentObj.phone || '');
          setUsername(parentObj.username || '');
          setPassword(parentObj.password || 'password123');
        }
      }
    }
  }, [currentUser, role, isProfileOpen, staff, parents]);

  const setDirectorNameAndSettings = () => {
    setName(daycareSettings.directorName || 'Valérie Dupont');
    setEmail(daycareSettings.email || 'direction@lespetitschampions.tn');
    setPhone(daycareSettings.phone || '');
    setUsername('admin');
    setPassword('adminpassword');
  };

  if (!isProfileOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'admin') {
      // Update daycare settings director name
      updateDaycareSettings({
        directorName: name,
        email,
        phone,
      });

      // Also update staff record if admin is in staff list
      const adminStaff = staff.find((s) => s.id === currentUser.id || s.role.toLowerCase().includes('directrice'));
      if (adminStaff) {
        updateStaff(adminStaff.id, {
          name,
          email,
          phone,
          username: username || adminStaff.username,
          password: password || adminStaff.password,
        });
      }
    } else if (role === 'staff') {
      const staffObj = staff.find((s) => s.id === currentUser.id) || staff[0];
      if (staffObj) {
        updateStaff(staffObj.id, {
          name,
          email,
          phone,
          username,
          password,
        });
      }
    } else if (role === 'parent') {
      const parentObj = parents.find((p) => p.id === currentUser.id) || parents[0];
      if (parentObj) {
        updateParent(parentObj.id, {
          name,
          email,
          phone,
          username,
          password,
        });
      }
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      closeProfileModal();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-nursery-sand overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-xl border border-white/20">
              👤
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span>Mon Profil & Identifiants</span>
                {role === 'admin' ? (
                  <span className="text-[10px] bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-black">
                    Admin
                  </span>
                ) : role === 'staff' ? (
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-black">
                    Éducatrice
                  </span>
                ) : (
                  <span className="text-[10px] bg-purple-500/30 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-black">
                    Parent
                  </span>
                )}
              </h3>
              <p className="text-xs text-white/70">Modification de vos informations et mot de passe</p>
            </div>
          </div>

          <button
            onClick={closeProfileModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="bg-emerald-500 text-white p-3 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Vos modifications et identifiants ont été mis à jour avec succès!</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Nom & Prénom *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Officiel</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Téléphone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+216 ..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Credentials Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Key className="w-4 h-4 text-indigo-600" />
              Accès & Mot de Passe de Connexion
            </h4>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Identifiant de Connexion (Login) *</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-indigo-950 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Nouveau Mot de Passe *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeProfileModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Enregistrer mon profil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
