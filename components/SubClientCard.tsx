
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { SubClient } from '../types';

interface SubClientCardProps {
  subClient: SubClient;
  onPress?: () => void;
}

export default function SubClientCard({ subClient, onPress }: SubClientCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatPhone = (phone: string) => {
    // Format phone number for display
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  return (
    <TouchableOpacity
      style={[commonStyles.card, { 
        borderLeftWidth: 4,
        borderLeftColor: colors.secondary,
      }]}
      onPress={onPress}
      disabled={!onPress}
    >
      {/* Header */}
      <View style={[commonStyles.row, { marginBottom: 12 }]}>
        <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 18 }]}>
          👤 {subClient.name}
        </Text>
        <View style={{
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          backgroundColor: colors.secondary + '20',
        }}>
          <Text style={[commonStyles.textLight, { 
            color: colors.secondary, 
            fontSize: 12, 
            fontWeight: '600' 
          }]}>
            {calculateAge(subClient.dateOfBirth)} años
          </Text>
        </View>
      </View>
      
      {/* Contact Info */}
      <View style={{ marginBottom: 8 }}>
        <Text style={[commonStyles.text, { marginBottom: 4 }]}>
          📞 {formatPhone(subClient.phone)}
        </Text>
        <Text style={[commonStyles.textLight, { fontSize: 14, lineHeight: 18 }]}>
          🏠 {subClient.address}
        </Text>
      </View>
      
      {/* Dates */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}>
        <Text style={[commonStyles.textLight, { fontSize: 12 }]}>
          🎂 Nació: {formatDate(subClient.dateOfBirth)}
        </Text>
        <Text style={[commonStyles.textLight, { fontSize: 12 }]}>
          📅 Registrado: {formatDate(subClient.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
