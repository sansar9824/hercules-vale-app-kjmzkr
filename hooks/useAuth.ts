
import { useState, useEffect } from 'react';
import { Distributor } from '../types';

export const useAuth = () => {
  const [currentDistributor, setCurrentDistributor] = useState<Distributor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (in a real app, check AsyncStorage)
    setIsLoading(false);
  }, []);

  const login = (distributor: Distributor) => {
    setCurrentDistributor(distributor);
    console.log('Distributor logged in:', distributor.name);
  };

  const logout = () => {
    setCurrentDistributor(null);
    console.log('Distributor logged out');
  };

  return {
    currentDistributor,
    isLoading,
    login,
    logout,
    isAuthenticated: !!currentDistributor,
  };
};
