import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// This is a placeholder logo component
// In a real app, you would use an actual image file

const Logo = ({ size = 100, color = '#007BFF' }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Ionicons name="megaphone" size={size * 0.6} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    borderRadius: 50,
    padding: 15,
  },
});

export default Logo;
