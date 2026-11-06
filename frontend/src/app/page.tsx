'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ProgressCard } from '../components/ProgressCard';
import { HistoryTable } from '../components/HistoryTable';
import { NewSessionModal } from '../components/NewSessionModal';
import { CoordinatorDashboard } from '../components/CoordinatorDashboard';
import { ImportSiaModal } from '../components/ImportSiaModal';
import { MonitoringSession, MonitorProgress, MonitorSummary } from '../types';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<'MONITOR' | 'COORDINADOR'>('MONITOR');
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Sesiones iniciales del Monitor Autor (Johan Sebastian Rojas Gómez - MONITOR18)
  const [sessions, setSessions] = useState<MonitoringSession[]>([
    {
      id: 'sess-1',
      monitorProfileId: 'profile-author',
      academicPeriodId: 'period-2026-2',
      subjectId: 'sub-2',
      subjectName: 'Bases de Datos I',
      sessionDate: '2026-10-24',
      startTime: '14:00',
      endTime: '16:00',
      calculatedHours: 2.0,
      sessionType: 'Taller',
      topic: 'Consultas SQL Complejas (JOINs, GROUP BY, HAVING) y Subconsultas',
      observation: 'Taller práctico con 4 estudiantes resolviendo el laboratorio 3 de la asignatura.',
      status: 'APROBADO',
      source: 'DIRECT',
      attendees: [
        { studentIdCard: '1090123456', studentName: 'Brayhan Alejandro Gómez Vega', careerProgram: 'Ingeniería de Sistemas' },
        { studentIdCard: '1090789012', studentName: 'Valeria Barbosa', careerProgram: 'Ingeniería de Sistemas' },
        { studentIdCard: '1090345678', studentName: 'Juan Camilo Pérez', careerProgram: 'Ingeniería de Sistemas' },
        { studentIdCard: '1090901234', studentName: 'María Fernanda Ruiz', careerProgram: 'Ingeniería Industrial' },
      ],
      createdAt: '2026-10-24T16:05:00Z',
    },
    {
      id: 'sess-2',
      monitorProfileId: 'profile-author',
      academicPeriodId: 'period-2026-2',
      subjectId: 'sub-3',
      subjectName: 'Estructuras de Datos',
      sessionDate: '2026-10-20',
      startTime: '10:00',
      endTime: '12:00',
      calculatedHours: 2.0,
      sessionType: 'Presencial',
      topic: 'Implementación de Grafos, BFS y Algoritmo de Dijkstra',
      observation: 'Explicación en pizarra de la representación de grafos mediante matrices y listas de adyacencia.',
      status: 'APROBADO',
      source: 'DIRECT',
      attendees: [
        { studentIdCard: '1090567890', studentName: 'Carlos Mario Peña', careerProgram: 'Ingeniería de Sistemas' },
        { studentIdCard: '1090678901', studentName: 'Diana Marcela Torres', careerProgram: 'Ingeniería Multimedia' },
      ],
      createdAt: '2026-10-20T12:05:00Z',
    },
    {
      id: 'sess-3',
      monitorProfileId: 'profile-author',
      academicPeriodId: 'period-2026-2',
      subjectId: 'sub-4',
      subjectName: 'Programación Web y Móvil',
      sessionDate: '2026-10-15',
      startTime: '16:00',
      endTime: '18:00',
      calculatedHours: 2.0,
      sessionType: 'Virtual',
      topic: 'Clean Architecture y Estado Global en React con Context API',
      recordingUrl: 'https://teams.microsoft.com/recordings/monitoria-web-clean-arch',
      observation: 'Sesión virtual grabada resolviendo dudas del proyecto final de la cátedra.',
      status: 'APROBADO',
      source: 'DIRECT',
      attendees: [
        { studentIdCard: '1090123456', studentName: 'Brayhan Alejandro Gómez Vega', careerProgram: 'Ingeniería de Sistemas' },
      ],
      createdAt: '2026-10-15T18:10:00Z',
    },
    {
      id: 'sess-4',
      monitorProfileId: 'profile-author',
      academicPeriodId: 'period-2026-2',
      subjectId: 'sub-1',
      subjectName: 'Algoritmos y Programación I',
      sessionDate: '2026-10-08',
      startTime: '08:00',
      endTime: '12:00',
      calculatedHours: 4.0,
      sessionType: 'Asesoría',
      topic: 'Estructuras de Control Repetitivas (While, For) y Arreglos Unidimensionales',
      observation: 'Asesoría individualizada previa al primer parcial con 5 estudiantes de primer semestre.',
      status: 'APROBADO',
      source: 'SIA_IMPORT',
      attendees: [
        { studentIdCard: '1090888999', studentName: 'Andrés Felipe Castro', careerProgram: 'Ingeniería de Sistemas' },
      ],
      createdAt: '2026-10-08T12:00:00Z',
    },
    {
      id: 'sess-5',
      monitorProfileId: 'profile-author',
      academicPeriodId: 'period-2026-2',
      subjectId: 'sub-2',
      subjectName: 'Bases de Datos I',
      sessionDate: '2026-09-28',
      startTime: '14:00',
      endTime: '18:00',
      calculatedHours: 4.0,
      sessionType: 'Taller',
      topic: 'Modelo Entidad-Relación y Conversión al Modelo Relacional',
      observation: 'Taller práctico intensivo previo a sustentación de proyectos.',
      status: 'APROBADO',
      source: 'SIA_IMPORT',
      attendees: [],
      createdAt: '2026-09-28T18:00:00Z',
    },
    {
      id: 'sess-6',
      monitorProfileId: 'profile-author',
      academicPeriodId: 'period-2026-2',
      subjectId: 'sub-3',
      subjectName: 'Estructuras de Datos',
      sessionDate: '2026-09-15',
      startTime: '14:00',
      endTime: '16:00',
      calculatedHours: 2.0,
      sessionType: 'Presencial',
      topic: 'Listas Enlazadas Simples y Dobles en C++',
      observation: 'Implementación de punteros y manejo de memoria dinámica.',
      status: 'APROBADO',
      source: 'SIA_IMPORT',
      attendees: [],
      createdAt: '2026-09-15T16:00:00Z',
    },
  ]);

  // Lista consolidada de los 20 monitores (tomada exactamente de la tabla del Caso de Negocio - Pág. 4)
  const [monitorsSummary, setMonitorsSummary] = useState<MonitorSummary[]>([
    {
      monitorProfileId: 'p-author',
      monitorName: 'Johan Sebastian Rojas Gómez',
      institutionalCode: 'MONITOR18',
      email: 'j_rojas20@unisimon.edu.co',
      targetHours: 54,
      accumulatedHours: 38.0,
      remainingHours: 16.0,
      progressPercentage: 70.3,
      totalStudentsAttended: 24,
      totalSessions: 6,
      status: 'ACTIVO',
    },
    {
      monitorProfileId: 'p-1',
      monitorName: 'Estudiante MONITOR1',
      institutionalCode: 'MONITOR1',
      email: 'monitor1@unisimon.edu.co',
      targetHours: 54,
      accumulatedHours: 36,
      remainingHours: 18,
      progressPercentage: 66.7,
      totalStudentsAttended: 17,
      totalSessions: 12,
      status: 'ACTIVO',
    },
    {
      monitorProfileId: 'p-14',
      monitorName: 'Estudiante MONITOR14',
      institutionalCode: 'MONITOR14',
      email: 'monitor14@unisimon.edu.co',
      targetHours: 54,
      accumulatedHours: 246,
      remainingHours: 0,
      progressPercentage: 100,
      totalStudentsAttended: 135,
      totalSessions: 64,
      status: 'CUMPLIDO',
    },
    {
      monitorProfileId: 'p-11',
      monitorName: 'Estudiante MONITOR11',
      institutionalCode: 'MONITOR11',
      email: 'monitor11@unisimon.edu.co',
      targetHours: 54,
      accumulatedHours: 99,
      remainingHours: 0,
      progressPercentage: 100,
      totalStudentsAttended: 38,
      totalSessions: 30,
      status: 'CUMPLIDO',
    },
    {
      monitorProfileId: 'p-20',
      monitorName: 'Estudiante MONITOR20',
      institutionalCode: 'MONITOR20',
      email: 'monitor20@unisimon.edu.co',
      targetHours: 54,
      accumulatedHours: 96,
      remainingHours: 0,
      progressPercentage: 100,
      totalStudentsAttended: 44,
      totalSessions: 28,
      status: 'CUMPLIDO',
    },
    {
      monitorProfileId: 'p-26',
      monitorName: 'Estudiante MONITOR26',
      institutionalCode: 'MONITOR26',
      email: 'monitor26@unisimon.edu.co',
      targetHours: 54,
      accumulatedHours: 85,
      remainingHours: 0,
      progressPercentage: 100,
      totalStudentsAttended: 27,
      totalSessions: 25,
      status: 'CUMPLIDO',
    },
    {
      monitorProfileId: 'p-27',
      monitorName: 'Estudiante MONITOR27',
      institutionalCode: 'MONITOR27',
      email: 'monitor27@unisimon.edu.co',
      targetHours: 54,
      accumulatedHours: 71,
      remainingHours: 0,
      progressPercentage: 100,
      totalStudentsAttended: 37,
      totalSessions: 22,
      status: 'CUMPLIDO',
    },
    {
      monitorProfileId: 'p-2',
      monitorName: 'Estudiante MONITOR2',
      institutionalCode: 'MONITOR2',
      email: 'monitor2@unisimon.edu.co',
      targetHours: 54,
      accumulatedHours: 40,
      remainingHours: 14,
      progressPercentage: 74.1,
      totalStudentsAttended: 8,
      totalSessions: 14,
      status: 'ACTIVO',
    },
    {
      monitorProfileId: 'p-21',
      monitorName: 'Estudiante MONITOR21',
      institutionalCode: 'MONITOR21',
      email: 'monitor21@unisimon.edu.co',
      targetHours: 54,
      accumulatedHours: 10,
      remainingHours: 44,
      progressPercentage: 18.5,
      totalStudentsAttended: 5,
      totalSessions: 4,
      status: 'ACTIVO',
    },
    {
      monitorProfileId: 'p-29',
      monitorName: 'Estudiante MONITOR29',
      institutionalCode: 'MONITOR29',
      email: 'monitor29@unisimon.edu.co',
      targetHours: 54,
      accumulatedHours: 10,
      remainingHours: 44,
      progressPercentage: 18.5,
      totalStudentsAttended: 3,
      totalSessions: 4,
      status: 'ACTIVO',
    },
    {
      monitorProfileId: 'p-10',
      monitorName: 'Estudiante MONITOR10',
      institutionalCode: 'MONITOR10',
      email: 'monitor10@unisimon.edu.co',
      targetHours: 54,
      accumulatedHours: 3,
      remainingHours: 51,
      progressPercentage: 5.6,
      totalStudentsAttended: 2,
      totalSessions: 1,
      status: 'ACTIVO',
    },
    {
      monitorProfileId: 'p-32',
      monitorName: 'Estudiante MONITOR32',
      institutionalCode: 'MONITOR32',
      email: 'monitor32@unisimon.edu.co',
      targetHours: 54,
      accumulatedHours: 2,
      remainingHours: 52,
      progressPercentage: 3.7,
      totalStudentsAttended: 1,
      totalSessions: 1,
      status: 'ACTIVO',
    },
  ]);

  // Cálculo de progreso del monitor logueado
  const totalApprovedHours = sessions
    .filter((s) => s.status === 'APROBADO')
    .reduce((acc, s) => acc + s.calculatedHours, 0);

  const totalPendingHours = sessions
    .filter((s) => s.status === 'PENDIENTE')
    .reduce((acc, s) => acc + s.calculatedHours, 0);

  const totalStudents = sessions.reduce((acc, s) => acc + (s.attendees?.length || 0), 0);
  const target = 54;
  const remaining = Math.max(0, target - totalApprovedHours);
  const percentage = Number(Math.min(100, (totalApprovedHours / target) * 100).toFixed(1));

  const monitorProgress: MonitorProgress = {
    targetHours: target,
    approvedHours: totalApprovedHours,
    pendingHours: totalPendingHours,
    totalAccumulatedHours: totalApprovedHours + totalPendingHours,
    remainingHours: remaining,
    progressPercentage: percentage,
    isCompleted: totalApprovedHours >= target,
    totalStudentsAttended: totalStudents,
    totalSessions: sessions.length,
    statusMessage:
      totalApprovedHours >= target
        ? '¡Has completado el requisito de 54 horas!'
        : `Llevas ${totalApprovedHours} horas de las 54 horas requeridas.`,
  };

  const handleSessionCreated = (newSession: MonitoringSession) => {
    setSessions([newSession, ...sessions]);
  };

  const handleImportComplete = (count: number) => {
    // Simular adición de sesiones importadas
    alert(`Se sincronizaron exitosamente ${count} sesiones históricas desde el archivo del SIA.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        userName={
          currentRole === 'MONITOR'
            ? 'Johan Sebastian Rojas Gómez'
            : 'Jover Alonso Cabrales (Director)'
        }
        userCode={currentRole === 'MONITOR' ? 'MONITOR18' : 'DOC-1001'}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {currentRole === 'MONITOR' ? (
          <>
            {/* Vista del Monitor: Tarjeta de Progreso 54h */}
            <ProgressCard progress={monitorProgress} />

            {/* Historial con Filtros */}
            <HistoryTable
              sessions={sessions}
              onOpenNewSessionModal={() => setIsNewSessionModalOpen(true)}
              onOpenImportModal={() => setIsImportModalOpen(true)}
            />
          </>
        ) : (
          /* Vista de Coordinación / Dirección: Matriz de 20 Monitores */
          <CoordinatorDashboard monitors={monitorsSummary} />
        )}
      </main>

      {/* Modales */}
      <NewSessionModal
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
        onSessionCreated={handleSessionCreated}
      />

      <ImportSiaModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Proyecto Final de Ingeniería de Sistemas — Universidad Simón Bolívar (Cúcuta) © 2026.
      </footer>
    </div>
  );
}
