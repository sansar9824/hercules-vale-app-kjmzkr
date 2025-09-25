
import { useState } from 'react';
import { Voucher, VoucherFormData } from '../types';

export const useVouchers = (distributorId: string) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  const generateFolio = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const folioNumber = (timestamp + random).toString().slice(-7).padStart(7, '0');
    return `HV${folioNumber}`;
  };

  const calculatePaymentDetails = (amount: number) => {
    const now = new Date();
    
    if (amount >= 3000) {
      // Promotion: 12 installments starting 4 months later
      const paymentStart = new Date(now);
      paymentStart.setMonth(paymentStart.getMonth() + 4);
      return {
        paymentType: 'promotion' as const,
        paymentStartDate: paymentStart.toISOString(),
        installments: 12,
      };
    } else {
      // Cutoff date payment
      const day = now.getDate();
      const paymentDate = new Date(now);
      
      if (day >= 21 || day <= 6) {
        // Pay on 15th
        paymentDate.setDate(15);
        if (day >= 21) {
          paymentDate.setMonth(paymentDate.getMonth() + 1);
        }
      } else {
        // Pay on 30th
        paymentDate.setDate(30);
      }
      
      return {
        paymentType: 'cutoff' as const,
        paymentStartDate: paymentDate.toISOString(),
        installments: 1,
      };
    }
  };

  const createVoucher = (formData: VoucherFormData): Voucher => {
    const amount = parseFloat(formData.amount);
    
    if (amount > 5000) {
      throw new Error('El monto no puede exceder $5,000 pesos');
    }

    const paymentDetails = calculatePaymentDetails(amount);
    
    const voucher: Voucher = {
      id: Date.now().toString(),
      folio: generateFolio(),
      distributorId,
      subClientId: '', // Would be set if selecting existing subclient
      subClientName: formData.subClientName,
      amount,
      isUsed: false,
      createdAt: new Date().toISOString(),
      ...paymentDetails,
    };

    setVouchers(prev => [voucher, ...prev]);
    console.log('Voucher created:', voucher);
    return voucher;
  };

  const getVouchersByDistributor = () => {
    return vouchers.filter(v => v.distributorId === distributorId);
  };

  return {
    vouchers: getVouchersByDistributor(),
    createVoucher,
  };
};
