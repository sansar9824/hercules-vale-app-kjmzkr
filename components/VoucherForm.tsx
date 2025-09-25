
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { VoucherFormData, Voucher } from '../types';

interface VoucherFormProps {
  onCreateVoucher: (data: VoucherFormData) => Voucher;
  onVoucherCreated: (voucher: Voucher) => void;
}

export default function VoucherForm({ onCreateVoucher, onVoucherCreated }: VoucherFormProps) {
  const [formData, setFormData] = useState<VoucherFormData>({
    subClientName: '',
    amount: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.subClientName.trim()) {
      Alert.alert('Error', 'Por favor ingrese el nombre del subcliente');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Por favor ingrese un monto válido');
      return;
    }

    if (amount > 5000) {
      Alert.alert('Error', 'El monto no puede exceder $5,000 pesos');
      return;
    }

    setIsLoading(true);

    try {
      const voucher = onCreateVoucher(formData);
      
      // Reset form
      setFormData({ subClientName: '', amount: '' });
      
      // Show success message with voucher details
      const paymentInfo = amount >= 3000 
        ? 'Promoción: 12 quincenas (inicia en 4 meses)'
        : 'Fecha de corte según calendario';
        
      Alert.alert(
        'Vale Creado Exitosamente',
        `Folio: ${voucher.folio}\nCliente: ${voucher.subClientName}\nMonto: $${voucher.amount.toLocaleString()}\nTipo: ${paymentInfo}`,
        [{ text: 'OK', onPress: () => onVoucherCreated(voucher) }]
      );
      
    } catch (error) {
      console.log('Error creating voucher:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al crear el vale');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={commonStyles.section}>
      <Text style={commonStyles.subtitle}>Crear Nuevo Vale</Text>
      
      <TextInput
        style={commonStyles.input}
        placeholder="Nombre del subcliente"
        placeholderTextColor={colors.textLight}
        value={formData.subClientName}
        onChangeText={(text) => setFormData(prev => ({ ...prev, subClientName: text }))}
        autoCapitalize="words"
      />
      
      <TextInput
        style={commonStyles.input}
        placeholder="Monto (máximo $5,000)"
        placeholderTextColor={colors.textLight}
        value={formData.amount}
        onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
        keyboardType="numeric"
      />
      
      <TouchableOpacity
        style={[buttonStyles.primary, { opacity: isLoading ? 0.7 : 1 }]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={commonStyles.buttonText}>
          {isLoading ? 'Creando vale...' : 'Crear Vale'}
        </Text>
      </TouchableOpacity>
      
      <View style={[commonStyles.card, { marginTop: 16, backgroundColor: colors.background }]}>
        <Text style={[commonStyles.textLight, { fontSize: 12 }]}>
          • Compras ≥ $3,000: 12 quincenas (inicia en 4 meses){'\n'}
          • Compras &lt; $3,000: Fecha de corte{'\n'}
          • Límite máximo: $5,000 pesos
        </Text>
      </View>
    </View>
  );
}
