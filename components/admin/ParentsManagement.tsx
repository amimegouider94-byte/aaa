'use client';

import React, { useState } from 'react';
import { useAppStore, Parent } from '@/lib/store';
import { Users, PlusCircle, Search, Edit3, Trash2, Mail, Phone, Home, Key } from 'lucide-react';
import { EditParentModal } from './EditParentModal';

export const ParentsManagement: React.FC = () => {
  const { parents, openAddParentModal, children, searchQuery, setSearchQuery, deleteParent } = useAppStore();

  const [selectedParentToEdit, setSelectedParentToEdit] = useState<Parent | null>(null);

  const filteredParents = parents.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
    );
  });

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-nursery-sky-dark" />
            Gestion des Comptes Parents & Familles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Annuaire des responsables légaux, coordonnées et gestion des accès à l'Espace Parent.
          </p>
        </div>

        <button
          onClick={openAddParentModal}
          className="bg-nursery-sky-dark hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-lg shadow-nursery-sky/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nouveau Parent</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-nursery-sand shadow-card flex items-center gap-3">
        <div className="w-full relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un parent par nom, email ou téléphone..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-nursery-sky focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Parents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParents.map((parent) => {
          const linkedChildren = children.filter((c) => parent.childrenIds.includes(c.id));

          return (
            <div
              key={parent.id}
              className="bg-white rounded-3xl border border-nursery-sand shadow-card p-5 space-y-4 hover:shadow-hover transition-all relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={parent.avatar}
                      alt=""
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-nursery-sky-light"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{parent.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{parent.occupation || 'Parent Référent'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedParentToEdit(parent)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                      title="Modifier Parent"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Voulez-vous vraiment supprimer le compte parent de ${parent.name} ?`)) {
                          deleteParent(parent.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-all"
                      title="Supprimer Parent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {parent.phone}
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {parent.email}
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Home className="w-3.5 h-3.5 text-slate-400" /> {parent.address}
                  </p>
                </div>

                {/* Access Credentials Badge */}
                <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-900 flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1">
                    <Key className="w-3 h-3 text-blue-600" /> Identifiant:
                  </span>
                  <code className="font-mono bg-white px-2 py-0.5 rounded font-bold text-slate-800">
                    {parent.username || `parent_${parent.name.toLowerCase().replace(/\s+/g, '_')}`}
                  </code>
                </div>

                {/* Linked Children Pills */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Enfants Inscrits ({linkedChildren.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {linkedChildren.length > 0 ? (
                      linkedChildren.map((c) => (
                        <span
                          key={c.id}
                          className="bg-nursery-purple-light text-nursery-purple-dark text-xs font-bold px-2.5 py-1 rounded-xl"
                        >
                          👶 {c.firstName} ({c.sectionName})
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">Aucun enfant lié</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedParentToEdit(parent)}
                  className="text-xs font-bold text-nursery-sky-dark hover:underline"
                >
                  Modifier / Supprimer →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Parent Modal */}
      <EditParentModal
        parent={selectedParentToEdit}
        isOpen={!!selectedParentToEdit}
        onClose={() => setSelectedParentToEdit(null)}
      />
    </div>
  );
};
