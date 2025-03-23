import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateCampaignScreen from '../screens/main/CreateCampaignScreen';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');
// No need to mock DateTimePicker as we're not using it anymore
jest.mock('@react-native-picker/picker', () => ({
  Picker: 'Picker'
}));
jest.mock('react-native-paper', () => {
  const RealComponent = jest.requireActual('react-native-paper');
  return {
    ...RealComponent,
    Portal: ({ children }) => children,
    Dialog: {
      ...RealComponent.Dialog,
      Actions: ({ children }) => <>{children}</>,
      Content: ({ children }) => <>{children}</>,
      Title: ({ children }) => <>{children}</>
    }
  };
});

describe('CreateCampaignScreen', () => {
  const mockNavigation = {
    setOptions: jest.fn(),
    navigate: jest.fn(),
    replace: jest.fn()
  };

  const mockRoute = {
    params: {}
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock axios.post for campaign creation
    axios.post.mockResolvedValue({
      data: {
        campaign: {
          _id: 'new-campaign-id',
          name: 'Test Campaign'
        }
      }
    });
  });

  it('renders correctly in create mode', () => {
    const { getByText } = render(
      <CreateCampaignScreen route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText('Campaign Details')).toBeTruthy();
    expect(getByText('Create Campaign')).toBeTruthy();
  });

  it('navigates through form steps', () => {
    const { getByText } = render(
      <CreateCampaignScreen route={mockRoute} navigation={mockNavigation} />
    );

    // First step
    expect(getByText('Campaign Details')).toBeTruthy();

    // Navigate to second step
    fireEvent.press(getByText('Next'));
    expect(getByText('Target Audience')).toBeTruthy();

    // Navigate to third step
    fireEvent.press(getByText('Next'));
    expect(getByText('Platforms & Creatives')).toBeTruthy();

    // Navigate back to second step
    fireEvent.press(getByText('Previous'));
    expect(getByText('Target Audience')).toBeTruthy();
  });

  it('shows validation errors when submitting empty form', async () => {
    const { getByText, getAllByText } = render(
      <CreateCampaignScreen route={mockRoute} navigation={mockNavigation} />
    );

    // Navigate to last step
    fireEvent.press(getByText('Next'));
    fireEvent.press(getByText('Next'));

    // Try to submit the form
    fireEvent.press(getByText('Create Campaign'));

    // Confirm dialog appears
    expect(getByText('Confirm Creation')).toBeTruthy();

    // Confirm submission
    fireEvent.press(getAllByText('Confirm')[0]);

    // Wait for validation to complete
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it('submits form with valid data', async () => {
    const { getByText, getByPlaceholderText, getAllByText } = render(
      <CreateCampaignScreen route={mockRoute} navigation={mockNavigation} />
    );

    // Fill out first step
    const nameInput = getByPlaceholderText('Campaign Name *');
    const descriptionInput = getByPlaceholderText('Description *');
    const budgetInput = getByPlaceholderText('Budget (USD) *');

    fireEvent.changeText(nameInput, 'Test Campaign');
    fireEvent.changeText(descriptionInput, 'This is a test campaign');
    fireEvent.changeText(budgetInput, '1000');

    // Navigate to second step
    fireEvent.press(getByText('Next'));

    // Add a location
    const locationInput = getByPlaceholderText('Add Location');
    fireEvent.changeText(locationInput, 'New York, NY');
    fireEvent.press(getByText('Add'));

    // Navigate to third step
    fireEvent.press(getByText('Next'));

    // Select a platform
    const facebookPlatform = getByText('Facebook');
    fireEvent.press(facebookPlatform);

    // Fill out ad creatives
    const headlineInput = getByPlaceholderText('Headline *');
    const adDescriptionInput = getByPlaceholderText('Description *');

    fireEvent.changeText(headlineInput, 'Test Headline');
    fireEvent.changeText(adDescriptionInput, 'Test ad description');

    // Submit the form
    fireEvent.press(getByText('Create Campaign'));

    // Confirm dialog appears
    expect(getByText('Confirm Creation')).toBeTruthy();

    // Confirm submission
    fireEvent.press(getAllByText('Confirm')[0]);

    // Wait for submission to complete
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(mockNavigation.replace).toHaveBeenCalledWith('CampaignDetail', {
        id: 'new-campaign-id',
        name: 'Test Campaign',
        initialAction: 'launch'
      });
    });
  });
});
