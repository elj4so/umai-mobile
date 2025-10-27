import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { COLORS } from '../constants/colors';

import AuthHeader from '../components/AuthHeader';
import CustomButton from '../components/CustomButton';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'Startup2'>;
};

export default function StartupScreen2({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AuthHeader />
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>UMAI</Text>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Iniciar sesión"
            mode="solid"
            onPress={() => navigation.navigate('Login')} // Asume que tienes una pantalla 'Login'
          />
          <CustomButton
            title="Registrarse"
            mode="outlined"
            onPress={() => navigation.navigate('RegisterType')}
          />
        </View>
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
    justifyContent: 'center', // Centra el contenido verticalmente
    padding: 24,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 60, // Espacio entre el título y los botones
  },
  buttonContainer: {
    width: '100%',
  },
});