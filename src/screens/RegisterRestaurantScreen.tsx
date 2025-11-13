import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import PagerView from 'react-native-pager-view';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // expo install expo-image-picker

// Navegación
import { AuthStackParamList } from '../navigation/AppNavigator';
// Estilos Colores
import { COLORS } from '../constants/colors';
// Componentes
import WaveHeader from '../components/WaveHeader';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import PaginationDots from '../components/PaginationDots';

// Props de Navegación
type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'RegisterRestaurant'>;
};

export default function RegisterRestaurantScreen({ navigation }: Props) {
  const [page, setPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  // Formulario
  const [profilePic, setProfilePic] = useState<string | null>(null);
  // Paso 1
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // Paso 2
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  // Paso 3
  const [deliveryFormat, setDeliveryFormat] = useState('');
  // Paso 4 ("Categorías" o "Menú")

  // Lógica de Botón
  const isLastPage = page === 3; // 4 páginas (0, 1, 2, 3)
  
  // (Aquí iría la lógica de validación por paso)
  
  const handleButtonPress = () => {
    if (isLastPage) {
      const formData = { name, email, phone, password, address, deliveryFormat, profilePic };
      console.log('Enviando al backend:', formData);
      Alert.alert('¡Registro Exitoso!', 'Tu restaurante ha sido registrado.');
      // navigation.navigate('AppHome');
    } else {
      pagerRef.current?.setPage(page + 1);
    }
  };

  // Lógica de Imagen (Ejemplo)
  const pickImage = async () => {
    // Pedir permisos (necesario en iOS)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Necesitas dar permisos para acceder a las fotos.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setProfilePic(result.uri);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <WaveHeader />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Feather name="arrow-left" size={28} color={COLORS.white} />
      </TouchableOpacity>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Registro Restaurante</Text>
      </View>
      
      {/* El Círculo de la Foto de Perfil (Fijo) */}
      <TouchableOpacity style={styles.profilePicContainer} onPress={pickImage}>
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
          <CustomInput iconName="user" placeholder="Nombre del restaurante" value={name} onChangeText={setName} />
          <CustomInput iconName="mail" placeholder="Correo electrónico" value={email} onChangeText={setEmail} />
          <CustomInput iconName="phone" placeholder="Número de teléfono" value={phone} onChangeText={setPhone} />
        </View>
        {/* Página 2: Contraseña y Dirección */}
        <View key="2" style={styles.page}>
          <CustomInput iconName="lock" placeholder="Contraseña" value={password} onChangeText={setPassword} isPassword />
          <CustomInput iconName="lock" placeholder="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} isPassword />
          <CustomInput iconName="map-pin" placeholder="Dirección" value={address} onChangeText={setAddress} />
        </View>
        {/* Página 3: Delivery */}
        <View key="3" style={styles.page}>
          <CustomInput iconName="truck" placeholder="Formato de delivery (ej. 'Propio', 'Rappi')" value={deliveryFormat} onChangeText={setDeliveryFormat} />
        </View> 
        {/* Página 4: (Asumida) */}
        <View key="4" style={styles.page}>
          <Text style={styles.categoryTitle}>Paso final</Text>
          <Text style={styles.categorySubtitle}>Aquí irían más campos (ej. categorías, menú)</Text>
        </View>
      </PagerView>
      {/* Botón Siguiente/Registrarse */}
      <View style={styles.bottomContainer}>
        <PaginationDots count={4} activeIndex={page} />
        <CustomButton
          title={isLastPage ? "Registrarse" : "Siguiente"}
          onPress={handleButtonPress}
          mode="solid"
          // disabled={...}
        />
        <View style={styles.footerContainer}>
          <Text style={styles.loginLink}> ¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkBold}> Inicia sesión </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
// Estilos
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
    marginTop: 95,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: COLORS.text 
  },
  profilePicContainer: {
    width: 120,
    height: 120,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#000000ff',
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
    flex: 1, 
    marginTop: 10 
  },
  page: { 
    padding: 24, 
    paddingTop: 10 
  },
  bottomContainer: { 
    padding: 24, 
    paddingTop: 0 
  },
  footerContainer: {
    flexDirection: 'row', // Esto los pone uno al lado del otro
    justifyContent: 'center', // Centra el grupo
    alignItems: 'center', // Alinea verticalmente (por si un texto es más grande)
    marginTop: 16, // El margen que tenías en el loginLink
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
    textAlign: 'center' 
  },
  categorySubtitle: { 
    fontSize: 14, 
    color: COLORS.textSecondary, 
    textAlign: 'center', 
    marginBottom: 16 
  },
});