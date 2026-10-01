'use client';

import React, { useState } from 'react';
import { useAppStore, StaffMember } from '@/lib/store';
import { UserCheck, Phone, Mail, Edit3, PlusCircle, Trash2 } from 'lucide-react';
import { EditStaffModal } from './EditStaffModal';

export const StaffDirectory: React.FC = () => {
  const { staff, role, openAddStaffModal, deleteStaff } = useAppStore();

  const [selectedStaffToEdit, setSelectedStaffToEdit] = useState<StaffMember | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-nursery-mint" />
            Personnel Soignant & Éducatif
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Annuaire des éducatrices diplômées et direction de la garderie.
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={openAddStaffModal}
            className="bg-nursery-mint-dark hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-lg shadow-nursery-mint/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouvelle Éducatrice</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl border border-nursery-sand shadow-card p-5 space-y-4 hover:shadow-hover transition-all text-center relative flex flex-col justify-between"
          >
            <div className="space-y-3">
              {role === 'admin' && (
                <div className="absolute top-4 right-4 flex items-center gap-1">
                  <button
                    onClick={() => setSelectedStaffToEdit(member)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                    title="Modifier Éducatrice"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {member.id !== 'stf-1' && (
                    <button
                      onClick={() => {
                        if (confirm(`Voulez-vous vraiment supprimer le compte de ${member.name} ?`)) {
                          deleteStaff(member.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-all"
                      title="Supprimer Éducatrice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              <div className="relative inline-block mx-auto pt-2">
                <img
                  src={member.avatar}
                  alt=""
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-nursery-mint-light/60 mx-auto"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" title="En poste" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{member.name}</h3>
                <span className="text-xs font-semibold text-nursery-mint-dark bg-nursery-mint-light px-2.5 py-0.5 rounded-full inline-block mt-1">
                  {member.role}
                </span>
                {member.assignedSectionName && (
                  <p className="text-xs text-slate-500 mt-1 font-medium">Section: {member.assignedSectionName}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                <p className="text-slate-600 flex items-center justify-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> {member.phone}
                </p>
                <p className="text-slate-600 flex items-center justify-center gap-1 truncate">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" /> {member.email}
                </p>
              </div>
            </div>

            {role === 'admin' && (
              <div className="pt-2 border-t border-slate-100 flex justify-center">
                <button
                  onClick={() => setSelectedStaffToEdit(member)}
                  className="text-xs font-bold text-nursery-mint-dark hover:underline"
                >
                  Modifier / Supprimer →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Staff Modal */}
      <EditStaffModal
        staffMember={selectedStaffToEdit}
        isOpen={!!selectedStaffToEdit}
        onClose={() => setSelectedStaffToEdit(null)}
      />
    </div>
  );
};
