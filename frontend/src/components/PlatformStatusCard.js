import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';

const PlatformStatusCard = ({ platform, isConnected, onConnect }) => {
  // Platform-specific configurations
  const platformConfig = {
    facebook: {
      name: 'Facebook',
      icon: <FontAwesome name="facebook-square" size={24} color="#1877F2" />,
      color: '#1877F2'
    },
    google: {
      name: 'Google',
      icon: <FontAwesome name="google" size={24} color="#DB4437" />,
      color: '#DB4437'
    },
    youtube: {
      name: 'YouTube',
      icon: <FontAwesome name="youtube-play" size={24} color="#FF0000" />,
      color: '#FF0000'
    },
    linkedin: {
      name: 'LinkedIn',
      icon: <FontAwesome name="linkedin-square" size={24} color="#0A66C2" />,
      color: '#0A66C2'
    },
    twitter: {
      name: 'Twitter',
      icon: <FontAwesome name="twitter-square" size={24} color="#1DA1F2" />,
      color: '#1DA1F2'
    },
    snapchat: {
      name: 'Snapchat',
      icon: <FontAwesome name="snapchat-square" size={24} color="#FFFC00" />,
      color: '#FFFC00'
    },
    instagram: {
      name: 'Instagram',
      icon: <FontAwesome name="instagram" size={24} color="#E4405F" />,
      color: '#E4405F'
    }
  };

  const config = platformConfig[platform] || {
    name: platform,
    icon: <FontAwesome name="question-circle" size={24} color="#999" />,
    color: '#999'
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onConnect}
      disabled={isConnected}
    >
      <Surface style={[
        styles.card,
        isConnected ? styles.connectedCard : styles.disconnectedCard
      ]}>
        <View style={styles.iconContainer}>
          {config.icon}
        </View>
        <Text style={styles.platformName}>{config.name}</Text>
        <View style={styles.statusContainer}>
          {isConnected ? (
            <View style={styles.statusConnected}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.statusTextConnected}>Connected</Text>
            </View>
          ) : (
            <View style={styles.statusDisconnected}>
              <Ionicons name="add-circle" size={16} color="#007BFF" />
              <Text style={styles.statusTextDisconnected}>Connect</Text>
            </View>
          )}
        </View>
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 10,
  },
  card: {
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  connectedCard: {
    backgroundColor: '#f5f5f5',
  },
  disconnectedCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  iconContainer: {
    marginBottom: 8,
  },
  platformName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusConnected: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDisconnected: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTextConnected: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  statusTextDisconnected: {
    fontSize: 12,
    color: '#007BFF',
    marginLeft: 4,
  },
});

export default PlatformStatusCard;
