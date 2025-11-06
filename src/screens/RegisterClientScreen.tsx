// src/screens/RegisterClientScreen.tsx

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import PagerView from 'react-native-pager-view';
import { Feather } from '@expo/vector-icons';

// Servicios
import authService from '../services/authService';

// Navegación
import { AuthStackParamList } from '../navigation/AppNavigator';
// Estilos Colores
import { COLORS } from '../constants/colors';
// Componentes
import WaveHeader from '../components/WaveHeader';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import PaginationDots from '../components/PaginationDots';
import CategoryChip from '../components/CategoryChip';

// Props de Navegación
type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'RegisterClient'>;
};

// Categorías - mapeo a las categorías del backend
const CATEGORIES = [
  { label: 'Mexicana', value: 'MEXICAN' },
  { label: 'Italiana', value: 'ITALIAN' },
  { label: 'Japonesa', value: 'JAPANESE' },
  { label: 'China', value: 'CHINESE' },
  { label: 'India', value: 'INDIAN' },
  { label: 'Americana', value: 'AMERICAN' },
  { label: 'Vegetariano', value: 'VEGETARIAN' },
  { label: 'Vegano', value: 'VEGAN' },
  { label: 'Mariscos', value: 'SEAFOOD' },
  { label: 'Postres', value: 'DESSERTS' },
  { label: 'Snacks', value: 'SNACKS' },
  { label: 'Café', value: 'COFFEE' },
  { label: 'Comida Rápida', value: 'FAST_FOOD' },
];

