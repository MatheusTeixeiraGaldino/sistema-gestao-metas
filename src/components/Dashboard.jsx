import React, { useState, useEffect } from 'react';
import { useSectors } from '../hooks/useSectors';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Users, Target, AlertCircle, Award, TrendingUp } from 'lucide-react';

const Dashboard = ({ user }) => {
  const { sectors, loading } = useSectors();
  const [stats, setStats] = useState({
    totalGoals: 0,
    pendingApprovals: 0,
    approvalRate: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let totalGoals = 0;
        let pendingApprovals = 0;
        let totalResults = 0;
        let approvedResults = 0;

        for (const sector of sectors) {
          const goalsRef = collection(db, 'sectors', sector.id, 'goals');
          const goalsSnapshot = await getDocs(query(goalsRef));
          totalGoals += goalsSnapshot.size;

          for (const goalDoc of goalsSnapshot.docs) {
            const resultsRef = collection(db, 'sectors', sector.id, 'goals', goalDoc.id, 'results');
            const resultsSnapshot = await getDocs(query(resultsRef));
            
            resultsSnapshot.forEach(resultDoc => {
              const data = resultDoc.data();
              totalResults++;
              if (data.status === 'submitted') pendingApprovals++;
              if (data.status === 'approved') approvedResults++;
            });
          }
        }

        setStats({
          totalGoals,
          pendingApprovals,
          approvalRate: totalResults > 0 ? Math.round((approvedResults / totalResults) * 100) : 0
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };

    if (sectors.length > 0) {
      fetchStats();
    }
  }, [sectors]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">
          Bem-vindo, <span className="font-medium">{user.email}</span>
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total de Setores</p>
              <p className="text-4xl font-bold mt-2">{sectors.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total de Metas</p>
              <p className="text-4xl font-bold mt-2">{stats.totalGoals}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Target className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pendentes</p>
              <p className="text-4xl font-bold mt-2">{stats.pendingApprovals}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <AlertCircle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Taxa de Aprovação</p>
              <p className="text-4xl font-bold mt-2">{stats.approvalRate}%</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Award className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Setores */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Setores Ativos
        </h3>
        <div className="space-y-3">
          {sectors.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhum setor cadastrado ainda
            </p>
          ) : (
            sectors.map(sector => (
              <div key={sector.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <h4 className="font-semibold text-gray-900">{sector.name}</h4>
                  <p className="text-sm text-gray-600">{sector.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {sector.managers?.length || 0} responsáveis
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
