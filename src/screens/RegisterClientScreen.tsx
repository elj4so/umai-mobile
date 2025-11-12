import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import PagerView from 'react-native-pager-view';
import { Feather } from '@expo/vector-icons';

import authService from '../services/authService';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { COLORS } from '../constants/colors';

import WaveHeader from '../components/WaveHeader';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import PaginationDots from '../components/PaginationDots';
import CategoryChip from '../components/CategoryChip';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'RegisterClient'>;
};

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

  // Campos del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Selección de imagen
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitas otorgar acceso a tus fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const toggleCategory = (categoryValue: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((c) => c !== categoryValue)
        : prev.length < 5
        ? [...prev, categoryValue]
        : prev
    );
  };

  const isLastPage = page === 2;

  // Validaciones
  const isStep1Valid =
    name.length > 2 && email.includes('@') && phone.length >= 10 && profileImage;
  const isStep2Valid = password.length >= 6 && password === confirmPassword;
  const isStep3Valid = selectedCategories.length > 0 && selectedCategories.length <= 5;

  let isButtonDisabled = true;
  if (page === 0) isButtonDisabled = !isStep1Valid;
  if (page === 1) isButtonDisabled = !isStep2Valid;
  if (page === 2) isButtonDisabled = !isStep3Valid;

  const handleButtonPress = async () => {
    if (isLastPage) {
      await handleRegister();
    } else {
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
        preferences: selectedCategories,
        profileImage, // 👈 imagen incluida
      };

      console.log('📤 Registro:', { ...userData, password: '***' });

      const result = await authService.registerCustomer(userData);

      if (result.success) {
        Alert.alert('¡Registro Exitoso!', `Bienvenido ${result.data.user.name}`, [
          { text: 'Comenzar', onPress: () => navigation.navigate('MainTabs') },
        ]);
      } else {
        Alert.alert('Error en el registro', result.error);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WaveHeader />

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

      <PagerView
        style={styles.pager}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
        scrollEnabled={false}
      >
        {/* Página 1: Datos + Imagen */}
        <View key="1" style={styles.page}>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage} disabled={loading}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Feather name="camera" size={32} color={COLORS.textSecondary} />
                <Text style={styles.imageText}>Agregar foto de perfil</Text>
              </View>
            )}
          </TouchableOpacity>

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
          <Text style={styles.categorySubtitle}>Selecciona entre 1 y 5 categorías</Text>
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

      <View style={styles.bottomContainer}>
        <PaginationDots count={3} activeIndex={page} />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Creando tu cuenta...</Text>
          </View>
        ) : (
          <CustomButton
            title={isLastPage ? 'Registrarse' : 'Siguiente'}
            onPress={handleButtonPress}
            mode="solid"
            disabled={isButtonDisabled}
          />
        )}

        <View style={styles.footerContainer}>
          <Text style={styles.loginLink}>¿Ya tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
            <Text style={styles.loginLinkBold}> Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 100 },
  titleContainer: { alignItems: 'center', marginTop: 100 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  pager: { flex: 1 },
  page: { padding: 24, paddingTop: 10 },
  imagePicker: { alignSelf: 'center', marginBottom: 20 },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: { color: COLORS.textSecondary, fontSize: 12, marginTop: 6 },
  profileImage: { width: 120, height: 120, borderRadius: 60 },
  errorText: { color: 'red', fontSize: 12, marginTop: 5, textAlign: 'center' },
  bottomContainer: { padding: 24, paddingTop: 0 },
  loadingContainer: { alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, color: COLORS.textSecondary, fontSize: 16 },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginLink: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', marginTop: 16 },
  loginLinkBold: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 16,
    fontWeight: 'bold',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 16,
  },
  categorySubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 16 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
});
