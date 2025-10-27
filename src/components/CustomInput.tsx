import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Usaremos Feather icons
import { COLORS } from '../constants/colors';

type CustomInputProps = {
  iconName: React.ComponentProps<typeof Feather>['name'];
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  isPassword?: boolean;
};

export default function CustomInput({
  iconName,
  placeholder,
  value,
  onChangeText,
  isPassword = false,
}: CustomInputProps) {
  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={styles.container}>
      <Feather name={iconName} size={20} color={COLORS.textSecondary} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        autoCapitalize="none"
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Feather name={secure ? 'eye-off' : 'eye'} size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7', // Un gris muy claro
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
});