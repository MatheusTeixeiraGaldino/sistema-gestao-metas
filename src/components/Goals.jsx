import React, { useState } from 'react';
import { useSectors } from '../hooks/useSectors';
import { useGoals } from '../hooks/useGoals';
import { Plus, Edit2, ArrowLeft, X, Target, Calendar, Weight, TrendingUp } from 'lucide-react';

const Goals = ({ user, sectorId, onBack }) => {
  const { sectors } = useSectors();
  const { goals, loading, addGoal, updateGoal, getTotalWeight } = useGoals(sectorId);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState(null);

  const sector = sectors.find(s => s.id === sectorId);
  const totalWeight = getTotalWeight();

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenModal = (goal = null) => {
    setFormData(goal || { 
      name: '', 
      description: '', 
      type: 'number', 
      weight: 0, 
      targetValue: '', 
      startDate: '', 
      endDate: '' 
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const goalData = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      weight: parseInt(formData.weight) || 0,
      targetValue: formData.targetValue,
      startDate: formData.startDate,
      endDate: formData.endDate
    };

    let result;
    if (formData.id) {
      result = await updateGoal(formData.id, goalData);
    } else {
      result = await addGoal({...goalData, createdBy: user.uid});
    }

    if (result.success) {
      showNotification(formData.id ? 'Meta atualizada!' : 'Meta criada!');
      handleCloseModal();
    } else {
      showNotification(result.error, 'error');
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      number: 'Número Inteiro',
      percentage: 'Percentual',
      date: 'Data'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      number: 'bg-blue-100 text-blue-800',
      percentage: 'bg-green-100 text-green-800',
      date: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Setores
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Metas - {sector?.name}</h2>
            <p className="text-gray-600 mt-1">{sector?.description}</p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Weight className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Peso total: <span className={`font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalWeight}%
                  </span>
                </span>
              </div>
              {totalWeight !== 100 && (
                <span className="text-sm text-red-600 font-medium">
                  (A soma deve ser 100%)
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nova Meta
          </button>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => (
          <div key={goal.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-lg text-gray-900">{goal.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </div>
                <button
                  onClick={() => handleOpenModal(goal)}
                  className="bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(goal.type)}`}>
                    {getTypeLabel(goal.type)}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Weight className="w-4 h-4" />
                    <span className="font-medium">{goal.weight}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Meta: <span className="font-medium">{goal.targetValue}</span></span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">Nenhuma meta cadastrada</p>
          <p className="text-gray-500 text-sm mt-2">Clique em "Nova Meta" para começar</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {formData.id ? 'Editar Meta' : 'Nova Meta'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Meta *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Aumentar vendas em 20%"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Descrição detalhada da meta"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    value={formData.type || 'number'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="number">Número Inteiro</option>
                    <option value="percentage">Percentual</option>
                    <option value="date">Data</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (%) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Esperada *
                </label>
                <input
                  type={formData.type === 'date' ? 'date' : 'number'}
                  value={formData.targetValue || ''}
                  onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={formData.type === 'percentage' ? '85' : '100000'}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Fim *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {formData.id ? 'Atualizar' : 'Criar Meta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
