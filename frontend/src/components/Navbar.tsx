'use client';

import React from 'react';
import { GraduationCap, User, ShieldCheck, LogOut, LayoutDashboard, FileSpreadsheet } from 'lucide-react';

interface NavbarProps {
  currentRole: 'MONITOR' | 'COORDINADOR';
  onRoleChange: (role: 'MONITOR' | 'COORDINADOR') => void;
  userName: string;
  userCode: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  userName,
  userCode,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo y Nombre Institucional */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">Monitorías USB</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full">
                  Periodo 2026-2
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Universidad Simón Bolívar — Ingeniería de Sistemas</p>
            </div>
          </div>

          {/* Selector de Rol (Demostración de RBAC) */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => onRoleChange('MONITOR')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'MONITOR'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Vista Monitor</span>
            </button>
            <button
              onClick={() => onRoleChange('COORDINADOR')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'COORDINADOR'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Vista Coordinación</span>
            </button>
          </div>

          {/* Información del Usuario */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-800">{userName}</p>
              <p className="text-xs text-slate-500 font-mono">{userCode}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-emerald-600 flex items-center justify-center text-slate-700 font-bold text-sm">
              {userName.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
