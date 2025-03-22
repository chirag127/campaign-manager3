import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Context
import { AuthContext } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import CampaignsScreen from '../screens/main/CampaignsScreen';
import CampaignDetailScreen from '../screens/main/CampaignDetailScreen';
import CreateCampaignScreen from '../screens/main/CreateCampaignScreen';
import LeadsScreen from '../screens/main/LeadsScreen';
import LeadDetailScreen from '../screens/main/LeadDetailScreen';
import AccountScreen from '../screens/main/AccountScreen';
import PlatformConnectScreen from '../screens/main/PlatformConnectScreen';

// Create navigation stacks
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

// Campaign Stack Navigator
const CampaignStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CampaignsList"
        component={CampaignsScreen}
        options={{ title: 'Campaigns' }}
      />
      <Stack.Screen
        name="CampaignDetail"
        component={CampaignDetailScreen}
        options={({ route }) => ({ title: route.params?.name || 'Campaign Details' })}
      />
      <Stack.Screen
        name="CreateCampaign"
        component={CreateCampaignScreen}
        options={{ title: 'Create Campaign' }}
      />
    </Stack.Navigator>
  );
};

// Leads Stack Navigator
const LeadsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LeadsList"
        component={LeadsScreen}
        options={{ title: 'Leads' }}
      />
      <Stack.Screen
        name="LeadDetail"
        component={LeadDetailScreen}
        options={({ route }) => ({ title: route.params?.name || 'Lead Details' })}
      />
    </Stack.Navigator>
  );
};

// Account Stack Navigator
const AccountStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AccountSettings"
        component={AccountScreen}
        options={{ title: 'Account' }}
      />
      <Stack.Screen
        name="PlatformConnect"
        component={PlatformConnectScreen}
        options={{ title: 'Connect Platforms' }}
      />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Campaigns') {
            iconName = focused ? 'megaphone' : 'megaphone-outline';
          } else if (route.name === 'Leads') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Campaigns"
        component={CampaignStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Leads"
        component={LeadsStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStackNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

// App Navigator
const AppNavigator = () => {
  const { userToken, isLoading } = useContext(AuthContext);

  // Show loading screen if auth state is being determined
  if (isLoading) {
    return null; // Or a loading component
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {userToken ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
