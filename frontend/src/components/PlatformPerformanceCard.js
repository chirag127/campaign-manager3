import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, ProgressBar } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

const PlatformPerformanceCard = ({ platform }) => {
  // Platform-specific configurations
  const platformConfig = {
    facebook: {
      name: 'Facebook',
      icon: <FontAwesome name="facebook-square" size={24} color="#1877F2" />,
      color: '#1877F2'
    },
    google: {
      name: 'Google',
      icon: <FontAwesome name="google" size={24} color="#DB4437" />,
      color: '#DB4437'
    },
    youtube: {
      name: 'YouTube',
      icon: <FontAwesome name="youtube-play" size={24} color="#FF0000" />,
      color: '#FF0000'
    },
    linkedin: {
      name: 'LinkedIn',
      icon: <FontAwesome name="linkedin-square" size={24} color="#0A66C2" />,
      color: '#0A66C2'
    },
    twitter: {
      name: 'Twitter',
      icon: <FontAwesome name="twitter-square" size={24} color="#1DA1F2" />,
      color: '#1DA1F2'
    },
    snapchat: {
      name: 'Snapchat',
      icon: <FontAwesome name="snapchat-square" size={24} color="#FFFC00" />,
      color: '#FFFC00'
    },
    instagram: {
      name: 'Instagram',
      icon: <FontAwesome name="instagram" size={24} color="#E4405F" />,
      color: '#E4405F'
    }
  };

  const config = platformConfig[platform.name] || {
    name: platform.name,
    icon: <FontAwesome name="question-circle" size={24} color="#999" />,
    color: '#999'
  };

  // Calculate budget progress
  const budgetProgress = platform.budget.spent / platform.budget.allocated;

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'paused':
        return '#FFC107';
      case 'pending':
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
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <View style={styles.platformInfo}>
          {config.icon}
          <Text style={styles.platformName}>{config.name}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(platform.status) + '20' }
        ]}>
          <Text style={[styles.statusText, { color: getStatusColor(platform.status) }]}>
            {platform.status.charAt(0).toUpperCase() + platform.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.budgetSection}>
        <View style={styles.budgetHeader}>
          <Text style={styles.budgetLabel}>Budget</Text>
          <Text style={styles.budgetText}>
            ${platform.budget.spent.toFixed(2)} / ${platform.budget.allocated.toFixed(2)}
          </Text>
        </View>
        <ProgressBar
          progress={budgetProgress}
          color={budgetProgress > 0.9 ? '#F44336' : config.color}
          style={styles.budgetProgress}
        />
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {platform.performance.impressions?.toLocaleString() || '0'}
          </Text>
          <Text style={styles.metricLabel}>Impressions</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {platform.performance.clicks?.toLocaleString() || '0'}
          </Text>
          <Text style={styles.metricLabel}>Clicks</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {platform.performance.conversions?.toLocaleString() || '0'}
          </Text>
          <Text style={styles.metricLabel}>Conversions</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>CTR</Text>
          <Text style={styles.detailValue}>
            {(platform.performance.ctr * 100).toFixed(2)}%
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Cost/Click</Text>
          <Text style={styles.detailValue}>
            ${platform.performance.costPerClick?.toFixed(2) || '0.00'}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Cost/Conv</Text>
          <Text style={styles.detailValue}>
            ${platform.performance.costPerConversion?.toFixed(2) || '0.00'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.lastSyncText}>
          Last synced: {formatDate(platform.lastSynced)}
        </Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  budgetSection: {
    marginBottom: 15,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#666',
  },
  budgetText: {
    fontSize: 14,
  },
  budgetProgress: {
    height: 6,
    borderRadius: 3,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'flex-end',
  },
  lastSyncText: {
    fontSize: 12,
    color: '#999',
  },
});

export default PlatformPerformanceCard;
