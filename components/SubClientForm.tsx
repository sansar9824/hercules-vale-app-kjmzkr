
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
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

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as XXX-XXX-XXXX
    if (cleaned.length >= 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return cleaned;
  };

  const formatDateOfBirth = (date: string) => {
    // Remove all non-numeric characters
    const cleaned = date.replace(/\D/g, '');
    
    // Format as DD/MM/YYYY
    if (cleaned.length >= 8) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    } else if (cleaned.length >= 4) {
      return cleaned.replace(/(\d{2})(\d{2})/, '$1/$2/');
    } else if (cleaned.length >= 2) {
      return cleaned.replace(/(\d{2})/, '$1/');
    }
    return cleaned;
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Por favor ingrese el nombre del subcliente');
      return false;
    }

    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Por favor ingrese el número de teléfono');
      return false;
    }

    const phoneNumbers = formData.phone.replace(/\D/g, '');
    if (phoneNumbers.length < 10) {
      Alert.alert('Error', 'Por favor ingrese un número de teléfono válido (10 dígitos)');
      return false;
    }

    if (!formData.address.trim()) {
      Alert.alert('Error', 'Por favor ingrese la dirección');
      return false;
    }

    if (!formData.dateOfBirth.trim()) {
      Alert.alert('Error', 'Por favor ingrese la fecha de nacimiento');
      return false;
    }

    // Validate date format
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(formData.dateOfBirth)) {
      Alert.alert('Error', 'Por favor ingrese una fecha válida (DD/MM/YYYY)');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Convert date format from DD/MM/YYYY to ISO string
      const [day, month, year] = formData.dateOfBirth.split('/');
      const dateOfBirth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      const subClient = onAddSubClient({
        name: formData.name.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: dateOfBirth.toISOString(),
      });
      
      // Reset form
      setFormData({
        name: '',
        address: '',
        phone: '',
        dateOfBirth: '',
      });
      
      Alert.alert(
        'Subcliente Agregado',
        `${subClient.name} ha sido registrado exitosamente.`,
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
    <ScrollView style={commonStyles.section} showsVerticalScrollIndicator={false}>
      <Text style={[commonStyles.subtitle, { fontSize: 20, marginBottom: 24 }]}>
        Agregar Subcliente
      </Text>
      
      {/* Name Input */}
      <View style={{ marginBottom: 16 }}>
        <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>
          Nombre Completo *
        </Text>
        <TextInput
          style={[commonStyles.input, { fontSize: 16 }]}
          placeholder="Ej: Juan Pérez García"
          placeholderTextColor={colors.textLight}
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          autoCapitalize="words"
        />
      </View>
      
      {/* Phone Input */}
      <View style={{ marginBottom: 16 }}>
        <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>
          Número de Teléfono *
        </Text>
        <TextInput
          style={[commonStyles.input, { fontSize: 16 }]}
          placeholder="Ej: 555-123-4567"
          placeholderTextColor={colors.textLight}
          value={formData.phone}
          onChangeText={(text) => setFormData(prev => ({ 
            ...prev, 
            phone: formatPhoneNumber(text) 
          }))}
          keyboardType="phone-pad"
          maxLength={12} // XXX-XXX-XXXX
        />
      </View>
      
      {/* Address Input */}
      <View style={{ marginBottom: 16 }}>
        <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>
          Dirección *
        </Text>
        <TextInput
          style={[commonStyles.input, { fontSize: 16, minHeight: 60 }]}
          placeholder="Ej: Calle Principal #123, Colonia Centro"
          placeholderTextColor={colors.textLight}
          value={formData.address}
          onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
          multiline
          textAlignVertical="top"
        />
      </View>
      
      {/* Date of Birth Input */}
      <View style={{ marginBottom: 24 }}>
        <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>
          Fecha de Nacimiento *
        </Text>
        <TextInput
          style={[commonStyles.input, { fontSize: 16 }]}
          placeholder="DD/MM/YYYY"
          placeholderTextColor={colors.textLight}
          value={formData.dateOfBirth}
          onChangeText={(text) => setFormData(prev => ({ 
            ...prev, 
            dateOfBirth: formatDateOfBirth(text) 
          }))}
          keyboardType="numeric"
          maxLength={10} // DD/MM/YYYY
        />
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
          {isLoading ? 'Agregando...' : 'Agregar Subcliente'}
        </Text>
      </TouchableOpacity>
      
      {/* Information Card */}
      <View style={[commonStyles.card, { backgroundColor: colors.background, marginBottom: 20 }]}>
        <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
          📋 Información
        </Text>
        <Text style={[commonStyles.textLight, { fontSize: 13, lineHeight: 18 }]}>
          • Todos los campos marcados con * son obligatorios{'\n'}
          • El teléfono se usará para compartir vales por WhatsApp{'\n'}
          • La información se mantiene segura y privada{'\n'}
          • Puedes editar los datos posteriormente
        </Text>
      </View>
    </ScrollView>
  );
}
