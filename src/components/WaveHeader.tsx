import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

export default function WaveHeader() {
  return (
    <View style={styles.container}>
      {/* Fondo sólido del header */}
      <View style={styles.headerBackground} />
      
      {/* SVG con la onda */}
      <Svg
        height="60%"
        width="100%"
        viewBox="0 0 1440 320"
        style={styles.wave}
      >
        <Path
          fill={COLORS.primary}
          d="M0,32L80,53.3C160,75,320,117,480,112C640,107,800,53,960,53.3C1120,53,1280,107,1360,133.3L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: 'hidden',
    zIndex: 0,
  },
  headerBackground: {
    backgroundColor: COLORS.primary,
    height: 76, // Altura del fondo sólido
    width: '100%',
  },
  wave: {
    position: 'absolute',
    top: 55, // Ajusta esto para mover la onda arriba/abajo
  },
});