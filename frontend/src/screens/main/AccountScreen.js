import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  List,
  Divider,
  Button,
  TextInput,
  Title,
  Subheading,
  ActivityIndicator,
  Switch,
  Portal,
  Dialog,
  Caption
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { AuthContext } from '../../context/AuthContext';

const AccountScreen = ({ navigation }) => {
  const { userToken, user, logout, updateUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    campaignAlerts: true,
    leadNotifications: true,
    weeklyReports: true,
    marketingUpdates: false
  });

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: 'logo-facebook', color: '#3b5998' },
    { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', color: '#e4405f' },
    { id: 'google', name: 'Google Ads', icon: 'logo-google', color: '#4285F4' },
    { id: 'youtube', name: 'YouTube', icon: 'logo-youtube', color: '#FF0000' },
    { id: 'twitter', name: 'Twitter', icon: 'logo-twitter', color: '#1DA1F2' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'logo-linkedin', color: '#0077B5' },
    { id: 'snapchat', name: 'Snapchat', icon: 'logo-snapchat', color: '#FFFC00' }
  ];

  // Set user data when available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        company: user.company || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Set notification settings if available
      if (user.preferences && user.preferences.notifications) {
        setNotificationSettings(user.preferences.notifications);
      }
    }
  }, [user]);

  const handleTextChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordTextChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field if exists
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const toggleNotification = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const saveProfile = async () => {
    setIsLoading(true);

    try {
      const response = await axios.put(
        `${API_URL}/api/users/profile`,
        {
          name: formData.name,
          company: formData.company,
          phone: formData.phone,
          preferences: {
            notifications: notificationSettings
          }
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );

      updateUser(response.data.user);
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await axios.put(
        `${API_URL}/api/users/password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );

      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setPasswordDialogVisible(false);
      Alert.alert('Success', 'Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      
      if (error.response && error.response.status === 401) {
        setPasswordErrors({
          currentPassword: 'Current password is incorrect'
        });
      } else {
        Alert.alert('Error', 'Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: logout
        }
      ]
    );
  };

  // Get connection status for a specific platform
  const getPlatformStatus = (platformId) => {
    if (!user || !user.connectedPlatforms) {
      return false;
    }
    
    return user.connectedPlatforms[platformId]?.connected || false;
  };

  // Format last connection date
  const getLastConnectedDate = (platformId) => {
    if (!user || !user.connectedPlatforms || !user.connectedPlatforms[platformId]) {
      return null;
    }
    
    const connectedAt = user.connectedPlatforms[platformId].connectedAt;
    return connectedAt ? new Date(connectedAt).toLocaleDateString() : null;
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Avatar.Text 
            size={80} 
            label={user?.name?.charAt(0) || 'U'} 
            style={styles.avatar}
          />
          
          <View style={styles.profileInfo}>
            {editMode ? (
              <TextInput
                label="Name"
                value={formData.name}
                onChangeText={(text) => handleTextChange('name', text)}
                style={styles.input}
                mode="outlined"
              />
            ) : (
              <Title>{user?.name || 'User'}</Title>
            )}
            
            <Subheading>{user?.email}</Subheading>
            
            {!editMode && (
              <Button 
                mode="contained" 
                onPress={() => setEditMode(true)}
                style={styles.editButton}
              >
                Edit Profile
              </Button>
            )}
          </View>
        </View>
        
        {editMode && (
          <Card.Content style={styles.editForm}>
            <TextInput
              label="Company"
              value={formData.company}
              onChangeText={(text) => handleTextChange('company', text)}
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Phone"
              value={formData.phone}
              onChangeText={(text) => handleTextChange('phone', text)}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
            />
            
            <View style={styles.buttonRow}>
              <Button 
                mode="contained" 
                onPress={saveProfile}
                style={[styles.button, styles.saveButton]}
                loading={isLoading}
                disabled={isLoading}
              >
                Save
              </Button>
              
              <Button 
                mode="outlined" 
                onPress={() => setEditMode(false)}
                style={styles.button}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </View>
          </Card.Content>
        )}
      </Card>
      
      <Card style={styles.card}>
        <Card.Title title="Connected Platforms" />
        <Card.Content>
          <List.Section>
            {platforms.map((platform) => (
              <List.Item
                key={platform.id}
                title={platform.name}
                description={
                  getPlatformStatus(platform.id) 
                    ? `Connected since ${getLastConnectedDate(platform.id) || 'N/A'}`
                    : 'Not connected'
                }
                left={props => (
                  <View style={[props.style, styles.platformIcon]}>
                    <Ionicons name={platform.icon} size={24} color={platform.color} />
                  </View>
                )}
                right={props => (
                  <View style={[props.style, styles.statusContainer]}>
                    {getPlatformStatus(platform.id) ? (
                      <Caption style={styles.connectedText}>Connected</Caption>
                    ) : (
                      <Button 
                        mode="outlined" 
                        compact
                        onPress={() => navigation.navigate('PlatformConnect', { platformId: platform.id })}
                      >
                        Connect
                      </Button>
                    )}
                  </View>
                )}
              />
            ))}
          </List.Section>
          
          <Button 
            mode="outlined"
            onPress={() => navigation.navigate('PlatformConnect')}
            style={styles.platformsButton}
          >
            Manage All Platforms
          </Button>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Title title="Notification Settings" />
        <Card.Content>
          <List.Item
            title="Email Notifications"
            description="Receive notifications via email"
            right={() => (
              <Switch
                value={notificationSettings.emailNotifications}
                onValueChange={() => toggleNotification('emailNotifications')}
              />
            )}
          />
          <Divider />
          
          <List.Item
            title="Campaign Alerts"
            description="Get alerts about your campaign performance"
            right={() => (
              <Switch
                value={notificationSettings.campaignAlerts}
                onValueChange={() => toggleNotification('campaignAlerts')}
              />
            )}
          />
          <Divider />
          
          <List.Item
            title="Lead Notifications"
            description="Be notified when new leads are generated"
            right={() => (
              <Switch
                value={notificationSettings.leadNotifications}
                onValueChange={() => toggleNotification('leadNotifications')}
              />
            )}
          />
          <Divider />
          
          <List.Item
            title="Weekly Reports"
            description="Receive weekly performance summaries"
            right={() => (
              <Switch
                value={notificationSettings.weeklyReports}
                onValueChange={() => toggleNotification('weeklyReports')}
              />
            )}
          />
          <Divider />
          
          <List.Item
            title="Marketing Updates"
            description="Get updates about new features and offers"
            right={() => (
              <Switch
                value={notificationSettings.marketingUpdates}
                onValueChange={() => toggleNotification('marketingUpdates')}
              />
            )}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Title title="Security" />
        <Card.Content>
          <Button 
            mode="outlined"
            onPress={() => setPasswordDialogVisible(true)}
            style={styles.securityButton}
            icon="lock"
          >
            Change Password
          </Button>
        </Card.Content>
      </Card>
      
      <Button 
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        icon="logout"
        color="#F44336"
      >
        Log Out
      </Button>
      
      <Portal>
        <Dialog visible={passwordDialogVisible} onDismiss={() => setPasswordDialogVisible(false)}>
          <Dialog.Title>Change Password</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Current Password"
              value={formData.currentPassword}
              onChangeText={(text) => handlePasswordTextChange('currentPassword', text)}
              style={styles.input}
              mode="outlined"
              secureTextEntry
              error={!!passwordErrors.currentPassword}
            />
            {passwordErrors.currentPassword && (
              <Text style={styles.errorText}>{passwordErrors.currentPassword}</Text>
            )}
            
            <TextInput
              label="New Password"
              value={formData.newPassword}
              onChangeText={(text) => handlePasswordTextChange('newPassword', text)}
              style={styles.input}
              mode="outlined"
              secureTextEntry
              error={!!passwordErrors.newPassword}
            />
            {passwordErrors.newPassword && (
              <Text style={styles.errorText}>{passwordErrors.newPassword}</Text>
            )}
            
            <TextInput
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChangeText={(text) => handlePasswordTextChange('confirmPassword', text)}
              style={styles.input}
              mode="outlined"
              secureTextEntry
              error={!!passwordErrors.confirmPassword}
            />
            {passwordErrors.confirmPassword && (
              <Text style={styles.errorText}>{passwordErrors.confirmPassword}</Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPasswordDialogVisible(false)}>Cancel</Button>
            <Button onPress={changePassword} loading={isLoading} disabled={isLoading}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  profileCard: {
    margin: 16,
    elevation: 4
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center'
  },
  avatar: {
    marginRight: 16,
    backgroundColor: '#2196F3'
  },
  profileInfo: {
    flex: 1
  },
  editButton: {
    marginTop: 8,
    alignSelf: 'flex-start'
  },
  editForm: {
    paddingTop: 8,
    paddingBottom: 16
  },
  input: {
    marginBottom: 12
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    flex: 1,
    marginHorizontal: 4
  },
  saveButton: {
    backgroundColor: '#4CAF50'
  },
  card: {
    margin: 16,
    marginTop: 0,
    elevation: 4
  },
  platformIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  statusContainer: {
    justifyContent: 'center'
  },
  connectedText: {
    color: '#4CAF50'
  },
  platformsButton: {
    marginTop: 8
  },
  securityButton: {
    marginVertical: 8
  },
  logoutButton: {
    margin: 16,
    marginBottom: 30
  },
  errorText: {
    color: '#F44336',
    marginBottom: 8
  }
});

export default AccountScreen;
