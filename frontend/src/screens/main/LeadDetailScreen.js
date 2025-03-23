import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Headline,
  Subheading,
  Card,
  Divider,
  ActivityIndicator,
  List,
  Portal,
  Dialog,
  Menu,
  IconButton,
  Caption,
  Chip
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../config/api';

const LeadDetailScreen = ({ route, navigation }) => {
  const { id, isNew } = route.params || {};
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'website',
    status: 'new',
    notes: '',
    campaign: '',
    tags: []
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(!isNew);
  const [formErrors, setFormErrors] = useState({});
  const [menuVisible, setMenuVisible] = useState(false);
  const [availableCampaigns, setAvailableCampaigns] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  
  // Lead sources
  const sources = [
    { id: 'facebook', name: 'Facebook', icon: 'logo-facebook', color: '#3b5998' },
    { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', color: '#e4405f' },
    { id: 'google', name: 'Google', icon: 'logo-google', color: '#4285F4' },
    { id: 'youtube', name: 'YouTube', icon: 'logo-youtube', color: '#FF0000' },
    { id: 'twitter', name: 'Twitter', icon: 'logo-twitter', color: '#1DA1F2' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'logo-linkedin', color: '#0077B5' },
    { id: 'website', name: 'Website', icon: 'globe-outline', color: '#2196F3' },
    { id: 'referral', name: 'Referral', icon: 'people-outline', color: '#4CAF50' },
    { id: 'other', name: 'Other', icon: 'ellipsis-horizontal', color: '#757575' }
  ];
  
  // Lead statuses
  const statuses = [
    { id: 'new', name: 'New', color: '#4CAF50' },
    { id: 'contacted', name: 'Contacted', color: '#2196F3' },
    { id: 'qualified', name: 'Qualified', color: '#FF9800' },
    { id: 'unqualified', name: 'Unqualified', color: '#F44336' },
    { id: 'converted', name: 'Converted', color: '#9C27B0' },
    { id: 'lost', name: 'Lost', color: '#757575' }
  ];

  // Set up header options
  useEffect(() => {
    navigation.setOptions({
      title: isNew ? 'Add Lead' : (route.params?.name || 'Lead Details'),
      headerRight: () => (
        isNew ? null : (
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                showActionDialog('delete');
              }}
              title="Delete Lead"
              leadingIcon="delete"
              titleStyle={{ color: '#F44336' }}
            />
          </Menu>
        )
      ),
    });
  }, [navigation, menuVisible, isNew, route.params?.name]);

  // Fetch lead data if editing
  useEffect(() => {
    if (!isNew && id) {
      fetchLeadDetails();
    }
    
    // Fetch available campaigns
    fetchCampaigns();
  }, [isNew, id]);

  // Fetch lead details for editing
  const fetchLeadDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/leads/${id}`);
      const lead = response.data.lead;
      
      // Update form data with lead data
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        source: lead.source || 'website',
        status: lead.status || 'new',
        notes: lead.notes || '',
        campaign: lead.campaign?._id || lead.campaign || '',
        tags: lead.tags || []
      });
    } catch (error) {
      console.error('Error fetching lead details:', error);
      Alert.alert('Error', 'Could not load lead details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch available campaigns
  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/campaigns`);
      setAvailableCampaigns(response.data.campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  // Input handlers
  const handleTextChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if exists
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
      setShowAddTag(false);
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    // Required fields
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Show action confirmation dialog
  const showActionDialog = (action) => {
    setDialogAction(action);
    setDialogVisible(true);
  };

  // Delete lead
  const deleteLead = async () => {
    try {
      await axios.delete(`${API_URL}/api/leads/${id}`);
      Alert.alert('Success', 'Lead deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting lead:', error);
      Alert.alert('Error', 'Failed to delete lead. Please try again.');
    } finally {
      setDialogVisible(false);
    }
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      let response;
      
      if (isNew) {
        // Create new lead
        response = await axios.post(
          `${API_URL}/api/leads`,
          formData
        );
        Alert.alert('Success', 'Lead created successfully');
      } else {
        // Update existing lead
        response = await axios.put(
          `${API_URL}/api/leads/${id}`,
          formData
        );
        Alert.alert('Success', 'Lead updated successfully');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error saving lead:', error);
      Alert.alert('Error', 'Failed to save lead. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get dialog content based on action
  const getDialogContent = () => {
    if (dialogAction === 'delete') {
      return {
        title: 'Delete Lead',
        content: 'Are you sure you want to delete this lead? This action cannot be undone.',
        confirmText: 'Delete',
        confirmColor: '#F44336'
      };
    }
    return {};
  };

  // Handle dialog action
  const handleDialogAction = () => {
    if (dialogAction === 'delete') {
      deleteLead();
    }
    setDialogVisible(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Headline style={styles.cardTitle}>Lead Information</Headline>
            
            <TextInput
              label="Name *"
              value={formData.name}
              onChangeText={(text) => handleTextChange('name', text)}
              style={styles.input}
              mode="outlined"
              error={!!formErrors.name}
            />
            {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
            
            <TextInput
              label="Email *"
              value={formData.email}
              onChangeText={(text) => handleTextChange('email', text)}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              error={!!formErrors.email}
            />
            {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
            
            <TextInput
              label="Phone"
              value={formData.phone}
              onChangeText={(text) => handleTextChange('phone', text)}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
            />
            
            <TextInput
              label="Company"
              value={formData.company}
              onChangeText={(text) => handleTextChange('company', text)}
              style={styles.input}
              mode="outlined"
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Headline style={styles.cardTitle}>Lead Details</Headline>
            
            <Text style={styles.label}>Source</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.source}
                onValueChange={(value) => handleTextChange('source', value)}
                style={styles.picker}
              >
                {sources.map(source => (
                  <Picker.Item 
                    key={source.id} 
                    label={source.name} 
                    value={source.id} 
                  />
                ))}
              </Picker>
            </View>
            
            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.status}
                onValueChange={(value) => handleTextChange('status', value)}
                style={styles.picker}
              >
                {statuses.map(status => (
                  <Picker.Item 
                    key={status.id} 
                    label={status.name} 
                    value={status.id} 
                  />
                ))}
              </Picker>
            </View>
            
            <Text style={styles.label}>Campaign</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.campaign}
                onValueChange={(value) => handleTextChange('campaign', value)}
                style={styles.picker}
              >
                <Picker.Item label="None" value="" />
                {availableCampaigns.map(campaign => (
                  <Picker.Item 
                    key={campaign._id} 
                    label={campaign.name} 
                    value={campaign._id} 
                  />
                ))}
              </Picker>
            </View>
            
            <TextInput
              label="Notes"
              value={formData.notes}
              onChangeText={(text) => handleTextChange('notes', text)}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={4}
            />
            
            <Text style={styles.label}>Tags</Text>
            <View style={styles.tagsContainer}>
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  onClose={() => removeTag(tag)}
                  style={styles.tag}
                >
                  {tag}
                </Chip>
              ))}
              
              {showAddTag ? (
                <View style={styles.addTagContainer}>
                  <TextInput
                    label="New Tag"
                    value={tagInput}
                    onChangeText={setTagInput}
                    style={styles.tagInput}
                    mode="outlined"
                    autoFocus
                    onSubmitEditing={addTag}
                  />
                  <Button
                    mode="contained"
                    onPress={addTag}
                    style={styles.addTagButton}
                  >
                    Add
                  </Button>
                  <Button
                    mode="text"
                    onPress={() => {
                      setShowAddTag(false);
                      setTagInput('');
                    }}
                  >
                    Cancel
                  </Button>
                </View>
              ) : (
                <Button
                  mode="outlined"
                  icon="plus"
                  onPress={() => setShowAddTag(true)}
                  style={styles.addButton}
                >
                  Add Tag
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            loading={isLoading}
          >
            {isNew ? 'Create Lead' : 'Update Lead'}
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
      
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>{getDialogContent().title}</Dialog.Title>
          <Dialog.Content>
            <Text>{getDialogContent().content}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button 
              onPress={handleDialogAction} 
              color={getDialogContent().confirmColor}
            >
              {getDialogContent().confirmText}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollContainer: {
    padding: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    marginBottom: 16
  },
  cardTitle: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 'bold'
  },
  input: {
    marginBottom: 12
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    marginBottom: 12
  },
  picker: {
    height: 50
  },
  errorText: {
    color: '#F44336',
    marginBottom: 8
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16
  },
  tag: {
    margin: 4
  },
  addTagContainer: {
    flexDirection: 'column',
    marginTop: 8,
    width: '100%'
  },
  tagInput: {
    marginBottom: 8
  },
  addTagButton: {
    marginBottom: 8
  },
  addButton: {
    margin: 4
  },
  buttonContainer: {
    marginBottom: 30
  },
  submitButton: {
    marginBottom: 12
  },
  cancelButton: {
    marginBottom: 12
  }
});

export default LeadDetailScreen;
