import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import PagerView from 'react-native-pager-view';
import { Feather } from '@expo/vector-icons';

import { AuthStackParamList } from '../navigation/AppNavigator';
import { COLORS } from '../constants/colors';

// Importa todos los componentes que creamos
import AuthHeader from '../components/AuthHeader';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import PaginationDots from '../components/PaginationDots';
import CategoryChip from '../components/CategoryChip';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'RegisterClient'>;
};

// --- Definimos las categorías aquí ---
const CATEGORIES = [
  'Mexicana', 'Italiana', 'Japonesa', 'China', 'India', 'Americana',
  'Vegetariano', 'Vegano', 'Mariscos', 'Postres', 'Snacks', 'Café',
  'Té', 'Comida Casera', 'Comida rápida', 'Gourmet', 'Desayunos',
];

export default function RegisterClientScreen({ navigation }: Props) {
  const [page, setPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  // --- Estados del Formulario ---
  // Paso 1
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // Paso 2
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Paso 3
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // --- Lógica de categorías ---
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  
  // --- Lógica del Botón Principal ---
  // Modifiqué tu CustomButton para aceptar 'disabled'. 
  // Si no lo hiciste, tendrás que agregarlo.
  const isLastPage = page === 2;
  
  // Validaciones (muy simples, puedes mejorarlas)
  const isStep1Valid = name.length > 2 && email.includes('@') && phone.length > 7;
  const isStep2Valid = password.length > 5 && password === confirmPassword;
  const isStep3Valid = selectedCategories.length > 0 && selectedCategories.length <= 5;

  let isButtonDisabled = true;
  if (page === 0) isButtonDisabled = !isStep1Valid;
  if (page === 1) isButtonDisabled = !isStep2Valid;
  if (page === 2) isButtonDisabled = !isStep3Valid;

  const handleButtonPress = () => {
    if (isLastPage) {
      // --- Lógica de Registro Final ---
      const formData = { name, email, phone, password, selectedCategories };
      console.log('Enviando al backend:', formData);
      Alert.alert('¡Registro Exitoso!', 'Tu cuenta ha sido creada.');
      // Aquí navegarías a la app principal
      // navigation.navigate('AppHome');
    } else {
      // Avanza a la siguiente página
      pagerRef.current?.setPage(page + 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AuthHeader />
      {/* Botón de Atrás (posicionado absolutamente) */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
        scrollEnabled={false} // El usuario no puede deslizar
      >
        {/* --- Página 1: Datos Personales --- */}
        <View key="1" style={styles.page}>
          <CustomInput iconName="user" placeholder="Nombre" value={name} onChangeText={setName} />
          <CustomInput iconName="mail" placeholder="Correo electrónico" value={email} onChangeText={setEmail} />
          <CustomInput iconName="phone" placeholder="Número de teléfono" value={phone} onChangeText={setPhone} />
        </View>

        {/* --- Página 2: Contraseña --- */}
        <View key="2" style={styles.page}>
          <CustomInput iconName="lock" placeholder="Contraseña" value={password} onChangeText={setPassword} isPassword />
          <CustomInput iconName="lock" placeholder="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} isPassword />
        </View>

        {/* --- Página 3: Categorías --- */}
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
          // Necesitas añadir 'disabled' a tu componente CustomButton
          // disabled={isButtonDisabled} 
        />
        <TouchableOpacity onPress={() => navigation.navigate('Login')}> {/* Ir al'Login' (aun no esta hecho)*/}
          <Text style={styles.loginLink}>
            ¿Ya tienes una cuenta? <Text style={styles.loginLinkBold}>Inicia sesión</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 }, // Ajusta 'top' según tu header
  titleContainer: { alignItems: 'center', marginTop: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  pager: { flex: 1 },
  page: { padding: 24, paddingTop: 30 },
  bottomContainer: { padding: 24, paddingTop: 0 },
  loginLink: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', marginTop: 16 },
  loginLinkBold: { color: COLORS.primary, fontWeight: 'bold' },
  // Estilos para Página 3
  categoryTitle: { fontSize: 20, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  categorySubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 16 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
});