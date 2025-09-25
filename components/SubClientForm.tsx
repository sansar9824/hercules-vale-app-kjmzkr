
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SubClient } from '../types';

interface SubClientFormProps {
  onAddSubClient: (data: Omit<SubClient, 'id' | 'distributorId' | 'createdAt'>) => SubClient;
  onSubClientAdded: () => void;
}

export default function SubClientForm({ onAddSubClient, onSubClientAdded }: SubClientFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    dateOfBirth: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Por favor ingrese el nombre');
      return;
    }

    if (!formData.address.trim()) {
      Alert.alert('Error', 'Por favor ingrese la dirección');
      return;
    }

    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Por favor ingrese el teléfono');
      return;
    }

    if (!formData.dateOfBirth.trim()) {
      Alert.alert('Error', 'Por favor ingrese la fecha de nacimiento');
      return;
    }

    // Basic date validation (DD/MM/YYYY format)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(formData.dateOfBirth)) {
      Alert.alert('Error', 'Formato de fecha inválido. Use DD/MM/YYYY');
      return;
    }

    setIsLoading(true);

    try {
      const subClient = onAddSubClient(formData);
      
      // Reset form
      setFormData({
        name: '',
        address: '',
        phone: '',
        dateOfBirth: '',
      });
      
      Alert.alert(
        'Subcliente Agregado',
        `${subClient.name} ha sido registrado exitosamente`,
        [{ text: 'OK', onPress: onSubClientAdded }]
      );
      
    } catch (error) {
      console.log('Error adding subclient:', error);
      Alert.alert('Error', 'Error al agregar el subcliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={commonStyles.section}>
      <Text style={commonStyles.subtitle}>Agregar Subcliente</Text>
      
      <TextInput
        style={commonStyles.input}
        placeholder="Nombre completo"
        placeholderTextColor={colors.textLight}
        value={formData.name}
        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
        autoCapitalize="words"
      />
      
      <TextInput
        style={commonStyles.input}
        placeholder="Dirección"
        placeholderTextColor={colors.textLight}
        value={formData.address}
        onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
        autoCapitalize="words"
      />
      
      <TextInput
        style={commonStyles.input}
        placeholder="Número de teléfono"
        placeholderTextColor={colors.textLight}
        value={formData.phone}
        onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
        keyboardType="phone-pad"
      />
      
      <TextInput
        style={commonStyles.input}
        placeholder="Fecha de nacimiento (DD/MM/YYYY)"
        placeholderTextColor={colors.textLight}
        value={formData.dateOfBirth}
        onChangeText={(text) => setFormData(prev => ({ ...prev, dateOfBirth: text }))}
        keyboardType="numeric"
      />
      
      <TouchableOpacity
        style={[buttonStyles.primary, { opacity: isLoading ? 0.7 : 1 }]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={commonStyles.buttonText}>
          {isLoading ? 'Agregando...' : 'Agregar Subcliente'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
