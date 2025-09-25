
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { Voucher } from '../types';
import { shareVoucherWhatsApp } from '../utils/whatsappUtils';

interface VoucherCardProps {
  voucher: Voucher;
  onPress?: () => void;
  subClientPhone?: string;
}

export default function VoucherCard({ voucher, onPress, subClientPhone }: VoucherCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntilExpiry = () => {
    const now = new Date();
    const expiry = new Date(voucher.expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPaymentTypeText = () => {
    if (voucher.paymentType === 'promotion') {
      return `Promoción: ${voucher.installments} quincenas`;
    }
    return 'Fecha de corte';
  };

  const getStatusInfo = () => {
    if (voucher.isUsed) {
      return { text: 'Usado', color: colors.textLight, bgColor: colors.border };
    }
    
    if (voucher.isExpired) {
      return { text: 'Expirado', color: colors.error, bgColor: '#FEE2E2' };
    }

    const daysLeft = getDaysUntilExpiry();
    if (daysLeft <= 2) {
      return { text: `${daysLeft} días`, color: colors.warning, bgColor: '#FEF3C7' };
    }
    
    return { text: `${daysLeft} días`, color: colors.success, bgColor: '#D1FAE5' };
  };

  const handleWhatsAppShare = async () => {
    const success = await shareVoucherWhatsApp({
      folio: voucher.folio,
      subClientName: voucher.subClientName,
      amount: voucher.amount,
      expiryDate: voucher.expiresAt,
    }, subClientPhone);

    if (!success) {
      Alert.alert(
        'Error',
        'No se pudo abrir WhatsApp. Asegúrate de tener la aplicación instalada.'
      );
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <TouchableOpacity
      style={[
        commonStyles.card, 
        { 
          opacity: voucher.isUsed || voucher.isExpired ? 0.7 : 1,
          borderLeftWidth: 4,
          borderLeftColor: statusInfo.color,
        }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      {/* Header Row */}
      <View style={[commonStyles.row, { marginBottom: 12 }]}>
        <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 16 }]}>
          {voucher.folio}
        </Text>
        <View style={{
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          backgroundColor: statusInfo.bgColor,
        }}>
          <Text style={[commonStyles.textLight, { 
            color: statusInfo.color, 
            fontSize: 12, 
            fontWeight: '600' 
          }]}>
            {statusInfo.text}
          </Text>
        </View>
      </View>
      
      {/* Client Name */}
      <Text style={[commonStyles.text, { marginBottom: 8, fontSize: 16 }]}>
        👤 {voucher.subClientName}
      </Text>
      
      {/* Amount */}
      <Text style={[commonStyles.text, { 
        fontWeight: '700', 
        color: colors.secondary, 
        marginBottom: 8,
        fontSize: 18,
      }]}>
        💰 ${voucher.amount.toLocaleString()}
      </Text>
      
      {/* Payment Type */}
      <Text style={[commonStyles.textLight, { fontSize: 13, marginBottom: 6 }]}>
        📋 {getPaymentTypeText()}
      </Text>
      
      {/* Dates */}
      <Text style={[commonStyles.textLight, { fontSize: 12, marginBottom: 4 }]}>
        📅 Creado: {formatDate(voucher.createdAt)}
      </Text>
      
      <Text style={[commonStyles.textLight, { fontSize: 12, marginBottom: 12 }]}>
        ⏰ Expira: {formatDate(voucher.expiresAt)}
      </Text>
      
      {/* WhatsApp Share Button */}
      {!voucher.isUsed && !voucher.isExpired && (
        <TouchableOpacity
          style={{
            backgroundColor: '#25D366',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 6,
            alignItems: 'center',
            marginTop: 8,
          }}
          onPress={handleWhatsAppShare}
        >
          <Text style={[commonStyles.buttonText, { fontSize: 14 }]}>
            📱 Compartir por WhatsApp
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
