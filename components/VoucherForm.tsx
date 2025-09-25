
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { VoucherFormData, Voucher, SubClient } from '../types';
import { shareVoucherWhatsApp } from '../utils/whatsappUtils';

interface VoucherFormProps {
  onCreateVoucher: (data: VoucherFormData) => Voucher;
  onVoucherCreated: (voucher: Voucher) => void;
  subClients: SubClient[];
}

export default function VoucherForm({ onCreateVoucher, onVoucherCreated, subClients }: VoucherFormProps) {
  const [formData, setFormData] = useState<VoucherFormData>({
    subClientId: '',
    subClientName: '',
    amount: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showClientSelector, setShowClientSelector] = useState(false);

  const handleClientSelect = (client: SubClient) => {
    setFormData(prev => ({
      ...prev,
      subClientId: client.id,
      subClientName: client.name,
    }));
    setShowClientSelector(false);
  };

  const handleSubmit = async () => {
    if (!formData.subClientName.trim()) {
      Alert.alert('Error', 'Por favor seleccione o ingrese el nombre del subcliente');
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
      setFormData({ subClientId: '', subClientName: '', amount: '' });
      
      // Show success message with sharing options
      const paymentInfo = amount >= 3000 
        ? 'Promoción: 12 quincenas (inicia en 4 meses)'
        : 'Fecha de corte según calendario';
        
      Alert.alert(
        'Vale Creado Exitosamente',
        `Folio: ${voucher.folio}\nCliente: ${voucher.subClientName}\nMonto: $${voucher.amount.toLocaleString()}\nTipo: ${paymentInfo}\nVigencia: 10 días`,
        [
          {
            text: 'Compartir por WhatsApp',
            onPress: () => handleWhatsAppShare(voucher),
          },
          {
            text: 'Cerrar',
            onPress: () => onVoucherCreated(voucher),
            style: 'cancel',
          },
        ]
      );
      
    } catch (error) {
      console.log('Error creating voucher:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al crear el vale');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppShare = async (voucher: Voucher) => {
    const selectedClient = subClients.find(c => c.id === voucher.subClientId);
    const phoneNumber = selectedClient?.phone;

    const success = await shareVoucherWhatsApp({
      folio: voucher.folio,
      subClientName: voucher.subClientName,
      amount: voucher.amount,
      expiryDate: voucher.expiresAt,
    }, phoneNumber);

    if (success) {
      onVoucherCreated(voucher);
    } else {
      Alert.alert(
        'Error',
        'No se pudo abrir WhatsApp. Asegúrate de tener la aplicación instalada.',
        [{ text: 'OK', onPress: () => onVoucherCreated(voucher) }]
      );
    }
  };

  return (
    <ScrollView style={commonStyles.section} showsVerticalScrollIndicator={false}>
      <Text style={[commonStyles.subtitle, { fontSize: 20, marginBottom: 24 }]}>
        Crear Nuevo Vale
      </Text>
      
      {/* Client Selection */}
      <View style={{ marginBottom: 20 }}>
        <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>
          Subcliente
        </Text>
        
        {subClients.length > 0 && (
          <TouchableOpacity
            style={[commonStyles.input, { 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingVertical: 16,
            }]}
            onPress={() => setShowClientSelector(!showClientSelector)}
          >
            <Text style={{ 
              color: formData.subClientName ? colors.text : colors.textLight,
              fontSize: 16,
            }}>
              {formData.subClientName || 'Seleccionar cliente existente'}
            </Text>
            <Text style={{ color: colors.textLight, fontSize: 18 }}>
              {showClientSelector ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
        )}

        {showClientSelector && (
          <View style={[commonStyles.card, { marginTop: 8, maxHeight: 200 }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {subClients.map((client) => (
                <TouchableOpacity
                  key={client.id}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                  onPress={() => handleClientSelect(client)}
                >
                  <Text style={[commonStyles.text, { fontWeight: '500' }]}>
                    {client.name}
                  </Text>
                  <Text style={[commonStyles.textLight, { fontSize: 12 }]}>
                    {client.phone}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <Text style={[commonStyles.textLight, { fontSize: 12, marginTop: 8, textAlign: 'center' }]}>
          O ingresa un nuevo cliente
        </Text>
        
        <TextInput
          style={[commonStyles.input, { marginTop: 8 }]}
          placeholder="Nombre del nuevo subcliente"
          placeholderTextColor={colors.textLight}
          value={formData.subClientName}
          onChangeText={(text) => setFormData(prev => ({ 
            ...prev, 
            subClientName: text,
            subClientId: '', // Clear selected client when typing
          }))}
          autoCapitalize="words"
        />
      </div>
      
      {/* Amount Input */}
      <View style={{ marginBottom: 24 }}>
        <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>
          Monto del Vale
        </Text>
        <TextInput
          style={[commonStyles.input, { fontSize: 18, textAlign: 'center' }]}
          placeholder="$0.00"
          placeholderTextColor={colors.textLight}
          value={formData.amount}
          onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
          keyboardType="numeric"
        />
        <Text style={[commonStyles.textLight, { fontSize: 12, textAlign: 'center' }]}>
          Máximo: $5,000 pesos
        </Text>
      </View>
      
      {/* Submit Button */}
      <TouchableOpacity
        style={[buttonStyles.primary, { 
          opacity: isLoading ? 0.7 : 1,
          paddingVertical: 16,
          marginBottom: 20,
        }]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={[commonStyles.buttonText, { fontSize: 18 }]}>
          {isLoading ? 'Creando vale...' : 'Crear Vale'}
        </Text>
      </TouchableOpacity>
      
      {/* Information Card */}
      <View style={[commonStyles.card, { backgroundColor: colors.background, marginBottom: 20 }]}>
        <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
          📋 Información Importante
        </Text>
        <Text style={[commonStyles.textLight, { fontSize: 13, lineHeight: 18 }]}>
          • Compras ≥ $3,000: 12 quincenas (inicia en 4 meses){'\n'}
          • Compras &lt; $3,000: Fecha de corte{'\n'}
          • Límite máximo: $5,000 pesos{'\n'}
          • Vigencia: 10 días desde la emisión{'\n'}
          • Se compartirá automáticamente por WhatsApp
        </Text>
      </View>
    </ScrollView>
  );
}
