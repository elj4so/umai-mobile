import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Eye, EyeOff, Mail, Lock, Navigation } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

// Obtenemos el ancho de la pantalla para que el SVG sea responsivo
const { width } = Dimensions.get('window');

export default function AuthHeader() {
 ;return (
   <View style={styles.header}>
           <Svg height="350" width={width} style={styles.headerSvg}>
             {/* Fondo coral */}
             <Rect x="0" y="0" width={width} height="1080" fill="#FF7B7B" />
   
             {/* Formas decorativas */}
             <Circle cx="30" cy="30" r="15" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
             <Circle cx="70" cy="70" r="8" fill="white" opacity="0.3" />
             <Circle cx="50" cy="120" r="20" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
   
             {/* Triángulos y formas geométricas */}
             <Path d="M 80 40 L 90 60 L 70 60 Z" fill="white" opacity="0.3" />
             <Path d="M 150 90 L 165 110 L 135 110 Z" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
   
             {/* Círculos adicionales */}
             <Circle cx={width - 40} cy="50" r="25" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
             <Circle cx={width - 80} cy="100" r="12" fill="white" opacity="0.3" />
             <Circle cx={width - 120} cy="60" r="18" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
   
             {/* Formas geométricas adicionales */}
             <Rect x={width - 150} y="120" width="20" height="20" stroke="white" strokeWidth="2" fill="none" opacity="0.3" rotation="45" />
             <Circle cx="100" cy="150" r="10" fill="white" opacity="0.3" />
{/* Ola blanca que empieza bajando, luego sube y vuelve a bajar */}
<Path
  d={`
    M 0 130
    C ${width * 0.3} 200, ${width * 0.7} 70, ${width * 0.85} 250
    S ${width * 1.3} 200, ${width} 180
    L ${width} 350
    L 0 350
    Z
  `}
  fill="white"
/>


      {/* Formas decorativas */}
      <Circle cx="30" cy="60" r="15" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
      <Circle cx="70" cy="70" r="8" fill="white" opacity="0.3" />
      <Circle cx="50" cy="120" r="20" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />


      {/* Círculos adicionales */}
      <Circle cx={width - 20} cy="190" r="25" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
      <Circle cx={width - 50} cy="120" r="12" fill="white" opacity="0.3" />
      <Circle cx={width - 120} cy="100" r="18" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />

      {/* Formas geométricas adicionales */}
      <Rect x={width - 150} y="120" width="20" height="20" stroke="white" strokeWidth="2" fill="none" opacity="0.3" rotation="45" />
      <Circle cx="100" cy="110" r="10" fill="white" opacity="0.3" />
      
      {/* Ola blanca que empieza bajando, luego sube y vuelve a bajar */}
      <Path
        d={`
          M 0 130
          C ${width * 0.3} 200, ${width * 0.7} 70, ${width * 0.85} 250
          S ${width * 1.3} 200, ${width} 180
          L ${width} 350
          L 0 350
          Z
        `}
        fill="white"
      />
    </Svg>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: "auto",
    position: 'relative',
  },
  headerSvg: {
    position: 'absolute',
    top: -90,
    left: 0,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backArrow: {
    fontSize: 36,
    color: 'white',
    fontWeight: '300',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginLeft: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000',
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  LoginButton: {
    backgroundColor: '#FF7B7B',
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 40,
    marginBottom: 20,
  },
});