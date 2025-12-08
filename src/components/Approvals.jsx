import React, { useState, useEffect } from 'react';
import { useSectors } from '../hooks/useSectors';
import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CheckCircle, XCircle, FileText, Eye, Filter } from 'lucide-react';

const Approvals = ({ user }) => {
  const { sectors } = useSectors();
  const [pendingResults, setPendingResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState('');
  const [notification, setNotification] = useState(null);
  const [filterSector, setFilterSector] = useState('');

  useEffect(() => {
    fetchPendingResults();
  }, [sectors]);

  const fetchPendingResults = async () => {
    setLoading(true);
    try {
      const results = [];

      for (const sector of sectors) {
        const goalsRef = collection(db, 'sectors', sector.id, 'goals');
        const goalsSnapshot = await getDocs(query(goalsRef));

        for (const goalDoc of goalsSnapshot.docs) {
          const resultsRef = collection(db, 'sectors', sector.id, 'goals', goalDoc.id, 'results');
          const resultsQuery = query(resultsRef, where('status', '==', 'submitted'));
          const resultsSnapshot = await getDocs(resultsQuery);

          resultsSnapshot.forEach(resultDoc => {
            results.push({
              id: resultDoc.id,
              sectorId: sector.id,
              goalId: goalDoc.id,
              sectorName: sector.name,
              goalName: goalDoc.data().name,
              goalTarget: goalDoc.data().targetValue,
              ...resultDoc.data()
            });
          });
        }
      }

      setPendingResults(results);
    } catch (error) {
      console.error('Erro ao carregar resultados pendentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApprove = async (result, approved) => {
    if (!approved && !comment.trim()) {
      showNotification('Por favor, informe o motivo da rejeição', 'error');
      return;
    }

    try {
      const resultRef = doc(db, 'sectors', result.sectorId, 'goals', result.goalId, 'results', result.id);
      
      const updateData = {
        status: approved ? 'approved' : 'rejected',
        approvedBy: user.uid,
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (!approved) {
        updateData.rejectionReason = comment;
      } else if (comment.trim()) {
        updateData.approvalComment = comment;
      }

      await updateDoc(resultRef, updateData);

      showNotification(approved ? 'Resultado aprovado!' : 'Resultado rejeitado!');
      setShowModal(false);
      setSelectedResult(null);
      setComment('');
      fetchPendingResults();
    } catch (error) {
      showNotification('Erro ao processar aprovação: ' + error.message, 'error');
    }
  };

  const openModal = (result) => {
    setSelectedResult(result);
    setComment('');
    setShowModal(true);
  };

  const filteredResults = filterSector 
    ? pendingResults.filter(r => r.sectorId === filterSector)
    : pendingResults;

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
        <h2 className="text-3xl font-bold text-gray-900">Aprovações Pendentes</h2>
        <p className="text-gray-600 mt-1">Analise e aprove os resultados enviados</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os setores</option>
            {sectors.map(sector => (
              <option key={sector.id} value={sector.id}>{sector.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Resultados Pendentes */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <CheckCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">Nenhuma aprovação pendente</p>
            <p className="text-gray-500 text-sm mt-2">Todos os resultados foram processados</p>
          </div>
        ) : (
          filteredResults.map(result => (
            <div key={result.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {result.sectorName}
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      Pendente
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{result.goalName}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Enviado em: {result.submittedAt?.toDate?.().toLocaleString() || 'Data não disponível'}
                  </p>
                </div>
                <button
                  onClick={() => openModal(result)}
                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Analisar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Meta Esperada</p>
                  <p className="text-lg font-bold text-gray-900">{result.goalTarget}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Valor Alcançado</p>
                  <p className="text-lg font-bold text-gray-900">{result.value}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Percentual</p>
                  <p className="text-lg font-bold text-green-600">{result.percentage}%</p>
                </div>
              </div>

              {result.comments && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-medium text-blue-900 mb-1">Comentários:</p>
                  <p className="text-sm text-blue-800">{result.comments}</p>
                </div>
              )}

              {result.evidenceFiles && result.evidenceFiles.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Evidências anexadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.evidenceFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedResult(result);
                    setComment('');
                    handleApprove(result, true);
                  }}
                  className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <CheckCircle className="w-5 h-5" />
                  Aprovar
                </button>
                <button
                  onClick={() => openModal(result)}
                  className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <XCircle className="w-5 h-5" />
                  Rejeitar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Detalhes/Rejeição */}
      {showModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4">
              <h3 className="text-xl font-bold text-gray-900">Detalhes do Resultado</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-medium text-blue-900">{selectedResult.goalName}</p>
                <p className="text-sm text-blue-700">{selectedResult.sectorName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Meta Esperada</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedResult.goalTarget}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valor Alcançado</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedResult.value}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Progresso</p>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(selectedResult.percentage, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">{selectedResult.percentage}%</p>
              </div>

              {selectedResult.comments && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Comentários do Colaborador</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-800">{selectedResult.comments}</p>
                  </div>
                </div>
              )}

              {selectedResult.evidenceFiles && selectedResult.evidenceFiles.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Evidências</p>
                  <div className="space-y-2">
                    {selectedResult.evidenceFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentário da Aprovação/Rejeição
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Adicione um comentário (obrigatório para rejeição)"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedResult(null);
                    setComment('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleApprove(selectedResult, false)}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Rejeitar
                </button>
                <button
                  onClick={() => handleApprove(selectedResult, true)}
                  className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Aprovar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;
