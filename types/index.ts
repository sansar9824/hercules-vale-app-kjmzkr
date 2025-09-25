
export interface Distributor {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
}

export interface SubClient {
  id: string;
  distributorId: string;
  name: string;
  address: string;
  phone: string;
  dateOfBirth: string;
  createdAt: string;
}

export interface Voucher {
  id: string;
  folio: string;
  distributorId: string;
  subClientId: string;
  subClientName: string;
  amount: number;
  isUsed: boolean;
  createdAt: string;
  usedAt?: string;
  paymentStartDate?: string;
  paymentType: 'promotion' | 'cutoff';
  installments?: number;
}

export interface VoucherFormData {
  subClientName: string;
  amount: string;
}
