import React, { useState } from 'react';
import { useSectors } from '../hooks/useSectors';
import { Plus, Edit2, Trash2, Eye, X, Building2, Link as LinkIcon } from 'lucide-react';

const Sectors = ({ user, onSelectSector }) => {
  const { sectors, loading, addSector, updateSector, deleteSector } = useSectors();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenModal = (sector = null) => {
    setFormData(sector || { name: '', description: '', driveLink: '', managers: [] });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let result;
    if (formData.id) {
      result = await updateSector(formData.id, {
        name: formData.name,
        description: formData.description,
        driveLink: formData.driveLink,
        managers: formData.managers
      });
    } else {
      result = await addSector({
        name: formData.name,
        description: formData.description,
        driveLink: formData.driveLink,
        managers: formData.managers,
        createdBy: user.uid
      });
    }

    if (result.success) {
      showNotification(formData.id ? 'Setor atualizado!' : 'Setor criado!');
      handleCloseModal();
    } else {
      showNotification(result.error, 'error');
    }
  };

  const handleDelete = async (sectorId) => {
    if (!confirm('Tem certeza que deseja deletar este setor?')) return;
    
    const result = await deleteSector(sectorId);
    if (result.success) {
      showNotification('Setor deletado!');
    } else {
      showNotification(result.error, 'error');
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Setores</h2>
          <p className="text-gray-600 mt-1">Gerencie os setores da organização</p>
        </div>
        {user.role === 'admin' && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Novo Setor
          </button>
        )}
      </div>

      {/* Sectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectors.map(sector => (
          <div key={sector.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{sector.name}</h3>
                    <p className="text-sm text-gray-600">{sector.description}</p>
                  </div>
                </div>
              </div>

              {sector.driveLink && (
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                  <LinkIcon className="w-4 h-4" />
                  <a href={sector.driveLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 truncate">
                    Link do Drive
                  </a>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onSelectSector(sector.id)}
                  className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Ver Metas
                </button>
                {user.role === 'admin' && (
                  <>
                    <button
                      onClick={() => handleOpenModal(sector)}
                      className="bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sector.id)}
                      className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {sectors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">Nenhum setor cadastrado</p>
          <p className="text-gray-500 text-sm mt-2">Clique em "Novo Setor" para começar</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {formData.id ? 'Editar Setor' : 'Novo Setor'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Setor *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Vendas"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Descrição do setor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link do Google Drive (Evidências)
                </label>
                <input
                  type="url"
                  value={formData.driveLink || ''}
                  onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link da pasta onde serão salvas as evidências das metas
                </p>
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
                  {formData.id ? 'Atualizar' : 'Criar Setor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sectors;
