import React from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../constants/colors';

// Obtenemos el ancho de la pantalla para que el SVG sea responsivo
const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 250; // Altura del header

export default function AuthHeader() {
  // Esta es la "ruta" que dibuja la curva SVG
  // M 0,0 = Mover a la esquina superior izquierda
  // H ${width} = Línea horizontal hasta la esquina superior derecha
  // V ${HEADER_HEIGHT * 0.7} = Línea vertical hacia abajo (70% de la altura)
  // Q ${width / 2},${HEADER_HEIGHT * 1.1}, 0,${HEADER_HEIGHT * 0.7}
  //   ^ Esto es lo mágico: una curva cuadrática de Bézier
  //   (Punto de control en el centro y 110% de la altura, terminando en el borde izquierdo al 70% de la altura)
  // Z = Cerrar la forma
  const svgPath = `M 0,0 H ${width} V ${HEADER_HEIGHT * 0.7} Q ${width / 2},${HEADER_HEIGHT * 1.1} 0,${HEADER_HEIGHT * 0.7} Z`;

  return (
    <View style={styles.container}>
      {/* 1. El SVG que crea la forma */}
      <Svg height={HEADER_HEIGHT} width={width} style={styles.svg}>
        <Path d={svgPath} fill={COLORS.primary} />
      </Svg>

      {/* 2. La imagen de fondo, "enmascarada" por el View principal */}
      <ImageBackground
        //source={require('../assets/food-pattern.png')} // ¡Asegúrate que esta ruta es correcta!
        style={styles.imageBackground}
        imageStyle={styles.imageOpacity} // Aplica opacidad a la imagen
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    overflow: 'hidden', // Esto "corta" el SVG y la imagen a la altura del View
    backgroundColor: COLORS.white, // Fondo por si acaso
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOpacity: {
    opacity: 0.3, // Le da ese tono suave a los iconos de comida
  },
});