import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export const useResults = (sectorId, goalId) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sectorId || !goalId) {
      setResults([]);
      setLoading(false);
      return;
    }

    const resultsRef = collection(db, 'sectors', sectorId, 'goals', goalId, 'results');
    const q = query(resultsRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const resultsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setResults(resultsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [sectorId, goalId]);

  const uploadEvidence = async (file, resultId) => {
    try {
      const storageRef = ref(storage, `results/${sectorId}/${goalId}/${resultId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return { success: true, url, name: file.name, size: file.size };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const addResult = async (resultData, files = []) => {
    try {
      const resultsRef = collection(db, 'sectors', sectorId, 'goals', goalId, 'results');
      
      // Criar o resultado primeiro
      const docRef = await addDoc(resultsRef, {
        ...resultData,
        evidenceFiles: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Upload de evidências se houver arquivos
      if (files.length > 0) {
        const uploadPromises = files.map(file => uploadEvidence(file, docRef.id));
        const uploads = await Promise.all(uploadPromises);
        
        const evidenceFiles = uploads
          .filter(u => u.success)
          .map(u => ({ name: u.name, url: u.url, size: u.size }));

        // Atualizar com as evidências
        await updateDoc(doc(db, 'sectors', sectorId, 'goals', goalId, 'results', docRef.id), {
          evidenceFiles,
          updatedAt: serverTimestamp()
        });
      }

      return { success: true, id: docRef.id };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateResult = async (resultId, resultData) => {
    try {
      await updateDoc(doc(db, 'sectors', sectorId, 'goals', goalId, 'results', resultId), {
        ...resultData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const approveResult = async (resultId, approved, comment = '', approvedBy) => {
    try {
      const updateData = {
        status: approved ? 'approved' : 'rejected',
        approvedBy,
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (!approved && comment) {
        updateData.rejectionReason = comment;
      } else if (approved && comment) {
        updateData.approvalComment = comment;
      }

      await updateDoc(doc(db, 'sectors', sectorId, 'goals', goalId, 'results', resultId), updateData);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    results,
    loading,
    error,
    addResult,
    updateResult,
    approveResult,
    uploadEvidence
  };
};
