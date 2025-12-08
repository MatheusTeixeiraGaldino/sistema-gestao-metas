import React, { useState, useEffect } from 'react';
import { useSectors } from '../hooks/useSectors';
import { collection, getDocs, query } from 'firebase/firestore';
import { useResults } from '../hooks/useResults';
import { db } from '../config/firebase';
import { Upload, X, FileText, Save, Send, Link as LinkIcon } from 'lucide-react';

const Results = ({ user }) => {
  const { sectors } = useSectors();
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    value: '',
    comments: '',
    status: 'draft'
  });
  const [files, setFiles] = useState([]);
  const [notification, setNotification] = useState(null);
  const [driveLink, setDriveLink] = useState('');

  const { addResult } = useResults(selectedSector, selectedGoal);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!selectedSector) {
        setGoals([]);
        return;
      }

      try {
        const goalsRef = collection(db, 'sectors', selectedSector, 'goals');
        const snapshot = await getDocs(query(goalsRef));
        const goalsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGoals(goalsData);

        // Buscar link do Drive do setor
        const sector = sectors.find(s => s.id === selectedSector);
        setDriveLink(sector?.driveLink || '');
      } catch (error) {
        console.error('Erro ao carregar metas:', error);
      }
    };

    fetchGoals();
  }, [selectedSector, sectors]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e, status) => {
    e.preventDefault();

    if (!selectedGoal) {
      showNotification('Selecione uma meta', 'error');
      return;
    }

    const goal = goals.find(g => g.id === selectedGoal);
    const targetValue = parseFloat(goal.targetValue) || 1;
    const achievedValue = parseFloat(formData.value) || 0;
    const percentage = Math.round((achievedValue / targetValue) * 100);

    const resultData = {
      value: achievedValue,
      percentage,
      comments: formData.comments,
      status,
      submittedBy: user.uid,
      submittedAt: new Date()
    };

    const result = await addResult(resultData, files);

    if (result.success) {
      showNotification(status === 'submitted' ? 'Resultado enviado para aprovação!' : 'Rascunho salvo!');
      setShowModal(false);
      setFormData({ value: '', comments: '', status: 'draft' });
      setFiles([]);
    } else {
      showNotification(result.error, 'error');
    }
  };

  const sector = sectors.find(s => s.id === selectedSector);
  const goal = goals.find(g => g.id === selectedGoal);

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
        <h2 className="text-3xl font-bold text-gray-900">Apontar Resultados</h2>
        <p className="text-gray-600 mt-1">Registre os resultados das metas</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Setor
            </label>
            <select
              value={selectedSector}
              onChange={(e) => {
                setSelectedSector(e.target.value);
                setSelectedGoal('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Escolha um setor...</option>
              {sectors.map(sector => (
                <option key={sector.id} value={sector.id}>{sector.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione a Meta
            </label>
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={!selectedSector}
            >
              <option value="">Escolha uma meta...</option>
              {goals.map(goal => (
                <option key={goal.id} value={goal.id}>{goal.name}</option>
              ))}
            </select>
          </div>
        </div>

        {driveLink && (
          <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
            <LinkIcon className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Link do Google Drive para Evidências</p>
              <a href={driveLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 underline">
                Acessar pasta do Drive
              </a>
            </div>
          </div>
        )}

        {selectedGoal && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Upload className="w-5 h-5" />
            Registrar Novo Resultado
          </button>
        )}
      </div>

      {/* Informações da Meta Selecionada */}
      {goal && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Meta Selecionada</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Nome:</span> {goal.name}</p>
            <p><span className="font-medium">Descrição:</span> {goal.description}</p>
            <p><span className="font-medium">Tipo:</span> {goal.type}</p>
            <p><span className="font-medium">Meta Esperada:</span> {goal.targetValue}</p>
            <p><span className="font-medium">Peso:</span> {goal.weight}%</p>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Registrar Resultado</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-medium text-blue-900">{goal.name}</p>
                <p className="text-sm text-blue-700">Meta: {goal.targetValue}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Alcançado *
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o valor alcançado"
                  required
                />
                {formData.value && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">
                      Progresso: {Math.round((parseFloat(formData.value) / parseFloat(goal.targetValue)) * 100)}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((parseFloat(formData.value) / parseFloat(goal.targetValue)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidências (Arquivos)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Clique para selecionar arquivos</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, Excel, Word, Imagens (máx 10MB cada)</p>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(2)} KB)</span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentários / Observações
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Adicione observações sobre o resultado"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={(e) => handleSubmit(e, 'draft')}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar como Rascunho
                </button>
                <button
                  onClick={(e) => handleSubmit(e, 'submitted')}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Enviar para Aprovação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
