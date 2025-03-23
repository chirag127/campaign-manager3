import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';
import {
  Text,
  Title,
  Card,
  Button,
  Switch,
  Divider,
  ActivityIndicator,
  Dialog,
  Portal,
  Paragraph
} from 'react-native-paper';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';

// Context
import { AuthContext } from '../../context/AuthContext';

// Config
import {
  API_URL,
  PLATFORM_AUTH_URLS,
  PLATFORM_CLIENT_IDS,
  PLATFORM_REDIRECT_URIS,
  PLATFORM_SCOPES
} from '../../config/api';

const PlatformConnectScreen = ({ route, navigation }) => {
  const { initialPlatform } = route.params || {};
  const { user, connectPlatform, disconnectPlatform, isLoading } = useContext(AuthContext);

  const [selectedPlatform, setSelectedPlatform] = useState(initialPlatform || null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Platform configurations
  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <FontAwesome name="facebook-square" size={24} color="#1877F2" />,
      color: '#1877F2',
      description: 'Connect to Facebook Ads to create and manage campaigns on Facebook.'
    },
    {
      id: 'google',
      name: 'Google',
      icon: <FontAwesome name="google" size={24} color="#DB4437" />,
      color: '#DB4437',
      description: 'Connect to Google Ads to create and manage campaigns on Google Search and Display Network.'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <FontAwesome name="youtube-play" size={24} color="#FF0000" />,
      color: '#FF0000',
      description: 'Connect to YouTube to create and manage video ad campaigns.'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <FontAwesome name="linkedin-square" size={24} color="#0A66C2" />,
      color: '#0A66C2',
      description: 'Connect to LinkedIn to create and manage B2B campaigns.'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <FontAwesome name="twitter-square" size={24} color="#1DA1F2" />,
      color: '#1DA1F2',
      description: 'Connect to Twitter to create and manage promoted tweets and campaigns.'
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      icon: <FontAwesome name="snapchat-square" size={24} color="#FFFC00" />,
      color: '#FFFC00',
      description: 'Connect to Snapchat to create and manage snap ad campaigns.'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <FontAwesome name="instagram" size={24} color="#E4405F" />,
      color: '#E4405F',
      description: 'Connect to Instagram to create and manage Instagram ad campaigns.'
    }
  ];

  // Check if platform is connected
  const isPlatformConnected = (platformId) => {
    return user?.connectedPlatforms?.[platformId] || false;
  };

  // Show confirmation dialog
  const showConfirmDialog = (action, platform) => {
    setSelectedPlatform(platform);
    setDialogAction(action);
    setDialogVisible(true);
  };

  // Handle platform connection
  const handleConnectPlatform = async (platform) => {
    try {
      setActionLoading(true);

      // Generate state parameter for OAuth security
      const state = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString()
      );

      // Build OAuth URL
      const authUrl = new URL(PLATFORM_AUTH_URLS[platform]);
      authUrl.searchParams.append('client_id', PLATFORM_CLIENT_IDS[platform]);
      authUrl.searchParams.append('redirect_uri', PLATFORM_REDIRECT_URIS[platform]);
      authUrl.searchParams.append('scope', PLATFORM_SCOPES[platform]);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('state', state);

      // Open browser for OAuth flow
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl.toString(),
        PLATFORM_REDIRECT_URIS[platform]
      );

      if (result.type === 'success') {
        // Extract auth code from URL
        const url = new URL(result.url);
        const code = url.searchParams.get('code');
        const returnedState = url.searchParams.get('state');

        // Verify state parameter
        if (state !== returnedState) {
          throw new Error('OAuth state mismatch. Possible CSRF attack.');
        }

        // Connect platform with auth code
        const connectResult = await connectPlatform(platform, code);

        if (connectResult.success) {
          Alert.alert(
            'Success',
            `Successfully connected to ${platforms.find(p => p.id === platform).name}`
          );
        } else {
          Alert.alert('Error', connectResult.message);
        }
      }
    } catch (error) {
      console.error('Platform connection error:', error);
      Alert.alert('Connection Error', `Failed to connect to ${platform}: ${error.message}`);
    } finally {
      setActionLoading(false);
      setDialogVisible(false);
    }
  };

  // Handle platform disconnection
  const handleDisconnectPlatform = async (platform) => {
    try {
      setActionLoading(true);

      const result = await disconnectPlatform(platform);

      if (result.success) {
        Alert.alert(
          'Success',
          `Successfully disconnected from ${platforms.find(p => p.id === platform).name}`
        );
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Platform disconnection error:', error);
      Alert.alert('Disconnection Error', `Failed to disconnect from ${platform}: ${error.message}`);
    } finally {
      setActionLoading(false);
      setDialogVisible(false);
    }
  };

  // Handle dialog action
  const handleDialogAction = () => {
    if (dialogAction === 'connect') {
      handleConnectPlatform(selectedPlatform);
    } else if (dialogAction === 'disconnect') {
      handleDisconnectPlatform(selectedPlatform);
    }
  };

  // Get dialog content based on action
  const getDialogContent = () => {
    const platform = platforms.find(p => p.id === selectedPlatform);

    if (!platform) {
      return {
        title: 'Error',
        content: 'Invalid platform selected.'
      };
    }

    if (dialogAction === 'connect') {
      return {
        title: `Connect to ${platform.name}`,
        content: `You'll be redirected to ${platform.name} to authorize access to your ad account. This will allow Campaign Manager to create and manage campaigns on your behalf.`
      };
    } else if (dialogAction === 'disconnect') {
      return {
        title: `Disconnect from ${platform.name}`,
        content: `Are you sure you want to disconnect from ${platform.name}? This will remove access to your ${platform.name} ad account and you won't be able to manage ${platform.name} campaigns until you reconnect.`
      };
    }

    return { title: '', content: '' };
  };

  const dialogContent = getDialogContent();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Connect Ad Platforms</Title>
        <Text style={styles.headerSubtitle}>
          Link your ad accounts to create and manage campaigns across multiple platforms
        </Text>
      </View>

      {platforms.map((platform) => (
        <Card key={platform.id} style={styles.platformCard}>
          <Card.Content>
            <View style={styles.platformHeader}>
              <View style={styles.platformInfo}>
                {platform.icon}
                <Text style={styles.platformName}>{platform.name}</Text>
              </View>
              <Switch
                value={isPlatformConnected(platform.id)}
                onValueChange={(value) => {
                  if (value) {
                    showConfirmDialog('connect', platform.id);
                  } else {
                    showConfirmDialog('disconnect', platform.id);
                  }
                }}
                color={platform.color}
              />
            </View>

            <Text style={styles.platformDescription}>
              {platform.description}
            </Text>

            {isPlatformConnected(platform.id) ? (
              <View style={styles.connectedInfo}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.connectedText}>Connected</Text>
              </View>
            ) : (
              <Button
                mode="outlined"
                onPress={() => showConfirmDialog('connect', platform.id)}
                style={styles.connectButton}
                color={platform.color}
              >
                Connect
              </Button>
            )}
          </Card.Content>
        </Card>
      ))}

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>{dialogContent.title}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{dialogContent.content}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={handleDialogAction}
              loading={actionLoading}
              disabled={actionLoading}
            >
              {dialogAction === 'connect' ? 'Connect' : 'Disconnect'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  platformCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  platformHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  platformDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  connectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedText: {
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '500',
  },
  connectButton: {
    alignSelf: 'flex-start',
  },
});

export default PlatformConnectScreen;
