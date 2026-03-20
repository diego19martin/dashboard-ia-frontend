import { LayoutDashboard, ArrowRightLeft, Map, GitBranch, Sparkles } from 'lucide-react';

const tabs = [
  { id: 'resumen', label: 'Resumen Ejecutivo', icon: LayoutDashboard },
  { id: 'impacto', label: 'Impacto: Antes vs Después', icon: ArrowRightLeft },
  { id: 'mapa', label: 'Mapa de Adopción', icon: Map },
  { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
  { id: 'resumen-ia', label: 'Resumen IA', icon: Sparkles },
];

export default function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <nav className="border-b border-slate-800/60 bg-[#0d1321]/50">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-brand-500 text-brand-400'
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
