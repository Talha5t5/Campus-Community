import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getAllEvents } from '../../../../database/db';

const HomeScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllEvents(setEvents);
    });
    getAllEvents(setEvents);
    return unsubscribe;
  }, [navigation]);

  const categories = ['All', 'Workshops', 'Social', 'Sports', 'Academic', 'Other'];

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      (event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'All' || (event.category && event.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const formatDate = dateString => {
    if (!dateString) return 'Date N/A';
    try {
      const date = new Date(dateString);
      const options = { month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return 'Invalid Date';
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.selectedCategoryText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderEventCard = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
    >
      <View style={styles.eventCardHeader}>
        <Text style={styles.eventDate}>{formatDate(item.date)}</Text>
        <View style={[styles.eventTag, getTagStyle(item.category)]}>
          <Text style={styles.tagText}>{item.category || 'General'}</Text>
        </View>
      </View>
      <Text style={styles.eventTitle}>{item.title || 'Untitled Event'}</Text>
      <View style={styles.locationContainer}>
        <Icon name="location-outline" size={16} color="#666" />
        <Text style={styles.eventLocation}>{item.location || 'Location TBD'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#303F9F" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.header}>Campus Events</Text>
            <Text style={styles.subHeader}>Discover upcoming activities</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsButton}>
            <Icon name="settings-outline" size={24} color="#303F9F" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events by title or location..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item}
            renderItem={renderCategory}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>

        <FlatList
          data={filteredEvents}
          keyExtractor={item => item.id.toString()}
          renderItem={renderEventCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="calendar-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No events found matching your criteria.</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const getTagStyle = category => {
  switch (category) {
    case 'Workshops':
      return { backgroundColor: '#7B68EE' };
    case 'Social':
      return { backgroundColor: '#FFA07A' };
    case 'Sports':
      return { backgroundColor: '#20B2AA' };
    case 'Academic':
      return { backgroundColor: '#6495ED' };
    case 'Other':
      return { backgroundColor: '#A9A9A9' };
    default:
      return { backgroundColor: '#B0C4DE' };
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
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  subHeader: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginTop: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EAECEE',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#34495E',
  },
  categoriesContainer: {
    paddingVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#EAECEE',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCategory: {
    backgroundColor: '#E8EAF6',
    borderColor: '#303F9F',
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    color: '#566573',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#303F9F',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#90A4AE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  eventCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    color: '#E67E22',
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 6,
    flexShrink: 1,
  },
  eventTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginLeft: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#95A5A6',
    fontSize: 16,
  },
});

export default HomeScreen;
