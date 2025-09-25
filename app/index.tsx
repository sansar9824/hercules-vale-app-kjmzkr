
import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useAuth } from '../hooks/useAuth';
import { useVouchers } from '../hooks/useVouchers';
import { useSubClients } from '../hooks/useSubClients';
import LoginForm from '../components/LoginForm';
import VoucherForm from '../components/VoucherForm';
import VoucherCard from '../components/VoucherCard';
import SubClientCard from '../components/SubClientCard';
import SubClientForm from '../components/SubClientForm';
import SimpleBottomSheet from '../components/BottomSheet';

type ActiveTab = 'vouchers' | 'clients';
type BottomSheetContent = 'createVoucher' | 'addClient' | null;

export default function MainScreen() {
  const { currentDistributor, login, logout, isAuthenticated } = useAuth();
  const vouchers = useVouchers(currentDistributor?.id || '');
  const subClients = useSubClients(currentDistributor?.id || '');
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('vouchers');
  const [bottomSheetContent, setBottomSheetContent] = useState<BottomSheetContent>(null);

  const handleCloseBottomSheet = () => {
    setBottomSheetContent(null);
  };

  const handleVoucherCreated = () => {
    handleCloseBottomSheet();
  };

  const handleSubClientAdded = () => {
    handleCloseBottomSheet();
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <ScrollView contentContainerStyle={commonStyles.centerContent}>
          {/* Logo placeholder - using the HérculesVale branding */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <View style={{
              width: 120,
              height: 120,
              backgroundColor: colors.secondary,
              borderRadius: 60,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Text style={{
                color: colors.primary,
                fontSize: 24,
                fontWeight: '700',
              }}>HV</Text>
            </View>
            <Text style={[commonStyles.title, { color: colors.secondary }]}>
              HérculesVale
            </Text>
            <Text style={[commonStyles.textLight, { textAlign: 'center' }]}>
              Sistema Digital de Vales para Distribuidores
            </Text>
          </View>

          <LoginForm onLogin={login} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const renderBottomSheetContent = () => {
    switch (bottomSheetContent) {
      case 'createVoucher':
        return (
          <VoucherForm
            onCreateVoucher={vouchers.createVoucher}
            onVoucherCreated={handleVoucherCreated}
          />
        );
      case 'addClient':
        return (
          <SubClientForm
            onAddSubClient={subClients.addSubClient}
            onSubClientAdded={handleSubClientAdded}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.backgroundAlt,
      }}>
        <View>
          <Text style={[commonStyles.text, { fontWeight: '600' }]}>
            Bienvenido, {currentDistributor?.name}
          </Text>
          <Text style={commonStyles.textLight}>
            HérculesVale
          </Text>
        </View>
        <TouchableOpacity
          onPress={logout}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            backgroundColor: colors.background,
          }}
        >
          <Text style={[commonStyles.textLight, { fontSize: 14 }]}>
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: colors.backgroundAlt,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: activeTab === 'vouchers' ? 2 : 0,
            borderBottomColor: colors.secondary,
          }}
          onPress={() => setActiveTab('vouchers')}
        >
          <Text style={[
            commonStyles.text,
            {
              fontWeight: activeTab === 'vouchers' ? '600' : '400',
              color: activeTab === 'vouchers' ? colors.secondary : colors.textLight,
            }
          ]}>
            Vales
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: activeTab === 'clients' ? 2 : 0,
            borderBottomColor: colors.secondary,
          }}
          onPress={() => setActiveTab('clients')}
        >
          <Text style={[
            commonStyles.text,
            {
              fontWeight: activeTab === 'clients' ? '600' : '400',
              color: activeTab === 'clients' ? colors.secondary : colors.textLight,
            }
          ]}>
            Subclientes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {activeTab === 'vouchers' && (
          <View>
            <View style={[commonStyles.row, { marginBottom: 20 }]}>
              <Text style={commonStyles.subtitle}>
                Mis Vales ({vouchers.vouchers.length})
              </Text>
              <TouchableOpacity
                style={buttonStyles.primary}
                onPress={() => setBottomSheetContent('createVoucher')}
              >
                <Text style={commonStyles.buttonText}>+ Crear Vale</Text>
              </TouchableOpacity>
            </View>

            {vouchers.vouchers.length === 0 ? (
              <View style={[commonStyles.card, { alignItems: 'center', padding: 40 }]}>
                <Text style={[commonStyles.textLight, { textAlign: 'center' }]}>
                  No tienes vales creados aún.{'\n'}
                  Toca "Crear Vale" para empezar.
                </Text>
              </View>
            ) : (
              vouchers.vouchers.map((voucher) => (
                <VoucherCard key={voucher.id} voucher={voucher} />
              ))
            )}
          </View>
        )}

        {activeTab === 'clients' && (
          <View>
            <View style={[commonStyles.row, { marginBottom: 20 }]}>
              <Text style={commonStyles.subtitle}>
                Subclientes ({subClients.subClients.length})
              </Text>
              <TouchableOpacity
                style={buttonStyles.primary}
                onPress={() => setBottomSheetContent('addClient')}
              >
                <Text style={commonStyles.buttonText}>+ Agregar</Text>
              </TouchableOpacity>
            </View>

            {subClients.subClients.length === 0 ? (
              <View style={[commonStyles.card, { alignItems: 'center', padding: 40 }]}>
                <Text style={[commonStyles.textLight, { textAlign: 'center' }]}>
                  No tienes subclientes registrados aún.{'\n'}
                  Toca "Agregar" para registrar el primero.
                </Text>
              </View>
            ) : (
              subClients.subClients.map((subClient) => (
                <SubClientCard key={subClient.id} subClient={subClient} />
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={bottomSheetContent !== null}
        onClose={handleCloseBottomSheet}
      >
        {renderBottomSheetContent()}
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
