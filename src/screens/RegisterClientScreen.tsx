import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import PagerView from 'react-native-pager-view';
import { Feather } from '@expo/vector-icons';

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

// Categorías
const CATEGORIES = [
  'Mexicana', 'Italiana', 'Japonesa', 'China', 'India', 'Americana',
  'Vegetariano', 'Vegano', 'Mariscos', 'Postres', 'Snacks', 'Café',
  'Té', 'Comida Casera', 'Comida rápida', 'Gourmet', 'Desayunos',
];

export default function RegisterClientScreen({ navigation }: Props) {
  const [page, setPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const [titlePosition, setTitlePosition] = useState(55);

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

  const handleTitleLayout = (event: any) => {
    const { y } = event.nativeEvent.layout;
    setTitlePosition(y);
  };

  // Lógica de Categorías
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  
  // Lógica del Botón Principal
  const isLastPage = page === 2;
  
  // Validaciones
  const isStep1Valid = name.length > 2 && email.includes('@') && phone.length > 7;
  const isStep2Valid = password.length > 5 && password === confirmPassword;
  const isStep3Valid = selectedCategories.length > 0 && selectedCategories.length <= 5;

  let isButtonDisabled = true;
  if (page === 0) isButtonDisabled = !isStep1Valid;
  if (page === 1) isButtonDisabled = !isStep2Valid;
  if (page === 2) isButtonDisabled = !isStep3Valid;

  // Lógica de Imagen
  const pickImage = async () => {
    // Implementar expo-image-picker aquí
  };

  const handleButtonPress = () => {
    if (isLastPage) {
      const formData = { name, email, phone, password, selectedCategories };
      console.log('Enviando al backend:', formData);
      Alert.alert('¡Registro Exitoso!', 'Tu cuenta ha sido creada.');
    } else {
      pagerRef.current?.setPage(page + 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WaveHeader targetY={titlePosition} />
      <TouchableOpacity onPress={() => navigation.navigate('RegisterType')} style={styles.backButton}>
        <Feather name="arrow-left" size={28} color={COLORS.white} />
      </TouchableOpacity>
      
      <View style={styles.titleContainer} onLayout={handleTitleLayout}>
        <Text style={styles.title}>Registro Cliente</Text>
      </View>

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
          <CustomInput iconName="user" placeholder="Nombre" value={name} onChangeText={setName} />
          <CustomInput iconName="mail" placeholder="Correo electrónico" value={email} onChangeText={setEmail} />
          <CustomInput iconName="phone" placeholder="Número de teléfono" value={phone} onChangeText={setPhone} />
        </View>
        {/* Página 2: Contraseña */}
        <View key="2" style={styles.page}>
          <CustomInput iconName="lock" placeholder="Contraseña" value={password} onChangeText={setPassword} isPassword />
          <CustomInput iconName="lock" placeholder="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} isPassword />
        </View>
        {/* Página 3: Categorías */}
        <View key="3" style={styles.page}>
          <Text style={styles.categoryTitle}>Categorías</Text>
          <Text style={styles.categorySubtitle}>Selecciona máximo 5</Text>
          <View style={styles.chipContainer}>
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                isSelected={selectedCategories.includes(cat)}
                onPress={() => toggleCategory(cat)}
              />
            ))}
          </View>
        </View>
      </PagerView>

      <View style={styles.bottomContainer}>
        <PaginationDots count={3} activeIndex={page} />
        <CustomButton
          title={isLastPage ? "Registrarse" : "Siguiente"}
          onPress={handleButtonPress}
          mode="solid"
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
    marginTop: 85
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
  bottomContainer: { 
    padding: 24, 
    paddingTop: 0 
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