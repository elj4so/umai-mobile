import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../constants/colors';

interface WaveHeaderProps {
  targetY?: number;
}

export default function WaveHeader({ targetY = 55 }: WaveHeaderProps) {
  const animatedHeight = useRef(new Animated.Value(250)).current;
  const headerHeight = targetY > 0 ? targetY + 100 : 250;

  useEffect(() => {
    Animated.spring(animatedHeight, {
      toValue: headerHeight,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  }, [headerHeight]);

  return (
    <Animated.View style={[styles.container, { height: animatedHeight }]}>
      <View style={styles.solidBackground} />
      
      <Svg
        height="200"
        width="100%"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={styles.wave}
      >
        <Path
          fill={COLORS.white}
          d="M0,96L60,112C120,128,240,160,360,165.3C480,171,600,149,720,144C840,139,960,149,1080,165.3C1200,181,1320,203,1380,213.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
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
    width: '100%',
  },
});