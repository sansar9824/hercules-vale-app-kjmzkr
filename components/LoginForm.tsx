
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { Distributor } from '../types';
import { authenticateDistributor } from '../data/mockData';

interface LoginFormProps {
  onLogin: (distributor: Distributor) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!credentials.username.trim()) {
      Alert.alert('Error', 'Por favor ingrese su nombre de usuario');
      return;
    }

    if (!credentials.password.trim()) {
      Alert.alert('Error', 'Por favor ingrese su contraseña');
      return;
    }

    setIsLoading(true);

    try {
      const distributor = await authenticateDistributor(
        credentials.username.trim(),
        credentials.password.trim()
      );

      if (distributor) {
        console.log('Login successful:', distributor);
        onLogin(distributor);
      } else {
        Alert.alert(
          'Error de Acceso',
          'Usuario o contraseña incorrectos. Por favor verifique sus datos e intente nuevamente.'
        );
      }
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert(
        'Error',
        'Ocurrió un problema al iniciar sesión. Por favor intente nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[commonStyles.section, { width: '100%', maxWidth: 400 }]}>
      <Text style={[commonStyles.subtitle, { 
        textAlign: 'center', 
        marginBottom: 32,
        fontSize: 22,
      }]}>
        Iniciar Sesión
      </Text>
      
      {/* Username Input */}
      <View style={{ marginBottom: 20 }}>
        <Text style={[commonStyles.text, { 
          marginBottom: 8, 
          fontWeight: '600',
          fontSize: 16,
        }]}>
          👤 Usuario
        </Text>
        <TextInput
          style={[commonStyles.input, { 
            fontSize: 18,
            paddingVertical: 16,
            paddingHorizontal: 20,
          }]}
          placeholder="Ingrese su usuario"
          placeholderTextColor={colors.textLight}
          value={credentials.username}
          onChangeText={(text) => setCredentials(prev => ({ ...prev, username: text }))}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      
      {/* Password Input */}
      <View style={{ marginBottom: 32 }}>
        <Text style={[commonStyles.text, { 
          marginBottom: 8, 
          fontWeight: '600',
          fontSize: 16,
        }]}>
          🔒 Contraseña
        </Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            style={[commonStyles.input, { 
              fontSize: 18,
              paddingVertical: 16,
              paddingHorizontal: 20,
              paddingRight: 60,
            }]}
            placeholder="Ingrese su contraseña"
            placeholderTextColor={colors.textLight}
            value={credentials.password}
            onChangeText={(text) => setCredentials(prev => ({ ...prev, password: text }))}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 16,
              top: 16,
              padding: 4,
            }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={{ fontSize: 20 }}>
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Login Button */}
      <TouchableOpacity
        style={[buttonStyles.primary, { 
          opacity: isLoading ? 0.7 : 1,
          paddingVertical: 18,
          marginBottom: 24,
        }]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={[commonStyles.buttonText, { fontSize: 20 }]}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>
      
      {/* Help Text */}
      <View style={[commonStyles.card, { backgroundColor: colors.background }]}>
        <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
          💡 Ayuda
        </Text>
        <Text style={[commonStyles.textLight, { fontSize: 14, lineHeight: 20 }]}>
          • Si olvidó su usuario o contraseña, contacte a soporte{'\n'}
          • Mantenga sus datos de acceso seguros{'\n'}
          • Use el botón del ojo para mostrar/ocultar la contraseña
        </Text>
      </View>
    </View>
  );
}
