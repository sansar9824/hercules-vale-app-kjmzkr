
import { useState } from 'react';
import { SubClient } from '../types';

export const useSubClients = (distributorId: string) => {
  const [subClients, setSubClients] = useState<SubClient[]>([]);

  const addSubClient = (data: Omit<SubClient, 'id' | 'distributorId' | 'createdAt'>) => {
    const newSubClient: SubClient = {
      id: Date.now().toString(),
      distributorId,
      createdAt: new Date().toISOString(),
      ...data,
    };

    setSubClients(prev => [newSubClient, ...prev]);
    console.log('SubClient added:', newSubClient);
    return newSubClient;
  };

  const getSubClientsByDistributor = () => {
    return subClients.filter(sc => sc.distributorId === distributorId);
  };

  const updateSubClient = (id: string, updates: Partial<SubClient>) => {
    setSubClients(prev => 
      prev.map(sc => sc.id === id ? { ...sc, ...updates } : sc)
    );
  };

  const deleteSubClient = (id: string) => {
    setSubClients(prev => prev.filter(sc => sc.id !== id));
    console.log('SubClient deleted:', id);
  };

  return {
    subClients: getSubClientsByDistributor(),
    addSubClient,
    updateSubClient,
    deleteSubClient,
  };
};
