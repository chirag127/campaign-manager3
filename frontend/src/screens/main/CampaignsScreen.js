import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Searchbar,
  FAB,
  ActivityIndicator,
  Divider
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../config/api';

const CampaignsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/campaigns`);
      setCampaigns(response.data.campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchCampaigns();
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    // Apply search filter
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply status filter
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && campaign.status === 'active') ||
      (filter === 'paused' && campaign.status === 'paused') ||
      (filter === 'draft' && campaign.status === 'draft') ||
      (filter === 'completed' && campaign.status === 'completed');

    return matchesSearch && matchesFilter;
  });

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

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Render campaign item
  const renderCampaignItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('CampaignDetail', {
        id: item._id,
        name: item.name
      })}
    >
      <Card style={styles.campaignCard}>
        <Card.Content>
          <View style={styles.campaignHeader}>
            <Title style={styles.campaignTitle}>{item.name}</Title>
            <Chip
              style={{ backgroundColor: getStatusColor(item.status) + '20' }}
              textStyle={{ color: getStatusColor(item.status) }}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Chip>
          </View>

          <Paragraph style={styles.campaignDescription}>
            {item.description || 'No description provided'}
          </Paragraph>

          <View style={styles.campaignDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.detailText}>
                {formatDate(item.startDate)} - {formatDate(item.endDate)}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={16} color="#666" />
              <Text style={styles.detailText}>
                Budget: ${item.budget.total.toFixed(2)}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="pie-chart-outline" size={16} color="#666" />
              <Text style={styles.detailText}>
                Spent: ${item.budget.spent.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.platformsContainer}>
            {item.platforms.map((platform) => (
              <Chip
                key={platform.name}
                style={styles.platformChip}
                textStyle={styles.platformChipText}
              >
                {platform.name}
              </Chip>
            ))}
          </View>
        </Card.Content>

        <Card.Actions style={styles.cardActions}>
          {item.status === 'draft' && (
            <Button
              mode="contained"
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('CampaignDetail', {
                  id: item._id,
                  name: item.name,
                  initialAction: 'launch'
                });
              }}
              style={styles.actionButton}
            >
              Launch
            </Button>
          )}

          {item.status === 'active' && (
            <Button
              mode="outlined"
              onPress={(e) => {
                e.stopPropagation();
                // Call API to pause campaign
                // Then refresh the list
              }}
              style={styles.actionButton}
            >
              Pause
            </Button>
          )}

          {item.status === 'paused' && (
            <Button
              mode="outlined"
              onPress={(e) => {
                e.stopPropagation();
                // Call API to resume campaign
                // Then refresh the list
              }}
              style={styles.actionButton}
            >
              Resume
            </Button>
          )}

          <Button
            mode="text"
            onPress={(e) => {
              e.stopPropagation();
              navigation.navigate('CampaignDetail', {
                id: item._id,
                name: item.name
              });
            }}
          >
            View Details
          </Button>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="megaphone-outline" size={64} color="#ccc" />
      <Title style={styles.emptyTitle}>No Campaigns Found</Title>
      <Paragraph style={styles.emptyText}>
        {searchQuery || filter !== 'all'
          ? 'Try adjusting your filters'
          : 'Create your first campaign to get started'}
      </Paragraph>
      {!searchQuery && filter === 'all' && (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreateCampaign')}
          style={styles.createButton}
        >
          Create Campaign
        </Button>
      )}
    </View>
  );

  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading campaigns...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search campaigns"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip
              selected={filter === 'all'}
              onPress={() => setFilter('all')}
              style={styles.filterChip}
            >
              All
            </Chip>
            <Chip
              selected={filter === 'active'}
              onPress={() => setFilter('active')}
              style={styles.filterChip}
            >
              Active
            </Chip>
            <Chip
              selected={filter === 'paused'}
              onPress={() => setFilter('paused')}
              style={styles.filterChip}
            >
              Paused
            </Chip>
            <Chip
              selected={filter === 'draft'}
              onPress={() => setFilter('draft')}
              style={styles.filterChip}
            >
              Draft
            </Chip>
            <Chip
              selected={filter === 'completed'}
              onPress={() => setFilter('completed')}
              style={styles.filterChip}
            >
              Completed
            </Chip>
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={filteredCampaigns}
        renderItem={renderCampaignItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('CreateCampaign')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f0f0f0',
  },
  filtersContainer: {
    marginTop: 10,
  },
  filterChip: {
    marginRight: 8,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  campaignCard: {
    marginBottom: 15,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  campaignTitle: {
    flex: 1,
    fontSize: 18,
  },
  campaignDescription: {
    color: '#666',
    marginBottom: 10,
  },
  campaignDetails: {
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 8,
    color: '#666',
  },
  platformsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  platformChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
  platformChipText: {
    fontSize: 12,
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginRight: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007BFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyTitle: {
    marginTop: 20,
    fontSize: 18,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
  createButton: {
    marginTop: 20,
  },
});

export default CampaignsScreen;
