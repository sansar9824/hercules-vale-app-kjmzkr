
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { authenticateDistributor } from '../data/mockData';
import { Distributor } from '../types';

interface LoginFormProps {
  onLogin: (distributor: Distributor) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingrese usuario y contraseña');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const distributor = authenticateDistributor(username.trim(), password);
      
      if (distributor) {
        onLogin(distributor);
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Error', 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={commonStyles.section}>
      <Text style={commonStyles.subtitle}>Iniciar Sesión</Text>
      
      <TextInput
        style={commonStyles.input}
        placeholder="Usuario"
        placeholderTextColor={colors.textLight}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TextInput
        style={commonStyles.input}
        placeholder="Contraseña"
        placeholderTextColor={colors.textLight}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TouchableOpacity
        style={[buttonStyles.primary, { opacity: isLoading ? 0.7 : 1 }]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={commonStyles.buttonText}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>
      
      <View style={{ marginTop: 16 }}>
        <Text style={[commonStyles.textLight, { textAlign: 'center' }]}>
          Usuario de prueba: distribuidor001
        </Text>
        <Text style={[commonStyles.textLight, { textAlign: 'center' }]}>
          Contraseña: 123456
        </Text>
      </View>
    </View>
  );
}
