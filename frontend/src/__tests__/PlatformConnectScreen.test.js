import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PlatformConnectScreen from '../screens/main/PlatformConnectScreen';
import { AuthContext } from '../context/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';

// Mock the dependencies
jest.mock('expo-web-browser');
jest.mock('expo-crypto');
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

describe('PlatformConnectScreen', () => {
  const mockUser = {
    connectedPlatforms: {
      facebook: true,
      google: false
    }
  };

  const mockConnectPlatform = jest.fn();
  const mockDisconnectPlatform = jest.fn();

  const mockAuthContext = {
    user: mockUser,
    connectPlatform: mockConnectPlatform,
    disconnectPlatform: mockDisconnectPlatform,
    isLoading: false
  };

  const mockNavigation = {
    navigate: jest.fn()
  };

  const mockRoute = {
    params: {}
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Crypto.digestStringAsync
    Crypto.digestStringAsync.mockResolvedValue('mock-state');

    // Mock WebBrowser.openAuthSessionAsync
    WebBrowser.openAuthSessionAsync.mockResolvedValue({
      type: 'success',
      url: 'http://localhost:5000/auth/google/callback?code=mock-auth-code&state=mock-state'
    });

    // Mock connect and disconnect platform functions
    mockConnectPlatform.mockResolvedValue({ success: true });
    mockDisconnectPlatform.mockResolvedValue({ success: true });
  });

  it('renders correctly with connected and disconnected platforms', () => {
    const { getByText, getAllByText } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <PlatformConnectScreen route={mockRoute} navigation={mockNavigation} />
      </AuthContext.Provider>
    );

    // Check if the screen title is rendered
    expect(getByText('Connect Ad Platforms')).toBeTruthy();

    // Check if Facebook is shown as connected
    expect(getByText('Facebook')).toBeTruthy();
    expect(getAllByText('Connected')[0]).toBeTruthy();

    // Check if Google is shown as not connected
    expect(getByText('Google')).toBeTruthy();
    expect(getByText('Connect')).toBeTruthy();
  });

  it('shows connect confirmation dialog when connect button is pressed', async () => {
    const { getByText, getAllByText } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <PlatformConnectScreen route={mockRoute} navigation={mockNavigation} />
      </AuthContext.Provider>
    );

    // Find and press the Connect button for Google
    const connectButton = getByText('Connect');
    fireEvent.press(connectButton);

    // Check if the confirmation dialog is shown
    await waitFor(() => {
      expect(getByText('Connect to Google')).toBeTruthy();
      expect(getByText(/You'll be redirected to Google/)).toBeTruthy();
    });
  });

  it('initiates OAuth flow when connect is confirmed', async () => {
    const { getByText, getAllByText } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <PlatformConnectScreen route={mockRoute} navigation={mockNavigation} />
      </AuthContext.Provider>
    );

    // Find and press the Connect button for Google
    const connectButton = getByText('Connect');
    fireEvent.press(connectButton);

    // Find and press the Connect button in the dialog
    const dialogConnectButton = getAllByText('Connect')[1];
    fireEvent.press(dialogConnectButton);

    // Check if the OAuth flow was initiated
    await waitFor(() => {
      expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalled();
      expect(mockConnectPlatform).toHaveBeenCalledWith('google', 'mock-auth-code');
    });
  });

  it('shows disconnect confirmation dialog when switch is toggled off', async () => {
    const { getByText } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <PlatformConnectScreen route={mockRoute} navigation={mockNavigation} />
      </AuthContext.Provider>
    );

    // Find Facebook card and toggle the switch
    const facebookCard = getByText('Facebook').closest('View');
    const switchElement = facebookCard.findByType('Switch');
    fireEvent(switchElement, 'onValueChange', false);

    // Check if the confirmation dialog is shown
    await waitFor(() => {
      expect(getByText('Disconnect from Facebook')).toBeTruthy();
      expect(getByText(/Are you sure you want to disconnect from Facebook/)).toBeTruthy();
    });
  });

  it('disconnects platform when disconnect is confirmed', async () => {
    const { getByText, getAllByText } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <PlatformConnectScreen route={mockRoute} navigation={mockNavigation} />
      </AuthContext.Provider>
    );

    // Find Facebook card and toggle the switch
    const facebookCard = getByText('Facebook').closest('View');
    const switchElement = facebookCard.findByType('Switch');
    fireEvent(switchElement, 'onValueChange', false);

    // Find and press the Disconnect button in the dialog
    const dialogDisconnectButton = getByText('Disconnect');
    fireEvent.press(dialogDisconnectButton);

    // Check if the disconnect function was called
    await waitFor(() => {
      expect(mockDisconnectPlatform).toHaveBeenCalledWith('facebook');
    });
  });
});
