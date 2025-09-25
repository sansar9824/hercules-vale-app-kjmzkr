
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
    return new Date(dateString).toLocaleDateString('es-MX');
  };

  return (
    <TouchableOpacity
      style={commonStyles.card}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
        {subClient.name}
      </Text>
      
      <Text style={[commonStyles.textLight, { marginBottom: 2 }]}>
        📍 {subClient.address}
      </Text>
      
      <Text style={[commonStyles.textLight, { marginBottom: 2 }]}>
        📞 {subClient.phone}
      </Text>
      
      <Text style={[commonStyles.textLight, { marginBottom: 2 }]}>
        🎂 {formatDate(subClient.dateOfBirth)}
      </Text>
      
      <Text style={[commonStyles.textLight, { fontSize: 12 }]}>
        Registrado: {formatDate(subClient.createdAt)}
      </Text>
    </TouchableOpacity>
  );
}
