import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getAllEvents } from '../../../../database/db';

const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  console.log('Events state:', events);

  const fetchEvents = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      getAllEvents(fetchedEvents => {
        setEvents(fetchedEvents || []);
        if (showLoading) setIsLoading(false);
        setRefreshing(false);
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to load events. Please try again.');
      if (showLoading) setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents(false);
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
    >
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{item.title || 'Untitled Event'}</Text>
        {item.category && (
          <View style={[styles.eventTag, getTagStyle(item.category)]}>
            <Text style={styles.tagText}>{item.category}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.eventDetails}>
        <View style={styles.detailRow}>
          <Icon name="location-outline" size={16} color="#666" />
          <Text style={styles.detailText} numberOfLines={1}>{item.location || 'Location TBD'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.date || 'Date TBD'}</Text>
        </View>
        
        {item.time && (
          <View style={styles.detailRow}>
            <Icon name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.screenHeader}>
          <Text style={styles.screenTitle}>Upcoming Events</Text>
        </View>

        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#303F9F" />
          </View>
        ) : (
          <FlatList
            data={events}
            renderItem={renderEventItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                colors={['#303F9F']}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="calendar-outline" size={60} color="#D0D3D4" />
                <Text style={styles.emptyText}>No Upcoming Events</Text>
                <Text style={styles.emptySubText}>Check back later or pull down to refresh.</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Organizer')}
        >
          <Icon name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const getTagStyle = category => {
  switch (String(category).toLowerCase()) {
    case 'workshops': return { backgroundColor: '#7B68EE' };
    case 'social': return { backgroundColor: '#FFA07A' };
    case 'sports': return { backgroundColor: '#20B2AA' };
    case 'academic': return { backgroundColor: '#6495ED' };
    case 'other': return { backgroundColor: '#A9A9A9' };
    default: return { backgroundColor: '#B0C4DE' };
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenHeader: {
    paddingHorizontal: 16,
    paddingTop: 15, 
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#90A4AE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495E',
    flexShrink: 1,
    marginRight: 10,
  },
  eventTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  tagText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  eventDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    flexShrink: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 60,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 15,
  },
  emptySubText: {
    fontSize: 14,
    color: '#AEB6BF',
    textAlign: 'center',
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#303F9F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});

export default EventsScreen; 