export default function RegisterClientScreen({ navigation }: Props) {
  const [page, setPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const [loading, setLoading] = useState(false);

  // Formulario
  const [profilePic, setProfilePic] = useState<string | null>(null);
  // Paso 1
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // Paso 2
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Paso 3
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Lógica de Categorías
  const toggleCategory = (categoryValue: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((c) => c !== categoryValue)
        : prev.length < 5 // Máximo 5
        ? [...prev, categoryValue]
        : prev
    );
  };
  
  // Lógica del Botón Principal
  const isLastPage = page === 2;
  
  // Validaciones
  const isStep1Valid = name.length > 2 && email.includes('@') && phone.length >= 10;
  const isStep2Valid = password.length >= 6 && password === confirmPassword;
  const isStep3Valid = selectedCategories.length > 0 && selectedCategories.length <= 5;

  let isButtonDisabled = true;
  if (page === 0) isButtonDisabled = !isStep1Valid;
  if (page === 1) isButtonDisabled = !isStep2Valid;
  if (page === 2) isButtonDisabled = !isStep3Valid;

  // Lógica de Imagen (placeholder por ahora)
  const pickImage = async () => {
    Alert.alert('Foto de perfil', 'Funcionalidad de imagen próximamente');
    // Implementar con expo-image-picker después
  };

  const handleButtonPress = async () => {
    if (isLastPage) {
      // Lógica de Registro Final
      await handleRegister();
    } else {
      // Avanza a la siguiente página
      pagerRef.current?.setPage(page + 1);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    
    try {
      const userData = {
        name,
        email,
        phone,
        password,
        preferences: selectedCategories, // Array de categorías seleccionadas
      };

      console.log('📤 Enviando registro:', { ...userData, password: '***' });

      const result = await authService.registerCustomer(userData);

      if (result.success) {
        console.log('✅ Registro exitoso:', result.data.user);
        
        Alert.alert(
          '¡Registro Exitoso!',
          `Bienvenido ${result.data.user.name}`,
          [
            {
              text: 'Comenzar',
              onPress: () => navigation.navigate('VideoReel'),
            },
          ]
        );
      } else {
        // Mostrar error específico del backend
        Alert.alert('Error en el registro', result.error);
      }
    } catch (error) {
      console.error('Error inesperado en registro:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WaveHeader />
      
      {/* Botón de Atrás */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('RegisterType')} 
        style={styles.backButton}
        disabled={loading}
      >
        <Feather name="arrow-left" size={28} color={COLORS.white} />
      </TouchableOpacity>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Registro Cliente</Text>
      </View>

      {/* Foto de Perfil */}
      <TouchableOpacity 
        style={styles.profilePicContainer} 
        onPress={pickImage}
        disabled={loading}
      >
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
        ) : (
          <Feather name="plus" size={40} color={COLORS.textSecondary} />
        )}
      </TouchableOpacity>
      <Text style={styles.profilePicText}>Foto de perfil</Text>

      <PagerView
        style={styles.pager}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
        scrollEnabled={false}
      >
        {/* Página 1: Datos Personales */}
        <View key="1" style={styles.page}>
          <CustomInput 
            iconName="user" 
            placeholder="Nombre completo" 
            value={name} 
            onChangeText={setName}
            editable={!loading}
          />
          <CustomInput 
            iconName="mail" 
            placeholder="Correo electrónico" 
            value={email} 
            onChangeText={setEmail}
            editable={!loading}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <CustomInput 
            iconName="phone" 
            placeholder="Número de teléfono" 
            value={phone} 
            onChangeText={setPhone}
            editable={!loading}
            keyboardType="phone-pad"
          />
        </View>

        {/* Página 2: Contraseña */}
        <View key="2" style={styles.page}>
          <CustomInput 
            iconName="lock" 
            placeholder="Contraseña (mínimo 6 caracteres)" 
            value={password} 
            onChangeText={setPassword} 
            isPassword
            editable={!loading}
          />
          <CustomInput 
            iconName="lock" 
            placeholder="Confirmar contraseña" 
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
            isPassword
            editable={!loading}
          />
          {password !== confirmPassword && confirmPassword.length > 0 && (
            <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
          )}
        </View>

        {/* Página 3: Categorías */}
        <View key="3" style={styles.page}>
          <Text style={styles.categoryTitle}>Categorías</Text>
          <Text style={styles.categorySubtitle}>
            Selecciona entre 1 y 5 categorías que te gusten
          </Text>
          <View style={styles.chipContainer}>
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.value}
                label={cat.label}
                isSelected={selectedCategories.includes(cat.value)}
                onPress={() => toggleCategory(cat.value)}
              />
            ))}
          </View>
        </View>
      </PagerView>

      {/* Botón Siguiente/Registrarse */}
      <View style={styles.bottomContainer}>
        <PaginationDots count={3} activeIndex={page} />
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Creando tu cuenta...</Text>
          </View>
        ) : (
          <CustomButton
            title={isLastPage ? "Registrarse" : "Siguiente"}
            onPress={handleButtonPress}
            mode="solid"
            disabled={isButtonDisabled}
          />
        )}
        
        <View style={styles.footerContainer}>
          <Text style={styles.loginLink}>¿Ya tienes una cuenta?</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.loginLinkBold}> Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: COLORS.white 
  },
  backButton: { 
    position: 'absolute', 
    top: 50,
    left: 20, 
    zIndex: 100
  }, 
  titleContainer: { 
    alignItems: 'center', 
    marginTop: 100
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: COLORS.text 
  },
  profilePicContainer: {
    width: 110,
    height: 110,
    borderRadius: 65,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  profilePic: {
    width: 110,
    height: 110,
    borderRadius: 65,
  },
  profilePicText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  pager: { 
    flex: 1 
  },
  page: { 
    padding: 24, 
    paddingTop: 10 
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  bottomContainer: { 
    padding: 24, 
    paddingTop: 0 
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginLink: { 
    fontSize: 16,
    color: COLORS.textSecondary, 
    textAlign: 'center', 
    marginTop: 16 
  },
  loginLinkBold: {
    fontSize: 16,
    color: COLORS.primary, 
    textAlign: 'center', 
    marginTop: 16,
    fontWeight: 'bold'
  },
  categoryTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: COLORS.text, 
    textAlign: 'center',
    marginTop: 16
  },
  categorySubtitle: { 
    fontSize: 14, 
    color: COLORS.textSecondary, 
    textAlign: 'center', 
    marginBottom: 16 
  },
  chipContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center' 
  },
});