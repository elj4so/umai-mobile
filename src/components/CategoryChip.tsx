import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

type CategoryChipProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

export default function CategoryChip({ label, isSelected, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isSelected ? styles.chipSelected : styles.chipNotSelected,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelNotSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    margin: 4,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipNotSelected: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.grey,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  labelSelected: {
    color: COLORS.white,
  },
  labelNotSelected: {
    color: COLORS.textSecondary,
  },
});