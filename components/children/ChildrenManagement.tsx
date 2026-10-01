'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore, Child } from '@/lib/store';
import {
  Baby,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  AlertTriangle,
  User,
  Phone,
  FileText,
  Edit,
  Trash2,
  Database,
  RefreshCw,
} from 'lucide-react';
import { EditChildModal } from './EditChildModal';

export const ChildrenManagement: React.FC = () => {
  const {
    children,
    sections,
    openAddChildModal,
    openChildDetailModal,
    selectedSectionFilter,
    setSelectedSectionFilter,
    searchQuery,
    setSearchQuery,
    role,
    staff,
    currentUser,
    deleteChild,
    fetchSupabaseData,
    isSupabaseLoading,
    t,
  } = useAppStore();

  const labels = t();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedChildToEdit, setSelectedChildToEdit] = useState<Child | null>(null);

  useEffect(() => {
    fetchSupabaseData();
  }, [fetchSupabaseData]);

  // Lock educator to their own section using currentUser.id
  const currentStaff = role === 'staff' ? staff.find((s) => s.id === currentUser?.id) : null;
  const staffSectionId = currentStaff?.assignedSectionId || null;

  const filteredChildren = children.filter((child) => {
    const matchesSection =
      role === 'staff'
        ? (staffSectionId ? child.sectionId === staffSectionId : false)
        : selectedSectionFilter === 'all' || child.sectionId === selectedSectionFilter;

    const matchesSearch =
      child.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.parentName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSection && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Baby className="w-6 h-6 text-nursery-purple" />
              {labels.childrenManagementTitle}
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
              <Database className="w-3 h-3 text-emerald-600" />
              <span>Supabase DB</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Dossiers individuels, fiches médicales et affectation par section.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchSupabaseData()}
            disabled={isSupabaseLoading}
            className="bg-white border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2.5 rounded-2xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-1.5 disabled:opacity-50"
            title="Re-fetch from Supabase DB"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isSupabaseLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync DB</span>
          </button>

          {role === 'admin' && (
            <button
              onClick={openAddChildModal}
              className="bg-nursery-purple hover:bg-nursery-purple-dark text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-lg shadow-nursery-purple/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{labels.addChildBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & View Controls */}
      <div className="bg-white p-4 rounded-3xl border border-nursery-sand shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par prénom, nom ou parent..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-nursery-purple focus:outline-none transition-all"
          />
        </div>

        {/* Section Filter Pills */}
        {role === 'staff' ? (
          <div className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5 shrink-0">
            <span>🔒 Votre Classe Affectée: {currentStaff?.assignedSectionName || 'Petite Section'} ({filteredChildren.length} élèves)</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedSectionFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSectionFilter === 'all'
                  ? 'bg-nursery-purple text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {labels.allSections} ({children.length})
            </button>
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSectionFilter(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedSectionFilter === sec.id
                    ? 'bg-nursery-purple text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sec.codeName}
              </button>
            ))}
          </div>
        )}

        {/* Grid/Table Switch */}
        <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl text-slate-600">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredChildren.map((child) => (
            <div
              key={child.id}
              className="bg-white rounded-3xl border border-nursery-sand shadow-card p-5 hover:shadow-hover transition-all space-y-4 flex flex-col justify-between group relative"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={child.photo}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-nursery-purple-light shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-nursery-purple-light text-nursery-purple-dark inline-block mb-0.5">
                      {child.sectionName}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base truncate">
                      {child.firstName} {child.lastName}
                    </h3>
                    <p className="text-xs text-slate-400">Né(e) le {child.dateOfBirth}</p>
                  </div>
                </div>

                {/* Medical Alert Badge */}
                {child.hasMedicalAlert && (
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-2xl flex items-center gap-2 text-xs text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate font-semibold">{child.medicalNotes[0]}</span>
                  </div>
                )}

                {/* Parent Contact */}
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <p className="flex items-center gap-1.5 font-medium text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{child.parentName}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{child.parentPhone}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => openChildDetailModal(child)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all text-center flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Dossier</span>
                </button>

                {role === 'admin' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedChildToEdit(child)}
                      className="p-2 rounded-xl bg-nursery-purple-light text-nursery-purple-dark hover:bg-nursery-purple hover:text-white font-bold transition-all"
                      title="Modifier Enfant"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Voulez-vous vraiment supprimer le dossier de ${child.firstName} ${child.lastName}?`)) {
                          deleteChild(child.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-bold transition-all"
                      title="Supprimer Enfant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-nursery-sand shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Enfant</th>
                  <th className="p-4">Section</th>
                  <th className="p-4">Parent Référent</th>
                  <th className="p-4">Alertes Médicales</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredChildren.map((child) => (
                  <tr key={child.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={child.photo} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-slate-800">
                          {child.firstName} {child.lastName}
                        </p>
                        <span className="text-[11px] text-slate-400">{child.dateOfBirth}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{child.sectionName}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{child.parentName}</p>
                      <p className="text-[11px] text-slate-400">{child.parentPhone}</p>
                    </td>
                    <td className="p-4">
                      {child.hasMedicalAlert ? (
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full inline-block">
                          ⚠️ {child.medicalNotes[0]}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Aucune</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => openChildDetailModal(child)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                      >
                        Fiche
                      </button>
                      {role === 'admin' && (
                        <>
                          <button
                            onClick={() => setSelectedChildToEdit(child)}
                            className="px-3 py-1.5 rounded-xl bg-nursery-purple-light text-nursery-purple-dark font-bold text-xs hover:bg-nursery-purple hover:text-white"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Voulez-vous vraiment supprimer le dossier de ${child.firstName} ${child.lastName}?`)) {
                                deleteChild(child.id);
                              }
                            }}
                            className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-bold transition-all inline-block align-middle"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Child Modal */}
      <EditChildModal
        child={selectedChildToEdit}
        isOpen={!!selectedChildToEdit}
        onClose={() => setSelectedChildToEdit(null)}
      />
    </div>
  );
};
