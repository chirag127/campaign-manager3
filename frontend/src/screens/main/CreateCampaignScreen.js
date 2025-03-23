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
  Chip,
  Card,
  Divider,
  Switch,
  HelperText,
  Portal,
  Dialog,
  ProgressBar,
  RadioButton,
  List
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
// Using Button and Alert for date selection instead of DateTimePicker
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../config/api';

const CreateCampaignScreen = ({ route, navigation }) => {
  const { campaignId, isEditing } = route.params || {};

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    objective: 'awareness',
    budget: '',
    targetAudience: {
      ageRange: { min: 18, max: 65 },
      gender: 'all',
      interests: [],
      locations: []
    },
    platforms: [],
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    adCreatives: {
      headline: '',
      description: '',
      images: [],
      videos: []
    }
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  // Simplified date handling without DateTimePicker
  const [interestInput, setInterestInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [availablePlatforms, setAvailablePlatforms] = useState([
    { id: 'facebook', name: 'Facebook', icon: 'logo-facebook', color: '#3b5998' },
    { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', color: '#e4405f' },
    { id: 'google', name: 'Google Ads', icon: 'logo-google', color: '#4285F4' },
    { id: 'youtube', name: 'YouTube', icon: 'logo-youtube', color: '#FF0000' },
    { id: 'twitter', name: 'Twitter', icon: 'logo-twitter', color: '#1DA1F2' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'logo-linkedin', color: '#0077B5' },
    { id: 'snapchat', name: 'Snapchat', icon: 'logo-snapchat', color: '#FFFC00' }
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [confirmDialog, setConfirmDialog] = useState(false);

  // Campaign objectives
  const campaignObjectives = [
    { id: 'awareness', name: 'Brand Awareness' },
    { id: 'consideration', name: 'Consideration' },
    { id: 'conversion', name: 'Conversion' },
    { id: 'traffic', name: 'Website Traffic' },
    { id: 'leads', name: 'Lead Generation' },
    { id: 'engagement', name: 'Engagement' }
  ];

  // Fetch campaign data if editing
  useEffect(() => {
    if (isEditing && campaignId) {
      fetchCampaignDetails();
    }

    // Set the screen title
    navigation.setOptions({
      title: isEditing ? 'Edit Campaign' : 'Create Campaign'
    });
  }, [isEditing, campaignId]);

  // Fetch campaign details for editing
  const fetchCampaignDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/campaigns/${campaignId}`);
      const campaign = response.data.campaign;

      // Update form data with campaign data
      setFormData({
        name: campaign.name,
        description: campaign.description,
        objective: campaign.objective,
        budget: campaign.budget.toString(),
        targetAudience: {
          ageRange: campaign.targetAudience.ageRange,
          gender: campaign.targetAudience.gender,
          interests: campaign.targetAudience.interests,
          locations: campaign.targetAudience.locations
        },
        platforms: campaign.platforms,
        startDate: new Date(campaign.startDate),
        endDate: new Date(campaign.endDate),
        adCreatives: {
          headline: campaign.adCreatives.headline,
          description: campaign.adCreatives.description,
          images: campaign.adCreatives.images || [],
          videos: campaign.adCreatives.videos || []
        }
      });
    } catch (error) {
      console.error('Error fetching campaign details:', error);
      Alert.alert('Error', 'Could not load campaign details. Please try again.');
    } finally {
      setIsLoading(false);
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

  const handleNestedTextChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));

    // Clear error for this field if exists
    if (formErrors[`${parent}.${field}`]) {
      setFormErrors(prev => ({
        ...prev,
        [`${parent}.${field}`]: null
      }));
    }
  };

  // Simplified date handling functions
  const handleStartDateChange = () => {
    // For simplicity, just add 1 day to the current start date
    const newDate = new Date(formData.startDate);
    newDate.setDate(newDate.getDate() + 1);
    setFormData(prev => ({
      ...prev,
      startDate: newDate
    }));
  };

  const handleEndDateChange = () => {
    // For simplicity, just add 1 day to the current end date
    const newDate = new Date(formData.endDate);
    newDate.setDate(newDate.getDate() + 1);
    setFormData(prev => ({
      ...prev,
      endDate: newDate
    }));
  };

  const togglePlatform = (platformId) => {
    setFormData(prev => {
      const isPlatformSelected = prev.platforms.includes(platformId);

      if (isPlatformSelected) {
        // Remove platform
        return {
          ...prev,
          platforms: prev.platforms.filter(id => id !== platformId)
        };
      } else {
        // Add platform
        return {
          ...prev,
          platforms: [...prev.platforms, platformId]
        };
      }
    });
  };

  const addInterest = () => {
    if (interestInput.trim()) {
      setFormData(prev => ({
        ...prev,
        targetAudience: {
          ...prev.targetAudience,
          interests: [...prev.targetAudience.interests, interestInput.trim()]
        }
      }));
      setInterestInput('');
    }
  };

  const removeInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        interests: prev.targetAudience.interests.filter(item => item !== interest)
      }
    }));
  };

  const addLocation = () => {
    if (locationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        targetAudience: {
          ...prev.targetAudience,
          locations: [...prev.targetAudience.locations, locationInput.trim()]
        }
      }));
      setLocationInput('');
    }
  };

  const removeLocation = (location) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        locations: prev.targetAudience.locations.filter(item => item !== location)
      }
    }));
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    // Required fields
    if (!formData.name.trim()) {
      errors.name = 'Campaign name is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Campaign description is required';
    }

    if (!formData.budget || isNaN(Number(formData.budget))) {
      errors.budget = 'Valid budget amount is required';
    }

    if (formData.platforms.length === 0) {
      errors.platforms = 'At least one platform must be selected';
    }

    if (formData.targetAudience.locations.length === 0) {
      errors['targetAudience.locations'] = 'At least one location is required';
    }

    if (!formData.adCreatives.headline.trim()) {
      errors['adCreatives.headline'] = 'Ad headline is required';
    }

    if (!formData.adCreatives.description.trim()) {
      errors['adCreatives.description'] = 'Ad description is required';
    }

    // Validate dates
    if (formData.startDate >= formData.endDate) {
      errors.dates = 'End date must be after start date';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form.');
      return;
    }

    setIsLoading(true);

    try {
      let response;

      if (isEditing) {
        // Update existing campaign
        response = await axios.put(
          `${API_URL}/api/campaigns/${campaignId}`,
          formData
        );
        Alert.alert('Success', 'Campaign updated successfully');
      } else {
        // Create new campaign
        response = await axios.post(
          `${API_URL}/api/campaigns`,
          formData
        );
        Alert.alert('Success', 'Campaign created successfully');
      }

      // Navigate to campaign detail screen
      navigation.replace('CampaignDetail', {
        id: isEditing ? campaignId : response.data.campaign._id,
        name: formData.name,
        initialAction: !isEditing ? 'launch' : null  // Prompt to launch if new campaign
      });
    } catch (error) {
      console.error('Error saving campaign:', error);
      Alert.alert('Error', 'Failed to save campaign. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation between form steps
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Render form step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Headline style={styles.stepTitle}>Campaign Details</Headline>

            <TextInput
              label="Campaign Name *"
              value={formData.name}
              onChangeText={(text) => handleTextChange('name', text)}
              style={styles.input}
              mode="outlined"
              error={!!formErrors.name}
            />
            {formErrors.name && <HelperText type="error">{formErrors.name}</HelperText>}

            <TextInput
              label="Description *"
              value={formData.description}
              onChangeText={(text) => handleTextChange('description', text)}
              style={styles.input}
              multiline
              numberOfLines={3}
              mode="outlined"
              error={!!formErrors.description}
            />
            {formErrors.description && <HelperText type="error">{formErrors.description}</HelperText>}

            <Text style={styles.label}>Campaign Objective *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.objective}
                onValueChange={(value) => handleTextChange('objective', value)}
                style={styles.picker}
              >
                {campaignObjectives.map(objective => (
                  <Picker.Item
                    key={objective.id}
                    label={objective.name}
                    value={objective.id}
                  />
                ))}
              </Picker>
            </View>

            <TextInput
              label="Budget (USD) *"
              value={formData.budget}
              onChangeText={(text) => handleTextChange('budget', text)}
              style={styles.input}
              keyboardType="numeric"
              mode="outlined"
              error={!!formErrors.budget}
            />
            {formErrors.budget && <HelperText type="error">{formErrors.budget}</HelperText>}

            <Text style={styles.label}>Campaign Duration *</Text>
            <View style={styles.dateContainer}>
              <Button
                mode="outlined"
                onPress={handleStartDateChange}
                style={styles.dateButton}
              >
                Start: {formData.startDate.toLocaleDateString()} (Click to change)
              </Button>

              <Button
                mode="outlined"
                onPress={handleEndDateChange}
                style={styles.dateButton}
              >
                End: {formData.endDate.toLocaleDateString()} (Click to change)
              </Button>
            </View>
            {formErrors.dates && <HelperText type="error">{formErrors.dates}</HelperText>}
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Headline style={styles.stepTitle}>Target Audience</Headline>

            <Text style={styles.label}>Age Range</Text>
            <View style={styles.rangeContainer}>
              <View style={styles.pickerContainerSmall}>
                <Text>Min Age:</Text>
                <Picker
                  selectedValue={formData.targetAudience.ageRange.min}
                  onValueChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      targetAudience: {
                        ...prev.targetAudience,
                        ageRange: {
                          ...prev.targetAudience.ageRange,
                          min: value
                        }
                      }
                    }));
                  }}
                  style={styles.pickerSmall}
                >
                  {Array.from({ length: 63 }, (_, i) => i + 13).map(age => (
                    <Picker.Item key={age} label={age.toString()} value={age} />
                  ))}
                </Picker>
              </View>

              <View style={styles.pickerContainerSmall}>
                <Text>Max Age:</Text>
                <Picker
                  selectedValue={formData.targetAudience.ageRange.max}
                  onValueChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      targetAudience: {
                        ...prev.targetAudience,
                        ageRange: {
                          ...prev.targetAudience.ageRange,
                          max: value
                        }
                      }
                    }));
                  }}
                  style={styles.pickerSmall}
                >
                  {Array.from({ length: 63 }, (_, i) => i + 13).map(age => (
                    <Picker.Item key={age} label={age.toString()} value={age} />
                  ))}
                </Picker>
              </View>
            </View>

            <Text style={styles.label}>Gender</Text>
            <RadioButton.Group
              onValueChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  targetAudience: {
                    ...prev.targetAudience,
                    gender: value
                  }
                }));
              }}
              value={formData.targetAudience.gender}
            >
              <View style={styles.radioGroup}>
                <View style={styles.radioButton}>
                  <RadioButton value="all" />
                  <Text>All</Text>
                </View>

                <View style={styles.radioButton}>
                  <RadioButton value="male" />
                  <Text>Male</Text>
                </View>

                <View style={styles.radioButton}>
                  <RadioButton value="female" />
                  <Text>Female</Text>
                </View>
              </View>
            </RadioButton.Group>

            <Text style={styles.label}>Interests</Text>
            <View style={styles.inputWithButton}>
              <TextInput
                label="Add Interest"
                value={interestInput}
                onChangeText={setInterestInput}
                style={styles.inputFlex}
                mode="outlined"
              />
              <Button mode="contained" onPress={addInterest} style={styles.addButton}>
                Add
              </Button>
            </View>
            <View style={styles.chipsContainer}>
              {formData.targetAudience.interests.map((interest, index) => (
                <Chip
                  key={index}
                  onClose={() => removeInterest(interest)}
                  style={styles.chip}
                >
                  {interest}
                </Chip>
              ))}
            </View>

            <Text style={styles.label}>Locations *</Text>
            <View style={styles.inputWithButton}>
              <TextInput
                label="Add Location"
                value={locationInput}
                onChangeText={setLocationInput}
                style={styles.inputFlex}
                mode="outlined"
                error={!!formErrors['targetAudience.locations']}
              />
              <Button mode="contained" onPress={addLocation} style={styles.addButton}>
                Add
              </Button>
            </View>
            {formErrors['targetAudience.locations'] && (
              <HelperText type="error">{formErrors['targetAudience.locations']}</HelperText>
            )}
            <View style={styles.chipsContainer}>
              {formData.targetAudience.locations.map((location, index) => (
                <Chip
                  key={index}
                  onClose={() => removeLocation(location)}
                  style={styles.chip}
                >
                  {location}
                </Chip>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Headline style={styles.stepTitle}>Platforms & Creatives</Headline>

            <Text style={styles.label}>Select Platforms *</Text>
            {formErrors.platforms && <HelperText type="error">{formErrors.platforms}</HelperText>}

            <View style={styles.platformsContainer}>
              {availablePlatforms.map((platform) => (
                <Card
                  key={platform.id}
                  style={[
                    styles.platformCard,
                    formData.platforms.includes(platform.id) && styles.platformCardSelected
                  ]}
                  onPress={() => togglePlatform(platform.id)}
                >
                  <Card.Content style={styles.platformCardContent}>
                    <Ionicons name={platform.icon} size={24} color={platform.color} />
                    <Text style={styles.platformName}>{platform.name}</Text>
                    {formData.platforms.includes(platform.id) && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                  </Card.Content>
                </Card>
              ))}
            </View>

            <Divider style={styles.divider} />

            <Text style={styles.label}>Ad Creatives</Text>

            <TextInput
              label="Headline *"
              value={formData.adCreatives.headline}
              onChangeText={(text) => handleNestedTextChange('adCreatives', 'headline', text)}
              style={styles.input}
              mode="outlined"
              error={!!formErrors['adCreatives.headline']}
            />
            {formErrors['adCreatives.headline'] && (
              <HelperText type="error">{formErrors['adCreatives.headline']}</HelperText>
            )}

            <TextInput
              label="Description *"
              value={formData.adCreatives.description}
              onChangeText={(text) => handleNestedTextChange('adCreatives', 'description', text)}
              style={styles.input}
              multiline
              numberOfLines={3}
              mode="outlined"
              error={!!formErrors['adCreatives.description']}
            />
            {formErrors['adCreatives.description'] && (
              <HelperText type="error">{formErrors['adCreatives.description']}</HelperText>
            )}

            <Button
              mode="outlined"
              icon="image"
              onPress={() => Alert.alert('Coming Soon', 'Image upload functionality will be available soon.')}
              style={styles.mediaButton}
            >
              Upload Images
            </Button>

            <Button
              mode="outlined"
              icon="video"
              onPress={() => Alert.alert('Coming Soon', 'Video upload functionality will be available soon.')}
              style={styles.mediaButton}
            >
              Upload Videos
            </Button>
          </View>
        );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading && <ProgressBar indeterminate />}

        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          {[1, 2, 3].map((step) => (
            <View
              key={step}
              style={[
                styles.stepDot,
                currentStep === step ? styles.activeStepDot : null,
                currentStep > step ? styles.completedStepDot : null
              ]}
            />
          ))}
        </View>

        {renderStep()}

        {/* Navigation buttons */}
        <View style={styles.navigationButtons}>
          {currentStep > 1 && (
            <Button
              mode="outlined"
              onPress={prevStep}
              style={styles.navButton}
            >
              Previous
            </Button>
          )}

          {currentStep < 3 ? (
            <Button
              mode="contained"
              onPress={nextStep}
              style={styles.navButton}
            >
              Next
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={() => setConfirmDialog(true)}
              style={styles.navButton}
              disabled={isLoading}
            >
              {isEditing ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          )}
        </View>
      </ScrollView>

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={confirmDialog} onDismiss={() => setConfirmDialog(false)}>
          <Dialog.Title>Confirm {isEditing ? 'Update' : 'Creation'}</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to {isEditing ? 'update' : 'create'} this campaign?
              {!isEditing && ' It will initially be saved as a draft.'}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDialog(false)}>Cancel</Button>
            <Button onPress={() => {
              setConfirmDialog(false);
              handleSubmit();
            }}>Confirm</Button>
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5
  },
  activeStepDot: {
    backgroundColor: '#2196F3',
    width: 12,
    height: 12
  },
  completedStepDot: {
    backgroundColor: '#4CAF50'
  },
  stepContainer: {
    marginBottom: 20
  },
  stepTitle: {
    marginBottom: 15,
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
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  dateButton: {
    width: '48%'
  },
  rangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  pickerContainerSmall: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4
  },
  pickerSmall: {
    height: 40
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 12
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  inputFlex: {
    flex: 1,
    marginRight: 8
  },
  addButton: {
    height: 50,
    justifyContent: 'center'
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  chip: {
    margin: 4
  },
  platformsContainer: {
    marginBottom: 16
  },
  platformCard: {
    marginBottom: 8
  },
  platformCardSelected: {
    borderWidth: 2,
    borderColor: '#4CAF50'
  },
  platformCardContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  platformName: {
    marginLeft: 12,
    flex: 1
  },
  divider: {
    marginVertical: 16
  },
  mediaButton: {
    marginVertical: 8
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 30
  },
  navButton: {
    width: '45%'
  }
});

export default CreateCampaignScreen;
