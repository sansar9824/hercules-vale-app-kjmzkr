
import { Distributor } from '../types';

// Mock distributor data - in a real app this would come from a backend
export const mockDistributors: Distributor[] = [
  {
    id: '1',
    username: 'distribuidor001',
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '555-0001',
    isActive: true,
  },
  {
    id: '2',
    username: 'distribuidor002',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '555-0002',
    isActive: true,
  },
  // Add more mock distributors as needed
];

// Simple authentication check
export const authenticateDistributor = (username: string, password: string): Distributor | null => {
  const distributor = mockDistributors.find(d => d.username === username && d.isActive);
  // In a real app, you would verify the password properly
  if (distributor && password === '123456') {
    return distributor;
  }
  return null;
};
