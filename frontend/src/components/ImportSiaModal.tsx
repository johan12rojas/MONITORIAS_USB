'use client';

import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

interface ImportSiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (count: number) => void;
}

export const ImportSiaModal: React.FC<ImportSiaModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ imported: number; duplicates: number } | null>(null);

  if (!isOpen) return null;

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setResult({ imported: 8, duplicates: 2 });
      onImportComplete(8);
    }, 1200);
  };

  const handleReset = () => {
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Importar Archivo SIA (Excel/CSV)</h3>
            <p className="text-xs text-slate-500">
              Carga masiva de sesiones registradas en el portal institucional con validación anti-duplicados.
            </p>
          </div>
          <button onClick={handleReset} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          <div className="mt-4 space-y-4">
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
              <UploadCloud className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800">
                Arrastra tu archivo Excel o haz clic para seleccionarlo
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Formatos compatibles: .xlsx, .xls, .csv exportados del SIA
              </p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                id="file-upload"
                onChange={handleSimulateUpload}
              />
              <label
                htmlFor="file-upload"
                className="mt-4 inline-block px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-sm transition"
              >
                {isProcessing ? 'Procesando archivo...' : 'Seleccionar Archivo'}
              </label>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">Columnas validadas automáticamente:</p>
              <p className="font-mono text-[11px] text-slate-500">
                Fecha Inicio | Hora Inicio | Hora Fin | Tipo | Asignatura | Tema | Observación
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">¡Importación Exitosa!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Se parsearon los registros históricos del SIA y se actualizaron las horas acumuladas.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <span className="text-[11px] text-emerald-700 font-medium">Nuevas sesiones añadidas</span>
                <p className="text-xl font-bold text-emerald-900 font-mono">+{result.imported}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Duplicadas omitidas (Hash)</span>
                <p className="text-xl font-bold text-slate-700 font-mono">{result.duplicates}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              Cerrar y Ver Historial Actualizado
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
