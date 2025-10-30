import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import { StackNavigationProp } from '@react-navigation/stack';

// Navegación
import { AuthStackParamList } from '../navigation/AppNavigator';
// Estilos Colores
import { COLORS } from '../constants/colors';
// Componentes
import AuthHeader from '../components/AuthHeader';
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
      <AuthHeader />
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
        <TouchableOpacity onPress={() => navigation.navigate('RegisterType')}>
          <Text style={styles.registerLink}>¿No tienes una cuenta? <Text style={styles.registerLinkBold}>Regístrate</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: COLORS.white 
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between', // Separa títulos, botones y link
    padding: 24,
    paddingBottom: 40,
  },
  titleContainer: { 
    alignItems: 'center', 
    marginTop: 20 
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
  registerLink: { 
    fontSize: 16, 
    color: COLORS.textSecondary, 
    textAlign: 'center', 
    marginTop: 16 
  },
  registerLinkBold: { 
    color: COLORS.primary, 
    fontWeight: 'bold' 
  },
});