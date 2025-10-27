import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../constants/colors';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  mode?: 'solid' | 'outlined'; // Nuestros dos tipos de botón
};

export default function CustomButton({ title, onPress, mode = 'solid' }: CustomButtonProps) {
  // Elige el estilo del contenedor y del texto basado en el 'mode'
  const containerStyle: ViewStyle =
    mode === 'solid' ? styles.containerSolid : styles.containerOutlined;
  
  const textStyle: TextStyle =
    mode === 'solid' ? styles.textSolid : styles.textOutlined;

  return (
    <TouchableOpacity style={[styles.containerBase, containerStyle]} onPress={onPress}>
      <Text style={[styles.textBase, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Estilos base compartidos
  containerBase: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  textBase: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Estilos para el botón SÓLIDO
  containerSolid: {
    backgroundColor: COLORS.primary,
  },
  textSolid: {
    color: COLORS.white,
  },

  // Estilos para el botón BORDEADO
  containerOutlined: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  textOutlined: {
    color: COLORS.primary,
  },
});