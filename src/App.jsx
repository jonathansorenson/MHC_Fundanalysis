import { useState, useCallback } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import FundOverview from './components/FundOverview';
import ConsolidatedView from './components/ConsolidatedView';
import OccupancyChart from './components/OccupancyChart';
import YOYGrowthTable from './components/YOYGrowthTable';
import PropertyDetail from './components/PropertyDetail';
import DataUpload from './components/DataUpload';
import AdminPanel from './components/AdminPanel';
import AskAIPanel from './components/AskAIPanel';
import FundAnalytics from './components/FundAnalytics';
import { fund1, fund2, sidecars } from './data/fundData';

/* ─── Tab definitions ─── */
function buildTabs(role) {
  const tabs = [
    { key: 'consolidated', label: 'Consolidated' },
    { key: 'fund1', label: 'Fund I' },
    { key: 'fund2', label: 'Fund II' },
    { key: 'sidecars', label: 'Sidecars' },
    { key: 'analytics', label: 'Fund Analytics' },
    { key: 'occupancy', label: 'Occupancy' },
    { key: 'yoy', label: 'YoY Growth' },
  ];
  if (role === 'owner' || role === 'admin') {
    tabs.push({ key: 'data', label: 'Data Upload' });
  }
  if (role === 'admin') {
    tabs.push({ key: 'admin', label: 'Admin' });
  }
  return tabs;
}
export default function App() {
  const { session, user, role, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('consolidated');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);

  const onSelectProperty = useCallback((prop) => {
    setSelectedProperty(prop);
  }, []);

  const onBackFromProperty = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-mhc-navy flex items-center justify-center">
        <div className="text-mhc-accent animate-pulse text-lg">Loading…</div>
      </div>
    );
  }

  // Auth gate
  if (!session) {
    return <LoginPage />;
  }

  const tabs = buildTabs(role);
  // Property detail drill-down
  if (selectedProperty) {
    return (
      <div className="min-h-screen bg-mhc-navy">
        <Header user={user} role={role} logout={logout} aiOpen={aiOpen} setAiOpen={setAiOpen} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <PropertyDetail property={selectedProperty} onBack={onBackFromProperty} />
        </main>
        <AskAIPanel open={aiOpen} onClose={() => setAiOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mhc-navy">
      <Header user={user} role={role} logout={logout} aiOpen={aiOpen} setAiOpen={setAiOpen} />

      {/* Tab bar */}
      <div className="border-b border-mhc-border bg-mhc-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto py-1 -mb-px">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-lg transition ${
                  activeTab === t.key
                    ? 'text-mhc-accent border-b-2 border-mhc-accent bg-mhc-navy/50'
                    : 'text-mhc-muted hover:text-white hover:bg-mhc-navy/30'
                }`}
              >                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'consolidated' && <ConsolidatedView />}
        {activeTab === 'fund1' && <FundOverview fund={fund1} onSelectProperty={onSelectProperty} />}
        {activeTab === 'fund2' && <FundOverview fund={fund2} onSelectProperty={onSelectProperty} />}
        {activeTab === 'sidecars' && <SidecarsView sidecars={sidecars} />}
        {activeTab === 'analytics' && <FundAnalytics />}
        {activeTab === 'occupancy' && <OccupancyChart />}
        {activeTab === 'yoy' && <YOYGrowthTable />}
        {activeTab === 'data' && <DataUpload />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      <AskAIPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}

/* ─── Header ─── */
function Header({ user, role, logout, aiOpen, setAiOpen }) {
  return (
    <header className="bg-mhc-card border-b border-mhc-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">        <div className="flex items-center gap-3">
          <img src="/naiMHC-logo.svg" alt="NAI Merin Hunter Codman" className="h-8" />
          <div className="border-l border-mhc-border pl-3">
            <h1 className="text-white font-bold text-sm leading-tight">Fund Dashboard</h1>
            <span className="text-mhc-muted text-xs">Portfolio Analytics</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="bg-mhc-navy border border-mhc-border hover:border-mhc-accent/40 text-mhc-muted hover:text-white px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5"
          >
            <span>🤖</span> Ask AI
          </button>
          <div className="text-right text-xs">
            <span className="text-mhc-muted block">{user?.email}</span>
            <span className="text-mhc-accent capitalize">{role}</span>
          </div>
          <button
            onClick={logout}
            className="text-mhc-muted hover:text-white text-xs transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
/* ─── Sidecars View ─── */
function SidecarsView({ sidecars }) {
  const properties = Object.values(sidecars.properties);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">{sidecars.name}</h2>
        <p className="text-mhc-muted text-sm">Co-investment properties outside the main fund vehicles</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {properties.map(p => (
          <div key={p.id} className="bg-mhc-card border border-mhc-border rounded-xl p-5">
            <h3 className="text-white font-semibold text-sm mb-2">{p.name}</h3>
            <p className="text-mhc-muted text-xs mb-1">{p.address}</p>
            <div className="flex gap-4 text-xs mt-3">
              <div>
                <span className="text-mhc-muted block">Type</span>
                <span className="text-white">{p.assetClass}</span>
              </div>
              <div>
                <span className="text-mhc-muted block">Size</span>
                <span className="text-white">{p.sf > 0 ? `${p.sf.toLocaleString()} SF` : 'N/A'}</span>
              </div>
              <div>
                <span className="text-mhc-muted block">Status</span>
                <span className="text-mhc-gold">{p.quarterly.length > 0 ? 'Active' : 'Pending Data'}</span>
              </div>
            </div>
          </div>
        ))}      </div>

      <div className="bg-mhc-card border border-mhc-border rounded-xl p-5 text-mhc-muted text-xs">
        <p>Sidecar financial data will populate as quarterly reports are uploaded via the Data Upload tab. Occupancy tracking for these properties is available in the Occupancy tab.</p>
      </div>
    </div>
  );
}