
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { Voucher } from '../types';

interface VoucherCardProps {
  voucher: Voucher;
  onPress?: () => void;
}

export default function VoucherCard({ voucher, onPress }: VoucherCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPaymentTypeText = () => {
    if (voucher.paymentType === 'promotion') {
      return `Promoción: ${voucher.installments} quincenas`;
    }
    return 'Fecha de corte';
  };

  const getStatusColor = () => {
    return voucher.isUsed ? colors.textLight : colors.success;
  };

  return (
    <TouchableOpacity
      style={[commonStyles.card, { opacity: voucher.isUsed ? 0.7 : 1 }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[commonStyles.row, { marginBottom: 8 }]}>
        <Text style={[commonStyles.text, { fontWeight: '600' }]}>
          {voucher.folio}
        </Text>
        <Text style={[commonStyles.textLight, { color: getStatusColor() }]}>
          {voucher.isUsed ? 'Usado' : 'Activo'}
        </Text>
      </View>
      
      <Text style={[commonStyles.text, { marginBottom: 4 }]}>
        {voucher.subClientName}
      </Text>
      
      <Text style={[commonStyles.text, { fontWeight: '600', color: colors.secondary, marginBottom: 4 }]}>
        ${voucher.amount.toLocaleString()}
      </Text>
      
      <Text style={[commonStyles.textLight, { fontSize: 12, marginBottom: 4 }]}>
        {getPaymentTypeText()}
      </Text>
      
      <Text style={[commonStyles.textLight, { fontSize: 12 }]}>
        Creado: {formatDate(voucher.createdAt)}
      </Text>
      
      {voucher.paymentStartDate && (
        <Text style={[commonStyles.textLight, { fontSize: 12 }]}>
          Pago inicia: {formatDate(voucher.paymentStartDate)}
        </Text>
      )}
    </TouchableOpacity>
  );
}
