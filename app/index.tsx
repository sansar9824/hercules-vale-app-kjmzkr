
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

type ActiveTab = 'vouchers' | 'clients' | 'profile';
type VoucherFilter = 'all' | 'active' | 'expired' | 'used';
type BottomSheetContent = 'createVoucher' | 'addClient' | null;

export default function MainScreen() {
  const { currentDistributor, login, logout, isAuthenticated } = useAuth();
  const vouchers = useVouchers(currentDistributor?.id || '');
  const subClients = useSubClients(currentDistributor?.id || '');
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('vouchers');
  const [voucherFilter, setVoucherFilter] = useState<VoucherFilter>('active');
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

  const getFilteredVouchers = () => {
    switch (voucherFilter) {
      case 'active':
        return vouchers.activeVouchers;
      case 'expired':
        return vouchers.expiredVouchers;
      case 'used':
        return vouchers.usedVouchers;
      default:
        return vouchers.vouchers;
    }
  };

  const getVoucherStats = () => {
    return {
      total: vouchers.vouchers.length,
      active: vouchers.activeVouchers.length,
      expired: vouchers.expiredVouchers.length,
      used: vouchers.usedVouchers.length,
    };
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <ScrollView contentContainerStyle={commonStyles.centerContent}>
          {/* Logo and Branding */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <View style={{
              width: 140,
              height: 140,
              backgroundColor: colors.secondary,
              borderRadius: 70,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              boxShadow: '0px 4px 12px rgba(30, 58, 138, 0.3)',
              elevation: 6,
            }}>
              <Text style={{
                color: colors.primary,
                fontSize: 32,
                fontWeight: '800',
              }}>HV</Text>
            </View>
            <Text style={[commonStyles.title, { 
              color: colors.secondary, 
              fontSize: 32,
              marginBottom: 8,
            }]}>
              HérculesVale
            </Text>
            <Text style={[commonStyles.textLight, { 
              textAlign: 'center',
              fontSize: 16,
              paddingHorizontal: 20,
            }]}>
              Sistema Digital de Vales{'\n'}
              para Distribuidores
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
            subClients={subClients.subClients}
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

  const stats = getVoucherStats();
  const filteredVouchers = getFilteredVouchers();

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
          <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 18 }]}>
            Hola, {currentDistributor?.name}
          </Text>
          <Text style={[commonStyles.textLight, { fontSize: 14 }]}>
            HérculesVale - Sistema Digital
          </Text>
        </View>
        <TouchableOpacity
          onPress={logout}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={[commonStyles.textLight, { fontSize: 14, fontWeight: '500' }]}>
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
            borderBottomWidth: activeTab === 'vouchers' ? 3 : 0,
            borderBottomColor: colors.secondary,
          }}
          onPress={() => setActiveTab('vouchers')}
        >
          <Text style={[
            commonStyles.text,
            {
              fontWeight: activeTab === 'vouchers' ? '700' : '500',
              color: activeTab === 'vouchers' ? colors.secondary : colors.textLight,
              fontSize: 16,
            }
          ]}>
            🎫 Vales
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: activeTab === 'clients' ? 3 : 0,
            borderBottomColor: colors.secondary,
          }}
          onPress={() => setActiveTab('clients')}
        >
          <Text style={[
            commonStyles.text,
            {
              fontWeight: activeTab === 'clients' ? '700' : '500',
              color: activeTab === 'clients' ? colors.secondary : colors.textLight,
              fontSize: 16,
            }
          ]}>
            👥 Subclientes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: activeTab === 'profile' ? 3 : 0,
            borderBottomColor: colors.secondary,
          }}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[
            commonStyles.text,
            {
              fontWeight: activeTab === 'profile' ? '700' : '500',
              color: activeTab === 'profile' ? colors.secondary : colors.textLight,
              fontSize: 16,
            }
          ]}>
            📊 Resumen
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {activeTab === 'vouchers' && (
          <View>
            {/* Action Button */}
            <TouchableOpacity
              style={[buttonStyles.primary, { 
                marginBottom: 20,
                paddingVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }]}
              onPress={() => setBottomSheetContent('createVoucher')}
            >
              <Text style={[commonStyles.buttonText, { fontSize: 18, marginRight: 8 }]}>
                ➕
              </Text>
              <Text style={[commonStyles.buttonText, { fontSize: 18 }]}>
                Crear Nuevo Vale
              </Text>
            </TouchableOpacity>

            {/* Filter Buttons */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 20 }}
            >
              {[
                { key: 'active', label: `Activos (${stats.active})`, color: colors.success },
                { key: 'expired', label: `Expirados (${stats.expired})`, color: colors.warning },
                { key: 'used', label: `Usados (${stats.used})`, color: colors.textLight },
                { key: 'all', label: `Todos (${stats.total})`, color: colors.secondary },
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 12,
                    backgroundColor: voucherFilter === filter.key ? filter.color : colors.background,
                    borderWidth: 1,
                    borderColor: filter.color,
                  }}
                  onPress={() => setVoucherFilter(filter.key as VoucherFilter)}
                >
                  <Text style={{
                    color: voucherFilter === filter.key ? colors.primary : filter.color,
                    fontWeight: '600',
                    fontSize: 14,
                  }}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Vouchers List */}
            {filteredVouchers.length === 0 ? (
              <View style={[commonStyles.card, { alignItems: 'center', padding: 40 }]}>
                <Text style={{ fontSize: 48, marginBottom: 16 }}>🎫</Text>
                <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 8 }]}>
                  {voucherFilter === 'active' && 'No tienes vales activos'}
                  {voucherFilter === 'expired' && 'No tienes vales expirados'}
                  {voucherFilter === 'used' && 'No tienes vales usados'}
                  {voucherFilter === 'all' && 'No tienes vales creados aún'}
                </Text>
                <Text style={[commonStyles.textLight, { textAlign: 'center' }]}>
                  {voucherFilter === 'all' && 'Toca "Crear Nuevo Vale" para empezar.'}
                </Text>
              </View>
            ) : (
              filteredVouchers.map((voucher) => {
                const subClient = subClients.subClients.find(c => c.id === voucher.subClientId);
                return (
                  <VoucherCard 
                    key={voucher.id} 
                    voucher={voucher} 
                    subClientPhone={subClient?.phone}
                  />
                );
              })
            )}
          </View>
        )}

        {activeTab === 'clients' && (
          <View>
            {/* Action Button */}
            <TouchableOpacity
              style={[buttonStyles.primary, { 
                marginBottom: 20,
                paddingVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }]}
              onPress={() => setBottomSheetContent('addClient')}
            >
              <Text style={[commonStyles.buttonText, { fontSize: 18, marginRight: 8 }]}>
                ➕
              </Text>
              <Text style={[commonStyles.buttonText, { fontSize: 18 }]}>
                Agregar Subcliente
              </Text>
            </TouchableOpacity>

            {/* Clients List */}
            {subClients.subClients.length === 0 ? (
              <View style={[commonStyles.card, { alignItems: 'center', padding: 40 }]}>
                <Text style={{ fontSize: 48, marginBottom: 16 }}>👥</Text>
                <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 8 }]}>
                  No tienes subclientes registrados
                </Text>
                <Text style={[commonStyles.textLight, { textAlign: 'center' }]}>
                  Registra tu primer subcliente para poder crear vales más fácilmente.
                </Text>
              </View>
            ) : (
              subClients.subClients.map((subClient) => (
                <SubClientCard key={subClient.id} subClient={subClient} />
              ))
            )}
          </View>
        )}

        {activeTab === 'profile' && (
          <View>
            {/* Stats Cards */}
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              justifyContent: 'space-between',
              marginBottom: 24,
            }}>
              <View style={[commonStyles.card, { 
                width: '48%', 
                alignItems: 'center',
                backgroundColor: colors.success + '20',
                borderColor: colors.success,
              }]}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>✅</Text>
                <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 24 }]}>
                  {stats.active}
                </Text>
                <Text style={[commonStyles.textLight, { textAlign: 'center' }]}>
                  Vales Activos
                </Text>
              </View>

              <View style={[commonStyles.card, { 
                width: '48%', 
                alignItems: 'center',
                backgroundColor: colors.secondary + '20',
                borderColor: colors.secondary,
              }]}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>👥</Text>
                <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 24 }]}>
                  {subClients.subClients.length}
                </Text>
                <Text style={[commonStyles.textLight, { textAlign: 'center' }]}>
                  Subclientes
                </Text>
              </View>

              <View style={[commonStyles.card, { 
                width: '48%', 
                alignItems: 'center',
                backgroundColor: colors.warning + '20',
                borderColor: colors.warning,
              }]}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>⏰</Text>
                <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 24 }]}>
                  {stats.expired}
                </Text>
                <Text style={[commonStyles.textLight, { textAlign: 'center' }]}>
                  Expirados
                </Text>
              </View>

              <View style={[commonStyles.card, { 
                width: '48%', 
                alignItems: 'center',
                backgroundColor: colors.textLight + '20',
                borderColor: colors.textLight,
              }]}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>📋</Text>
                <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 24 }]}>
                  {stats.used}
                </Text>
                <Text style={[commonStyles.textLight, { textAlign: 'center' }]}>
                  Usados
                </Text>
              </View>
            </View>

            {/* Profile Info */}
            <View style={commonStyles.card}>
              <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
                👤 Información del Distribuidor
              </Text>
              <View style={{ marginBottom: 12 }}>
                <Text style={[commonStyles.textLight, { fontSize: 12 }]}>Nombre</Text>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  {currentDistributor?.name}
                </Text>
              </View>
              <View style={{ marginBottom: 12 }}>
                <Text style={[commonStyles.textLight, { fontSize: 12 }]}>Usuario</Text>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  {currentDistributor?.username}
                </Text>
              </View>
              <View style={{ marginBottom: 12 }}>
                <Text style={[commonStyles.textLight, { fontSize: 12 }]}>Email</Text>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  {currentDistributor?.email}
                </Text>
              </View>
              <View>
                <Text style={[commonStyles.textLight, { fontSize: 12 }]}>Teléfono</Text>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  {currentDistributor?.phone}
                </Text>
              </View>
            </View>

            {/* App Info */}
            <View style={[commonStyles.card, { backgroundColor: colors.background }]}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
                📱 HérculesVale v1.0
              </Text>
              <Text style={[commonStyles.textLight, { fontSize: 13, lineHeight: 18 }]}>
                Sistema digital de vales para distribuidores.{'\n'}
                Diseñado para facilitar la gestión de créditos y mejorar la experiencia de todos nuestros usuarios.
              </Text>
            </View>
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
