import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import {
  Text,
  Title,
  Card,
  Paragraph,
  Button,
  ActivityIndicator,
  Divider,
  List
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { AuthContext } from '../../context/AuthContext';

// Components
import CampaignPerformanceChart from '../../components/CampaignPerformanceChart';
import PlatformStatusCard from '../../components/PlatformStatusCard';

const DashboardScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    activeCampaigns: 0,
    totalLeads: 0,
    totalSpent: 0,
    recentCampaigns: [],
    recentLeads: [],
    performanceData: {
      impressions: [],
      clicks: [],
      conversions: []
    }
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/dashboard`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Check if any platforms are connected
  const hasPlatformsConnected = () => {
    if (!user || !user.connectedPlatforms) return false;

    return Object.values(user.connectedPlatforms).some(platform => platform === true);
  };

  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Dashboard</Title>
        <Text style={styles.headerSubtitle}>Welcome back, {user?.name || 'User'}</Text>
      </View>

      {!hasPlatformsConnected() && (
        <Card style={styles.connectCard}>
          <Card.Content>
            <Title>Connect Your Ad Platforms</Title>
            <Paragraph>
              Link your ad accounts to start creating and managing campaigns across multiple platforms.
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Account', {
                screen: 'PlatformConnect'
              })}
            >
              Connect Platforms
            </Button>
          </Card.Actions>
        </Card>
      )}

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Paragraph>Active Campaigns</Paragraph>
            <Title>{dashboardData.activeCampaigns}</Title>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Paragraph>Total Leads</Paragraph>
            <Title>{dashboardData.totalLeads}</Title>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Paragraph>Total Spent</Paragraph>
            <Title>${dashboardData.totalSpent.toFixed(2)}</Title>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Campaign Performance</Title>
          <CampaignPerformanceChart data={dashboardData.performanceData} />
        </Card.Content>
      </Card>

      <Card style={styles.platformsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Platform Status</Title>
          <View style={styles.platformsGrid}>
            <PlatformStatusCard
              platform="facebook"
              isConnected={user?.connectedPlatforms?.facebook || false}
              onConnect={() => navigation.navigate('Account', {
                screen: 'PlatformConnect',
                params: { initialPlatform: 'facebook' }
              })}
            />
            <PlatformStatusCard
              platform="google"
              isConnected={user?.connectedPlatforms?.google || false}
              onConnect={() => navigation.navigate('Account', {
                screen: 'PlatformConnect',
                params: { initialPlatform: 'google' }
              })}
            />
            <PlatformStatusCard
              platform="youtube"
              isConnected={user?.connectedPlatforms?.youtube || false}
              onConnect={() => navigation.navigate('Account', {
                screen: 'PlatformConnect',
                params: { initialPlatform: 'youtube' }
              })}
            />
            <PlatformStatusCard
              platform="linkedin"
              isConnected={user?.connectedPlatforms?.linkedin || false}
              onConnect={() => navigation.navigate('Account', {
                screen: 'PlatformConnect',
                params: { initialPlatform: 'linkedin' }
              })}
            />
            <PlatformStatusCard
              platform="twitter"
              isConnected={user?.connectedPlatforms?.twitter || false}
              onConnect={() => navigation.navigate('Account', {
                screen: 'PlatformConnect',
                params: { initialPlatform: 'twitter' }
              })}
            />
            <PlatformStatusCard
              platform="snapchat"
              isConnected={user?.connectedPlatforms?.snapchat || false}
              onConnect={() => navigation.navigate('Account', {
                screen: 'PlatformConnect',
                params: { initialPlatform: 'snapchat' }
              })}
            />
            <PlatformStatusCard
              platform="instagram"
              isConnected={user?.connectedPlatforms?.instagram || false}
              onConnect={() => navigation.navigate('Account', {
                screen: 'PlatformConnect',
                params: { initialPlatform: 'instagram' }
              })}
            />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.recentCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Recent Campaigns</Title>
            <TouchableOpacity onPress={() => navigation.navigate('Campaigns')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {dashboardData.recentCampaigns.length > 0 ? (
            dashboardData.recentCampaigns.map((campaign, index) => (
              <React.Fragment key={campaign._id}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Campaigns', {
                    screen: 'CampaignDetail',
                    params: { id: campaign._id, name: campaign.name }
                  })}
                >
                  <List.Item
                    title={campaign.name}
                    description={`Budget: $${campaign.budget.total} • Status: ${campaign.status}`}
                    left={props => (
                      <List.Icon
                        {...props}
                        icon="megaphone"
                        color={campaign.status === 'active' ? '#4CAF50' : '#FFC107'}
                      />
                    )}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                  />
                </TouchableOpacity>
                {index < dashboardData.recentCampaigns.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Paragraph style={styles.emptyText}>No campaigns yet</Paragraph>
          )}
        </Card.Content>
        {dashboardData.recentCampaigns.length > 0 && (
          <Card.Actions>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Campaigns', {
                screen: 'CreateCampaign'
              })}
            >
              Create New Campaign
            </Button>
          </Card.Actions>
        )}
      </Card>

      <Card style={[styles.recentCard, styles.lastCard]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Recent Leads</Title>
            <TouchableOpacity onPress={() => navigation.navigate('Leads')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {dashboardData.recentLeads.length > 0 ? (
            dashboardData.recentLeads.map((lead, index) => (
              <React.Fragment key={lead._id}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Leads', {
                    screen: 'LeadDetail',
                    params: { id: lead._id, name: `${lead.firstName} ${lead.lastName}` }
                  })}
                >
                  <List.Item
                    title={`${lead.firstName} ${lead.lastName}`}
                    description={`Source: ${lead.source.platform} • Status: ${lead.status}`}
                    left={props => (
                      <List.Icon
                        {...props}
                        icon="account"
                        color="#007BFF"
                      />
                    )}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                  />
                </TouchableOpacity>
                {index < dashboardData.recentLeads.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Paragraph style={styles.emptyText}>No leads yet</Paragraph>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  connectCard: {
    margin: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
  statCard: {
    width: '31%',
  },
  chartCard: {
    margin: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  platformsCard: {
    margin: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  recentCard: {
    margin: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  lastCard: {
    marginBottom: 30,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
  },
  viewAllText: {
    color: '#007BFF',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
});

export default DashboardScreen;
