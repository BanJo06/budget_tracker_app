import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet } from 'react-native';

const generatedIcons = ({ name, size = 24, color = 'black', style }) => {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      style={[styles.icon, style]}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 8,
  },
});

export default generatedIcons;