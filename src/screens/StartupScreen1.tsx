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
  navigation: StackNavigationProp<AuthStackParamList, 'Startup1'>;
};

export default function StartupScreen1({ navigation }: Props) {
  const [umaiPosition, setUmaiPosition] = useState(55);

  const handleUmaiLayout = (event: any) => {
    const { y } = event.nativeEvent.layout;
    setUmaiPosition(y);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WaveHeader targetY={umaiPosition} />
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text 
            style={styles.title}
            onLayout={handleUmaiLayout}
          >
            UMAI
          </Text>
          <Text style={styles.subtitle}>
            Lorem ipsum dolor sit amet consectetur. Lorem id sit
          </Text>
        </View>
        {/* Botón Continuar */}
        <CustomButton
          title="Continuar"
          mode="solid"
          onPress={() => navigation.navigate('Startup2')}
        />
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
  textContainer: {
    marginTop: 150,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
});