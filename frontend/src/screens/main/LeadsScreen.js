import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Searchbar,
  Chip,
  Button,
  FAB,
  ActivityIndicator,
  Divider,
  Menu,
  IconButton,
  Portal,
  Dialog
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../config/api';

const LeadsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  // Sources and statuses for filtering
  const sources = [
    { id: 'facebook', name: 'Facebook', icon: 'logo-facebook', color: '#3b5998' },
    { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', color: '#e4405f' },
    { id: 'google', name: 'Google', icon: 'logo-google', color: '#4285F4' },
    { id: 'website', name: 'Website', icon: 'globe-outline', color: '#2196F3' }
  ];
  
  const statuses = [
    { id: 'new', name: 'New', color: '#4CAF50' },
    { id: 'contacted', name: 'Contacted', color: '#2196F3' },
    { id: 'qualified', name: 'Qualified', color: '#FF9800' },
    { id: 'unqualified', name: 'Unqualified', color: '#F44336' },
    { id: 'converted', name: 'Converted', color: '#9C27B0' }
  ];

  // Fetch leads data
  const fetchLeads = async () => {
    try {
      const params = {};
      
      // Apply filters if selected
      if (selectedSource) {
        params.source = selectedSource;
      }
      
      if (selectedStatus) {
        params.status = selectedStatus;
      }
      
      const response = await axios.get(`${API_URL}/api/leads`, { params });
      setLeads(response.data.leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchLeads();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchLeads();
  }, [selectedSource, selectedStatus]);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchLeads();
  };

  // Handle search
  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter leads based on search query
  const filteredLeads = leads.filter(lead => {
    const searchTerms = searchQuery.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(searchTerms) ||
      lead.email?.toLowerCase().includes(searchTerms) ||
      lead.phone?.toLowerCase().includes(searchTerms) ||
      lead.source?.toLowerCase().includes(searchTerms)
    );
  });

  // Delete lead
  const deleteLead = async () => {
    try {
      await axios.delete(`${API_URL}/api/leads/${selectedLeadId}`);
      setLeads(leads.filter(lead => lead._id !== selectedLeadId));
    } catch (error) {
      console.error('Error deleting lead:', error);
    } finally {
      setDeleteDialogVisible(false);
    }
  };

  // Render lead item
  const renderLeadItem = ({ item }) => {
    // Find source and status objects
    const source = sources.find(s => s.id === item.source) || { name: 'Unknown', color: '#757575' };
    const status = statuses.find(s => s.id === item.status) || { name: 'Unknown', color: '#757575' };

    return (
      <Card 
        style={styles.card}
        onPress={() => navigation.navigate('LeadDetail', { id: item._id, name: item.name })}
      >
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Title>{item.name}</Title>
              <Paragraph>{item.email}</Paragraph>
            </View>
            <Menu
              visible={item._id === selectedLeadId && !deleteDialogVisible}
              onDismiss={() => setSelectedLeadId(null)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={() => setSelectedLeadId(item._id)}
                />
              }
            >
              <Menu.Item 
                onPress={() => {
                  setSelectedLeadId(null);
                  navigation.navigate('LeadDetail', { id: item._id, name: item.name });
                }} 
                title="View Details" 
                leadingIcon="eye"
              />
              <Menu.Item 
                onPress={() => {
                  setSelectedLeadId(null);
                  setDeleteDialogVisible(true);
                  setSelectedLeadId(item._id);
                }} 
                title="Delete" 
                leadingIcon="delete"
                titleStyle={{ color: '#F44336' }}
              />
            </Menu>
          </View>
          
          <View style={styles.cardFooter}>
            <Chip 
              style={{ backgroundColor: source.color + '20' }} 
              textStyle={{ color: source.color }}
              icon={() => <Ionicons name={source.icon} size={16} color={source.color} />}
            >
              {source.name}
            </Chip>
            <Chip 
              style={{ backgroundColor: status.color + '20' }} 
              textStyle={{ color: status.color }}
            >
              {status.name}
            </Chip>
          </View>
          
          {item.phone && (
            <Paragraph style={styles.moreInfo}>Phone: {item.phone}</Paragraph>
          )}
          
          {item.campaign && (
            <Paragraph style={styles.moreInfo}>
              Campaign: {item.campaign.name || item.campaign}
            </Paragraph>
          )}
          
          <Paragraph style={styles.date}>
            Added: {new Date(item.createdAt).toLocaleDateString()}
          </Paragraph>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search leads..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        <IconButton
          icon="filter"
          size={24}
          onPress={() => setFilterVisible(!filterVisible)}
          style={[
            styles.filterButton,
            (selectedSource || selectedStatus) && styles.filterButtonActive
          ]}
        />
      </View>
      
      {filterVisible && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Source:</Text>
          <View style={styles.filterChips}>
            {sources.map((source) => (
              <Chip
                key={source.id}
                selected={selectedSource === source.id}
                onPress={() => {
                  setSelectedSource(
                    selectedSource === source.id ? null : source.id
                  );
                }}
                style={styles.filterChip}
                icon={() => <Ionicons name={source.icon} size={16} color={source.color} />}
              >
                {source.name}
              </Chip>
            ))}
          </View>
          
          <Text style={styles.filterTitle}>Status:</Text>
          <View style={styles.filterChips}>
            {statuses.map((status) => (
              <Chip
                key={status.id}
                selected={selectedStatus === status.id}
                onPress={() => {
                  setSelectedStatus(
                    selectedStatus === status.id ? null : status.id
                  );
                }}
                style={[styles.filterChip, { borderColor: status.color }]}
                selectedColor={status.color}
              >
                {status.name}
              </Chip>
            ))}
          </View>
          
          {(selectedSource || selectedStatus) && (
            <Button
              mode="text"
              onPress={() => {
                setSelectedSource(null);
                setSelectedStatus(null);
              }}
            >
              Clear Filters
            </Button>
          )}
        </View>
      )}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredLeads}
          renderItem={renderLeadItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#757575" />
              <Text style={styles.emptyText}>No leads found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'Leads from your campaigns will appear here'}
              </Text>
            </View>
          )}
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('LeadDetail', { isNew: true })}
      />
      
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Confirm Deletion</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this lead? This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={deleteLead} color="#F44336">Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  searchBar: {
    flex: 1,
    marginRight: 8
  },
  filterButton: {
    backgroundColor: '#f0f0f0'
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
    tintColor: '#ffffff'
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  filterTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  filterChip: {
    margin: 4
  },
  listContainer: {
    padding: 16
  },
  card: {
    marginBottom: 16
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  cardHeaderLeft: {
    flex: 1
  },
  cardFooter: {
    flexDirection: 'row',
    marginTop: 12,
    flexWrap: 'wrap'
  },
  moreInfo: {
    marginTop: 8,
    color: '#757575'
  },
  date: {
    marginTop: 8,
    fontSize: 12,
    color: '#9e9e9e'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#757575',
    marginTop: 8
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3'
  }
});

export default LeadsScreen;
