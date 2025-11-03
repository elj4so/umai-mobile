import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

// Navegación
import { AuthStackParamList } from '../navigation/AppNavigator';
// Estilos Colores
import { COLORS } from '../constants/colors';
// Componentes
import WaveHeader from '../components/WaveHeader';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

// Props de Navegación
type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Lógica Iniciar Sesión
  const handleLogin = () => {
    console.log({ email, password });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WaveHeader />
      <TouchableOpacity onPress={() => navigation.navigate('Startup2')} style={styles.backButton}>
        <Feather name="arrow-left" size={28} color={COLORS.white} />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>UMAI</Text>
          <Text style={styles.subtitle}>Iniciar Sesión</Text>
        </View>
        <View style={styles.inputContainer}>
          {/* 1. Input: Correo Electrónico */}
          <CustomInput
            iconName="mail"
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
          />
          {/* 2. Input: Contraseña */}
          <CustomInput
            iconName="lock"
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            isPassword={true}
          />
        </View>
        
      </View>
         {/* Botón Iniciar Sesión */}
      <View style={styles.bottomContainer}>
        <CustomButton
          title="Iniciar Sesión"
          mode="solid"
          onPress={handleLogin}
        />
        <View style={styles.footerContainer}>
          <Text style={styles.registerLink}> ¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterType')}>
            <Text style={styles.registerLinkBold}> Registrarse </Text>
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
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between', // Separa títulos, botones y link
    padding: 24,
    paddingBottom: 40,
  },
  titleContainer: { 
    alignItems: 'center', 
    marginTop: 85 
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  inputContainer:{
    alignItems: 'center',
    marginBottom: 80
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
  registerLink: { 
    fontSize: 16, 
    color: COLORS.textSecondary, 
    textAlign: 'center', 
    marginTop: 16 
  },
  registerLinkBold: { 
    fontSize: 16,
    color: COLORS.primary, 
    textAlign: 'center', 
    marginTop: 16,
    fontWeight: 'bold'
  },
});