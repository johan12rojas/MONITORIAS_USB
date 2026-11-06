import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Seguimiento de Monitorías Académicas | Universidad Simón Bolívar',
  description: 'Plataforma para la gestión, seguimiento y consulta de horas de monitorías académicas USB (Meta 54 horas)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
