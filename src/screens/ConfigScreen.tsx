import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, LogOut, User, Bell, Lock, HelpCircle, Info } from 'lucide-react-native';
import { CommonActions } from '@react-navigation/native';

// Servicios
import authService from '../services/authService';

type Props = {
  navigation: any;
};

const ConfigScreen = ({ navigation }: Props) => {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await authService.getUser();
    setUser(userData);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              
              // Navegar al stack de autenticación
              navigation.getParent()?.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Auth' }],
                })
              );
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          },
        },
      ]
    );
  };

  const SettingItem = ({ icon: Icon, title, subtitle, onPress, danger = false }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Icon size={24} color={danger ? '#FF3B5C' : '#666'} />
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, danger && styles.dangerText]}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <ChevronLeft size={20} color="#999" style={{ transform: [{ rotate: '180deg' }] }} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Información del usuario */}
        {user && (
          <View style={styles.userSection}>
            <View style={styles.userAvatar}>
              <User size={40} color="#666" />
            </View>
            <View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        )}

        {/* Cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CUENTA</Text>
          <SettingItem
            icon={User}
            title="Editar Perfil"
            subtitle="Nombre, foto, biografía"
            onPress={() => Alert.alert('Próximamente', 'Función en desarrollo')}
          />
          <SettingItem
            icon={Lock}
            title="Privacidad y Seguridad"
            subtitle="Contraseña, autenticación"
            onPress={() => Alert.alert('Próximamente', 'Función en desarrollo')}
          />
        </View>

        {/* Notificaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICACIONES</Text>
          <SettingItem
            icon={Bell}
            title="Preferencias de Notificaciones"
            subtitle="Likes, comentarios, nuevos videos"
            onPress={() => Alert.alert('Próximamente', 'Función en desarrollo')}
          />
        </View>

        {/* Soporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SOPORTE</Text>
          <SettingItem
            icon={HelpCircle}
            title="Centro de Ayuda"
            onPress={() => Alert.alert('Próximamente', 'Función en desarrollo')}
          />
          <SettingItem
            icon={Info}
            title="Acerca de"
            subtitle="Versión 1.0.0"
            onPress={() => Alert.alert('UMAI', 'Versión 1.0.0\n\nDesarrollado por el equipo de Plateo')}
          />
        </View>

        {/* Cerrar Sesión */}
        <View style={styles.section}>
          <SettingItem
            icon={LogOut}
            title="Cerrar Sesión"
            onPress={handleLogout}
            danger
          />
        </View>

        {/* Espaciado inferior */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
    marginBottom: 20,
  },
  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    paddingHorizontal: 20,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  dangerText: {
    color: '#FF3B5C',
  },
});

export default ConfigScreen;