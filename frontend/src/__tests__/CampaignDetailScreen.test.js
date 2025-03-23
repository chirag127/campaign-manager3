import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CampaignDetailScreen from '../screens/main/CampaignDetailScreen';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');
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
jest.mock('../../components/CampaignPerformanceChart', () => 'CampaignPerformanceChart');
jest.mock('../../components/PlatformPerformanceCard', () => 'PlatformPerformanceCard');

describe('CampaignDetailScreen', () => {
  const mockCampaign = {
    _id: 'campaign123',
    name: 'Test Campaign',
    description: 'This is a test campaign',
    status: 'active',
    startDate: '2023-01-01T00:00:00.000Z',
    endDate: '2023-12-31T00:00:00.000Z',
    budget: {
      total: 1000,
      spent: 250,
      daily: 50
    },
    platforms: [
      {
        name: 'facebook',
        status: 'active',
        budget: {
          allocated: 500,
          spent: 125
        },
        performance: {
          impressions: 5000,
          clicks: 200,
          conversions: 20,
          ctr: 0.04,
          costPerClick: 0.625,
          costPerConversion: 6.25
        },
        lastSynced: '2023-06-01T12:00:00.000Z'
      },
      {
        name: 'google',
        status: 'active',
        budget: {
          allocated: 500,
          spent: 125
        },
        performance: {
          impressions: 4000,
          clicks: 150,
          conversions: 15,
          ctr: 0.0375,
          costPerClick: 0.833,
          costPerConversion: 8.33
        },
        lastSynced: '2023-06-01T12:00:00.000Z'
      }
    ],
    targetAudience: {
      ageRange: { min: 18, max: 65 },
      gender: ['male', 'female'],
      interests: ['technology', 'marketing'],
      locations: [
        { city: 'New York', state: 'NY', country: 'USA' },
        { city: 'Los Angeles', state: 'CA', country: 'USA' }
      ]
    },
    creatives: [
      {
        type: 'image',
        title: 'Main Ad',
        description: 'Check out our new product!',
        mediaUrl: 'https://example.com/image.jpg',
        callToAction: 'Learn More',
        destinationUrl: 'https://example.com/product'
      }
    ]
  };

  const mockRoute = {
    params: {
      id: 'campaign123',
      name: 'Test Campaign'
    }
  };

  const mockNavigation = {
    setOptions: jest.fn(),
    navigate: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock axios.get to return the campaign data
    axios.get.mockResolvedValue({
      data: {
        campaign: mockCampaign
      }
    });

    // Mock axios.post for campaign actions
    axios.post.mockResolvedValue({
      data: {
        campaign: {
          ...mockCampaign,
          status: 'paused' // For testing status changes
        }
      }
    });

    // Mock axios.delete for campaign deletion
    axios.delete.mockResolvedValue({});
  });

  it('renders loading state initially', () => {
    const { getByText } = render(
      <CampaignDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText('Loading campaign details...')).toBeTruthy();
  });

  it('renders campaign details after loading', async () => {
    const { getByText, queryByText } = render(
      <CampaignDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(queryByText('Loading campaign details...')).toBeNull();
      expect(getByText('Test Campaign')).toBeTruthy();
      expect(getByText('This is a test campaign')).toBeTruthy();
      expect(getByText('Active')).toBeTruthy();
    });
  });

  it('shows budget information correctly', async () => {
    const { getByText } = render(
      <CampaignDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('$250.00 / $1000.00')).toBeTruthy();
      expect(getByText('$50.00')).toBeTruthy(); // Daily budget
      expect(getByText('$750.00')).toBeTruthy(); // Remaining budget
    });
  });

  it('shows performance metrics correctly', async () => {
    const { getByText } = render(
      <CampaignDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('9,000')).toBeTruthy(); // Total impressions
      expect(getByText('350')).toBeTruthy(); // Total clicks
      expect(getByText('35')).toBeTruthy(); // Total conversions
    });
  });

  it('shows platform performance cards', async () => {
    const { getAllByText } = render(
      <CampaignDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getAllByText('Platform Performance')).toBeTruthy();
      // Check for PlatformPerformanceCard components
      // In a real test, we would check for specific platform data
    });
  });

  it('shows action buttons based on campaign status', async () => {
    const { getByText } = render(
      <CampaignDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      // For active campaign, should show Pause button
      expect(getByText('Pause Campaign')).toBeTruthy();
      expect(getByText('Sync Data')).toBeTruthy();
      expect(getByText('Edit Campaign')).toBeTruthy();
    });
  });

  it('shows confirmation dialog when action button is pressed', async () => {
    const { getByText } = render(
      <CampaignDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      const pauseButton = getByText('Pause Campaign');
      fireEvent.press(pauseButton);
    });

    await waitFor(() => {
      expect(getByText('Pause Campaign')).toBeTruthy();
      expect(getByText(/Are you sure you want to pause this campaign/)).toBeTruthy();
    });
  });

  it('calls API when action is confirmed', async () => {
    const { getByText } = render(
      <CampaignDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      const pauseButton = getByText('Pause Campaign');
      fireEvent.press(pauseButton);
    });

    const confirmButton = getByText('Pause');
    fireEvent.press(confirmButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}/api/campaigns/campaign123/pause`
      );
    });
  });

  it('navigates to edit screen when edit button is pressed', async () => {
    const { getByText } = render(
      <CampaignDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      const editButton = getByText('Edit Campaign');
      fireEvent.press(editButton);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('CreateCampaign', {
      campaignId: 'campaign123',
      isEditing: true
    });
  });

  it('deletes campaign and navigates back when delete is confirmed', async () => {
    const { getByText } = render(
      <CampaignDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    // Open the menu
    const menuButton = getByText('More options');
    fireEvent.press(menuButton);

    // Press delete option
    const deleteOption = getByText('Delete Campaign');
    fireEvent.press(deleteOption);

    // Confirm deletion
    const confirmButton = getByText('Delete');
    fireEvent.press(confirmButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        `${API_URL}/api/campaigns/campaign123`
      );
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });
});
