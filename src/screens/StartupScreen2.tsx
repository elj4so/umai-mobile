import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

// Navegación
import { AuthStackParamList } from '../navigation/AppNavigator';
// Estilos Colores
import { COLORS } from '../constants/colors';
// Componentes
import WaveHeader from '../components/WaveHeader';
import CustomButton from '../components/CustomButton';

// Props de Navegación
type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'Startup2'>;
};

export default function StartupScreen2({ navigation }: Props) {
  const [umaiPosition, setUmaiPosition] = useState(55);

  const handleUmaiLayout = (event: any) => {
    const { y } = event.nativeEvent.layout;
    setUmaiPosition(y);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WaveHeader targetY={umaiPosition} />
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text 
            style={styles.title}
            onLayout={handleUmaiLayout}
          >
            UMAI
          </Text>
        </View>
        {/* Botones */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Iniciar sesión"
            mode="solid"
            onPress={() => navigation.navigate('Login')}
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

// Estilos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 40,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
});