import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sectors from './components/Sectors';
import Goals from './components/Goals';
import Results from './components/Results';
import Approvals from './components/Approvals';
import { Menu, LogOut, LayoutDashboard, Building2, Target, ClipboardCheck, CheckSquare } from 'lucide-react';

function App() {
  const { user, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSector, setSelectedSector] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sectors', label: 'Setores', icon: Building2 },
    { id: 'results', label: 'Apontar Resultados', icon: ClipboardCheck },
    ...(user.role === 'admin' ? [{ id: 'approvals', label: 'Aprovações', icon: CheckSquare }] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && <h1 className="text-xl font-bold">Gestão de Metas</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-800 rounded">
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    currentView === item.id ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <div className={`mb-4 ${!sidebarOpen && 'hidden'}`}>
              <p className="text-sm text-gray-400">Usuário</p>
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-blue-400 capitalize">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Sair</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {currentView === 'dashboard' && <Dashboard user={user} />}
          {currentView === 'sectors' && (
            <Sectors
              user={user}
              onSelectSector={(sector) => {
                setSelectedSector(sector);
                setCurrentView('goals');
              }}
            />
          )}
          {currentView === 'goals' && (
            <Goals
              user={user}
              sectorId={selectedSector}
              onBack={() => setCurrentView('sectors')}
            />
          )}
          {currentView === 'results' && <Results user={user} />}
          {currentView === 'approvals' && user.role === 'admin' && <Approvals user={user} />}
        </div>
      </div>
    </div>
  );
}

export default App;
