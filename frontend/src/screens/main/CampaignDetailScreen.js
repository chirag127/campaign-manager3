import React, { useState, useEffect } from 'react';
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
  Chip,
  ActivityIndicator,
  Divider,
  List,
  Menu,
  IconButton,
  Dialog,
  Portal,
  ProgressBar
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../config/api';

// Components
import CampaignPerformanceChart from '../../components/CampaignPerformanceChart';
import PlatformPerformanceCard from '../../components/PlatformPerformanceCard';

const CampaignDetailScreen = ({ route, navigation }) => {
  const { id, initialAction } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Set up header options
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
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
              navigation.navigate('CreateCampaign', {
                campaignId: id,
                isEditing: true
              });
            }}
            title="Edit Campaign"
            leadingIcon="pencil"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              showActionDialog('sync');
            }}
            title="Sync Data"
            leadingIcon="sync"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              showActionDialog('delete');
            }}
            title="Delete Campaign"
            leadingIcon="delete"
            titleStyle={{ color: '#F44336' }}
          />
        </Menu>
      ),
    });
  }, [navigation, menuVisible, id]);

  // Check for initial action
  useEffect(() => {
    if (initialAction && campaign) {
      if (initialAction === 'launch' && campaign.status === 'draft') {
        showActionDialog('launch');
      }
    }
  }, [initialAction, campaign]);

  // Fetch campaign data
  const fetchCampaign = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/campaigns/${id}`);
      setCampaign(response.data.campaign);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCampaign();
  }, [id]);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchCampaign();
  };

  // Show action confirmation dialog
  const showActionDialog = (action) => {
    setDialogAction(action);
    setDialogVisible(true);
  };

  // Handle campaign actions
  const handleCampaignAction = async () => {
    setActionLoading(true);

    try {
      let response;

      switch (dialogAction) {
        case 'launch':
          response = await axios.post(`${API_URL}/api/campaigns/${id}/launch`);
          break;
        case 'pause':
          response = await axios.post(`${API_URL}/api/campaigns/${id}/pause`);
          break;
        case 'resume':
          response = await axios.post(`${API_URL}/api/campaigns/${id}/resume`);
          break;
        case 'sync':
          response = await axios.post(`${API_URL}/api/campaigns/${id}/sync`);
          break;
        case 'delete':
          await axios.delete(`${API_URL}/api/campaigns/${id}`);
          navigation.goBack();
          return;
      }

      // Update campaign data
      if (response && response.data) {
        setCampaign(response.data.campaign);
      }
    } catch (error) {
      console.error(`Error performing ${dialogAction} action:`, error);
    } finally {
      setDialogVisible(false);
      setActionLoading(false);
    }
  };

  // Get dialog content based on action
  const getDialogContent = () => {
    switch (dialogAction) {
      case 'launch':
        return {
          title: 'Launch Campaign',
          content: 'Are you sure you want to launch this campaign? This will activate it on all selected platforms.',
          confirmText: 'Launch',
          confirmColor: '#4CAF50'
        };
      case 'pause':
        return {
          title: 'Pause Campaign',
          content: 'Are you sure you want to pause this campaign? This will temporarily stop it on all platforms.',
          confirmText: 'Pause',
          confirmColor: '#FFC107'
        };
      case 'resume':
        return {
          title: 'Resume Campaign',
          content: 'Are you sure you want to resume this campaign? This will reactivate it on all platforms.',
          confirmText: 'Resume',
          confirmColor: '#4CAF50'
        };
      case 'sync':
        return {
          title: 'Sync Campaign Data',
          content: 'This will fetch the latest performance data from all platforms. Continue?',
          confirmText: 'Sync',
          confirmColor: '#2196F3'
        };
      case 'delete':
        return {
          title: 'Delete Campaign',
          content: 'Are you sure you want to delete this campaign? This action cannot be undone.',
          confirmText: 'Delete',
          confirmColor: '#F44336'
        };
      default:
        return {
          title: 'Confirm Action',
          content: 'Are you sure you want to proceed?',
          confirmText: 'Confirm',
          confirmColor: '#007BFF'
        };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'paused':
        return '#FFC107';
      case 'draft':
        return '#9E9E9E';
      case 'completed':
        return '#2196F3';
      case 'failed':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  // Calculate budget progress
  const calculateBudgetProgress = () => {
    if (!campaign) return 0;
    return campaign.budget.spent / campaign.budget.total;
  };

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (!campaign) return 0;

    const endDate = new Date(campaign.endDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate total metrics
  const calculateTotalMetrics = () => {
    if (!campaign) return { impressions: 0, clicks: 0, conversions: 0 };

    return campaign.platforms.reduce((totals, platform) => {
      totals.impressions += platform.performance.impressions || 0;
      totals.clicks += platform.performance.clicks || 0;
      totals.conversions += platform.performance.conversions || 0;
      return totals;
    }, { impressions: 0, clicks: 0, conversions: 0 });
  };

  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading campaign details...</Text>
      </View>
    );
  }

  // If campaign not found
  if (!campaign) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
        <Title style={styles.errorTitle}>Campaign Not Found</Title>
        <Paragraph style={styles.errorText}>
          The campaign you're looking for doesn't exist or you don't have permission to view it.
        </Paragraph>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  const totalMetrics = calculateTotalMetrics();
  const dialogContent = getDialogContent();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Title style={styles.campaignTitle}>{campaign.name}</Title>
            <Chip
              style={{ backgroundColor: getStatusColor(campaign.status) + '20' }}
              textStyle={{ color: getStatusColor(campaign.status) }}
            >
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Chip>
          </View>

          <Paragraph style={styles.campaignDescription}>
            {campaign.description || 'No description provided'}
          </Paragraph>

          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <Text style={styles.dateValue}>{formatDate(campaign.startDate)}</Text>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>End Date</Text>
              <Text style={styles.dateValue}>{formatDate(campaign.endDate)}</Text>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Days Left</Text>
              <Text style={styles.dateValue}>{calculateDaysRemaining()}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.budgetCard}>
        <Card.Content>
          <View style={styles.budgetHeader}>
            <Title style={styles.sectionTitle}>Budget</Title>
            <Text style={styles.budgetText}>
              ${campaign.budget.spent.toFixed(2)} / ${campaign.budget.total.toFixed(2)}
            </Text>
          </View>

          <ProgressBar
            progress={calculateBudgetProgress()}
            color={calculateBudgetProgress() > 0.9 ? '#F44336' : '#4CAF50'}
            style={styles.budgetProgress}
          />

          <View style={styles.budgetDetails}>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Daily Budget</Text>
              <Text style={styles.budgetValue}>${campaign.budget.daily.toFixed(2)}</Text>
            </View>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Remaining</Text>
              <Text style={styles.budgetValue}>
                ${(campaign.budget.total - campaign.budget.spent).toFixed(2)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.performanceCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Performance Overview</Title>

          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Ionicons name="eye-outline" size={24} color="#007BFF" />
              <Text style={styles.metricValue}>{totalMetrics.impressions.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Impressions</Text>
            </View>

            <View style={styles.metricItem}>
              <Ionicons name="finger-print-outline" size={24} color="#FFC107" />
              <Text style={styles.metricValue}>{totalMetrics.clicks.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Clicks</Text>
            </View>

            <View style={styles.metricItem}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
              <Text style={styles.metricValue}>{totalMetrics.conversions.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Conversions</Text>
            </View>
          </View>

          <CampaignPerformanceChart
            data={{
              impressions: [100, 150, 200, 180, 250, 300, 280],
              clicks: [20, 30, 25, 40, 45, 50, 55],
              conversions: [5, 8, 10, 12, 15, 18, 20]
            }}
          />
        </Card.Content>
      </Card>

      <Card style={styles.platformsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Platform Performance</Title>

          {campaign.platforms.map((platform, index) => (
            <React.Fragment key={platform.name}>
              <PlatformPerformanceCard platform={platform} />
              {index < campaign.platforms.length - 1 && <Divider style={styles.platformDivider} />}
            </React.Fragment>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.targetingCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Target Audience</Title>

          <View style={styles.targetingItem}>
            <Text style={styles.targetingLabel}>Age Range</Text>
            <Text style={styles.targetingValue}>
              {campaign.targetAudience.ageRange.min} - {campaign.targetAudience.ageRange.max} years
            </Text>
          </View>

          <View style={styles.targetingItem}>
            <Text style={styles.targetingLabel}>Gender</Text>
            <View style={styles.chipContainer}>
              {campaign.targetAudience.gender.map(gender => (
                <Chip key={gender} style={styles.targetingChip}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Chip>
              ))}
            </View>
          </View>

          {campaign.targetAudience.locations.length > 0 && (
            <View style={styles.targetingItem}>
              <Text style={styles.targetingLabel}>Locations</Text>
              <View style={styles.chipContainer}>
                {campaign.targetAudience.locations.map((location, index) => (
                  <Chip key={index} style={styles.targetingChip}>
                    {location.city || location.state || location.country}
                  </Chip>
                ))}
              </View>
            </View>
          )}

          {campaign.targetAudience.interests.length > 0 && (
            <View style={styles.targetingItem}>
              <Text style={styles.targetingLabel}>Interests</Text>
              <View style={styles.chipContainer}>
                {campaign.targetAudience.interests.map(interest => (
                  <Chip key={interest} style={styles.targetingChip}>
                    {interest}
                  </Chip>
                ))}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.creativesCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Ad Creatives</Title>

          {campaign.creatives.map((creative, index) => (
            <Card key={index} style={styles.creativeCard}>
              <Card.Content>
                <Text style={styles.creativeType}>
                  {creative.type.charAt(0).toUpperCase() + creative.type.slice(1)}
                </Text>
                <Title style={styles.creativeTitle}>{creative.title}</Title>
                <Paragraph style={styles.creativeDescription}>
                  {creative.description}
                </Paragraph>

                {creative.mediaUrl && (
                  <View style={styles.creativeMedia}>
                    {/* In a real app, you would display the image or video here */}
                    <View style={styles.mediaPlaceholder}>
                      <Ionicons
                        name={creative.type === 'video' ? 'videocam' : 'image'}
                        size={32}
                        color="#999"
                      />
                      <Text style={styles.mediaPlaceholderText}>Media Preview</Text>
                    </View>
                  </View>
                )}

                <View style={styles.creativeDetails}>
                  {creative.callToAction && (
                    <Chip style={styles.ctaChip}>
                      {creative.callToAction}
                    </Chip>
                  )}

                  {creative.destinationUrl && (
                    <Text style={styles.destinationUrl} numberOfLines={1}>
                      URL: {creative.destinationUrl}
                    </Text>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>

      <View style={styles.actionsContainer}>
        {campaign.status === 'draft' && (
          <Button
            mode="contained"
            icon="rocket-launch"
            onPress={() => showActionDialog('launch')}
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
          >
            Launch Campaign
          </Button>
        )}

        {campaign.status === 'active' && (
          <Button
            mode="contained"
            icon="pause"
            onPress={() => showActionDialog('pause')}
            style={[styles.actionButton, { backgroundColor: '#FFC107' }]}
          >
            Pause Campaign
          </Button>
        )}

        {campaign.status === 'paused' && (
          <Button
            mode="contained"
            icon="play"
            onPress={() => showActionDialog('resume')}
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
          >
            Resume Campaign
          </Button>
        )}

        <Button
          mode="outlined"
          icon="sync"
          onPress={() => showActionDialog('sync')}
          style={styles.actionButton}
        >
          Sync Data
        </Button>

        <Button
          mode="outlined"
          icon="pencil"
          onPress={() => navigation.navigate('CreateCampaign', {
            campaignId: id,
            isEditing: true
          })}
          style={styles.actionButton}
        >
          Edit Campaign
        </Button>
      </View>

      {/* Action Confirmation Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>{dialogContent.title}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{dialogContent.content}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={handleCampaignAction}
              loading={actionLoading}
              disabled={actionLoading}
              textColor={dialogContent.confirmColor}
            >
              {dialogContent.confirmText}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    marginTop: 20,
    fontSize: 18,
  },
  errorText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
  errorButton: {
    marginTop: 20,
  },
  headerCard: {
    margin: 15,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  campaignTitle: {
    flex: 1,
    fontSize: 20,
  },
  campaignDescription: {
    color: '#666',
    marginBottom: 15,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateItem: {
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  budgetCard: {
    margin: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
  },
  budgetText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  budgetProgress: {
    height: 8,
    borderRadius: 4,
    marginBottom: 15,
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetItem: {
    alignItems: 'center',
    flex: 1,
  },
  budgetLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  performanceCard: {
    margin: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  platformsCard: {
    margin: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  platformDivider: {
    marginVertical: 15,
  },
  targetingCard: {
    margin: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  targetingItem: {
    marginBottom: 15,
  },
  targetingLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  targetingValue: {
    fontSize: 14,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  targetingChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  creativesCard: {
    margin: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  creativeCard: {
    marginTop: 10,
    marginBottom: 5,
  },
  creativeType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  creativeTitle: {
    fontSize: 16,
  },
  creativeDescription: {
    marginBottom: 10,
  },
  creativeMedia: {
    marginBottom: 10,
  },
  mediaPlaceholder: {
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaPlaceholderText: {
    marginTop: 8,
    color: '#999',
  },
  creativeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ctaChip: {
    marginRight: 10,
    marginBottom: 5,
  },
  destinationUrl: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  actionsContainer: {
    margin: 15,
    marginTop: 5,
    marginBottom: 30,
  },
  actionButton: {
    marginBottom: 10,
  },
});

export default CampaignDetailScreen;
