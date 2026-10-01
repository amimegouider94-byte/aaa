'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { X, UserPlus, Sparkles, PlusCircle } from 'lucide-react';

export const AddChildModal: React.FC = () => {
  const { isAddChildOpen, closeAddChildModal, addChild, addParent, sections, parents } = useAppStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2024-03-15');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [sectionId, setSectionId] = useState<'petite' | 'moyenne' | 'grande'>('petite');
  const [medicalNotesStr, setMedicalNotesStr] = useState('');
  const [hasMedicalAlert, setHasMedicalAlert] = useState(false);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  
  // Parent selection vs inline creation
  const [isCreatingNewParent, setIsCreatingNewParent] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(parents[0]?.id || '');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newParentEmail, setNewParentEmail] = useState('');
  const [newParentAddress, setNewParentAddress] = useState('');
  const [newParentOccupation, setNewParentOccupation] = useState('');

  const [photoUrl, setPhotoUrl] = useState('');

  if (!isAddChildOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;

    let parentToLink = parents.find((p) => p.id === selectedParentId);

    if (isCreatingNewParent) {
      if (!newParentName) return;
      parentToLink = addParent({
        name: newParentName,
        phone: newParentPhone || '+216 20 000 000',
        email: newParentEmail || `${newParentName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        address: newParentAddress || 'Tunis',
        occupation: newParentOccupation || 'Parent Référent',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      });
    }

    if (!parentToLink && parents.length > 0) {
      parentToLink = parents[0];
    }

    const section = sections.find((s) => s.id === sectionId) || sections[0];

    const defaultPhoto = gender === 'M'
      ? 'https://images.unsplash.com/photo-1595454116884-927636952897?auto=format&fit=crop&w=300&q=80'
      : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80';

    addChild({
      firstName,
      lastName,
      photo: photoUrl || defaultPhoto,
      dateOfBirth,
      gender,
      sectionId,
      sectionName: section.name,
      medicalNotes: medicalNotesStr ? medicalNotesStr.split(',').map((s) => s.trim()) : ['Aucune allergie'],
      hasMedicalAlert,
      emergencyContact: {
        name: emergencyName || (parentToLink ? parentToLink.name : `${firstName} ${lastName}`),
        relationship: 'Parent / Tuteur',
        phone: emergencyPhone || (parentToLink ? parentToLink.phone : ''),
      },
      parentId: parentToLink ? parentToLink.id : `par-${Date.now()}`,
      parentName: parentToLink ? parentToLink.name : `${firstName} ${lastName}`,
      parentPhone: parentToLink ? parentToLink.phone : '',
      parentEmail: parentToLink ? parentToLink.email : '',
      enrollmentDate: new Date().toISOString().split('T')[0],
    });

    closeAddChildModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-nursery-sand overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-nursery-orange to-nursery-coral p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl">
              👶
            </div>
            <div>
              <h3 className="font-bold text-lg">Inscrire un Nouvel Enfant</h3>
              <p className="text-xs text-white/80">Complétez le dossier d'inscription en crèche</p>
            </div>
          </div>
          <button
            onClick={closeAddChildModal}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Prénom *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="ex: Lucas"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-nursery-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nom *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="ex: Bernard"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-nursery-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Date de Naissance</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-nursery-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Genre</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-nursery-orange focus:outline-none"
              >
                <option value="M">Garçon 👦</option>
                <option value="F">Fille 👧</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Section Affectée</label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value as 'petite' | 'moyenne' | 'grande')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-nursery-orange focus:outline-none font-medium"
              >
                <option value="petite">Petite Section (1-2 ans)</option>
                <option value="moyenne">Moyenne Section (2-3 ans)</option>
                <option value="grande">Grande Section (3-4 ans)</option>
              </select>
            </div>
          </div>

          {/* Parent Association Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 block text-xs">
                👨‍👩‍👧 Responsable Légal / Parent
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingNewParent(!isCreatingNewParent)}
                className="text-xs font-extrabold text-nursery-orange hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{isCreatingNewParent ? "Choisir parent existant" : "+ Créer un NOUVEAU Parent"}</span>
              </button>
            </div>

            {isCreatingNewParent ? (
              <div className="space-y-2.5 bg-white p-3.5 rounded-xl border border-nursery-orange/30 animate-in fade-in">
                <span className="text-[11px] font-bold text-nursery-orange-dark uppercase tracking-wider block">
                  Nouveau Compte Parent
                </span>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nom Complet du Parent *</label>
                  <input
                    type="text"
                    required
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    placeholder="ex: Mohamed & Salma Ben Ammar"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Téléphone *</label>
                    <input
                      type="text"
                      required
                      value={newParentPhone}
                      onChange={(e) => setNewParentPhone(e.target.value)}
                      placeholder="+216 98 000 000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email</label>
                    <input
                      type="email"
                      value={newParentEmail}
                      onChange={(e) => setNewParentEmail(e.target.value)}
                      placeholder="parent@email.tn"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Adresse</label>
                    <input
                      type="text"
                      value={newParentAddress}
                      onChange={(e) => setNewParentAddress(e.target.value)}
                      placeholder="Tunis"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Profession</label>
                    <input
                      type="text"
                      value={newParentOccupation}
                      onChange={(e) => setNewParentOccupation(e.target.value)}
                      placeholder="Ingénieur, Médecin..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <select
                value={selectedParentId}
                onChange={(e) => setSelectedParentId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-nursery-orange focus:outline-none font-medium"
              >
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.phone})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Medical Notes & Flag */}
          <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                ⚠️ Médical & Régime Alimentaire
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasMedicalAlert}
                  onChange={(e) => setHasMedicalAlert(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="text-xs font-bold text-rose-800">Alerte Médicale Active</span>
              </label>
            </div>
            <input
              type="text"
              value={medicalNotesStr}
              onChange={(e) => setMedicalNotesStr(e.target.value)}
              placeholder="ex: Allergie arachides, Asthme léger, Sans Gluten (séparés par des virgules)"
              className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs focus:outline-none"
            />
          </div>

          {/* Photo URL optional */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Photo Profil (URL Optionnelle)</label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeAddChildModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-nursery-orange text-white font-bold shadow-lg shadow-nursery-orange/20 hover:bg-nursery-orange-dark transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Valider l'Inscription</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
