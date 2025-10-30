import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* Decorative Header */}
      <View style={styles.header}>
        <View style={styles.decorativePattern} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo/Brand */}
        <Text style={styles.logo}>UMAI</Text>

        {/* Title */}
        <Text style={styles.title}>Iniciar Sesión</Text>

        {/* Email Field */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <Mail size={16} color="#000" />
            <Text style={styles.label}>Correo Electrónico</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su correo electrónico"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Field */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <Lock size={16} color="#000" />
            <Text style={styles.label}>Contraseña</Text>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Ingrese su contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? (
                <EyeOff size={20} color="#999" />
              ) : (
                <Eye size={20} color="#999" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 200,
    backgroundColor: '#FF7B7B',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 150,
    overflow: 'hidden',
  },
  decorativePattern: {
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  logo: {
    fontSize: 64,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 32,
    color: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
    color: '#000',
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 12,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000',
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    backgroundColor: '#FF8B8B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 120,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#000',
  },
  linkText: {
    fontSize: 14,
    color: '#FF7B7B',
    fontWeight: '600',
  },
});