import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WaveHeaderProps {
  targetY?: number;
}

export default function WaveHeader({ targetY = 55 }: WaveHeaderProps) {
  const animatedHeight = useRef(new Animated.Value(250)).current;
  
  // Calcula la altura objetivo basándose en la posición de UMAI
  const headerHeight = targetY > 0 ? targetY + 100 : 250;

  useEffect(() => {
    // Animación más lenta y suave
    Animated.timing(animatedHeight, {
      toValue: headerHeight,
      duration: 900, // Más lento (antes era 600)
      useNativeDriver: false,
    }).start();
  }, [headerHeight]);

  return (
    <Animated.View style={[styles.container, { height: animatedHeight }]}>
      <View style={styles.solidBackground} />
      
      <Svg
        height="350"
        width={SCREEN_WIDTH}
        style={styles.wave}
      >
        <Path
          d={`
            M 0 130
            C ${SCREEN_WIDTH * 0.3} 200, ${SCREEN_WIDTH * 0.6} 70, ${SCREEN_WIDTH * 0.8} 250
            S ${SCREEN_WIDTH * 1.3} 200, ${SCREEN_WIDTH} 180
            L ${SCREEN_WIDTH} 350
            L 0 350
            Z
          `}
          fill={COLORS.white}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    overflow: 'hidden',
    zIndex: 0,
  },
  solidBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
  wave: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
  },
});