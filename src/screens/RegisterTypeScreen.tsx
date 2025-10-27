import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { COLORS } from '../constants/colors';

import AuthHeader from '../components/AuthHeader';
import CustomButton from '../components/CustomButton';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'RegisterType'>;
};

export default function RegisterTypeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TODO: Actualizar AuthHeader para que acepte un botón de "atrás" */}
      <AuthHeader />
      
      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.title}>UMAI</Text>
          <Text style={styles.subtitle}>Registro</Text>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Cliente"
            mode="solid"
            onPress={() => navigation.navigate('RegisterClient')}
          />
          <CustomButton
            title="Restaurante"
            mode="outlined"
            onPress={() => navigation.navigate('RegisterRestaurant')}
          />
        </View>

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
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between', // Separa títulos, botones y link
    padding: 24,
    paddingBottom: 40,
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
  buttonContainer: {
    width: '100%',
  },
  loginLink: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  loginLinkBold: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});