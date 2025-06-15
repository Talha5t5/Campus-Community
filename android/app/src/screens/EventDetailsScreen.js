import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getEventById } from '../../../../database/db';

const EventDetailsScreen = ({ navigation }) => {
  const route = useRoute();
  const { eventId } = route.params;

  const [eventDetails, setEventDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      setIsLoading(true);
      console.log('Fetching details for event ID:', eventId);
      getEventById(eventId, (fetchedEvent) => {
        if (fetchedEvent) {
          setEventDetails(fetchedEvent);
          console.log('Fetched event details:', fetchedEvent);
        } else {
          console.error('Event not found with ID:', eventId);
          Alert.alert('Error', 'Could not load event details.');
          setEventDetails(null);
        }
        setIsLoading(false);
      });
    } else {
      console.error('No eventId passed to EventDetailsScreen');
      Alert.alert('Error', 'Invalid event specified.');
      setIsLoading(false);
      navigation.goBack();
    }
  }, [eventId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date Unknown';
    try {
      const date = new Date(dateString);
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#303F9F" />
        <Text>Loading Event Details...</Text>
      </View>
    );
  }

  if (!eventDetails) {
    return (
      <View style={styles.errorContainer}>
        <TouchableOpacity 
          style={styles.backButtonError} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="close-circle-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Icon name="alert-circle-outline" size={50} color="#E53935" />
        <Text style={styles.errorText}>Event Not Found</Text>
        <Text style={styles.errorSubText}>The requested event could not be found or loaded.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>

      <Image 
        source={eventDetails.imageUri ? { uri: eventDetails.imageUri } : require('../assets/deafult-event.png')} 
        style={styles.coverImage} 
      />

      <Text style={styles.title}>{eventDetails.title}</Text>

      <View style={styles.dateTimeContainer}>
        <Icon name="calendar-outline" size={20} color="#6200ee" />
        <Text style={styles.dateTime}>
          {formatDate(eventDetails.date)}
        </Text>
        {eventDetails.time && (
          <>
            <Icon name="time-outline" size={20} color="#6200ee" style={{ marginLeft: 15 }} />
            <Text style={styles.dateTime}>
              {eventDetails.time}{eventDetails.endTime ? ` - ${eventDetails.endTime}` : ''}
            </Text>
          </>
        )}
      </View>

      <View style={styles.locationContainer}>
        <Icon name="location-outline" size={20} color="#6200ee" />
        <Text style={styles.location}>{eventDetails.location}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Event Description</Text>
        <Text style={styles.description}>
          {eventDetails.description || 'No description provided.'} 
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Location Details</Text>
        <Text style={styles.locationDetails}>
          {eventDetails.location} {eventDetails.roomNumber ? `- Room ${eventDetails.roomNumber}` : ''}
        </Text>
        {eventDetails.address && 
          <Text style={styles.locationDetails}>{eventDetails.address}</Text>
        }
        {eventDetails.zipCode && 
          <Text style={styles.locationDetails}>{`Zip Code: ${eventDetails.zipCode}`}</Text>
        }
      </View>

      <TouchableOpacity style={styles.confirmButton}>
        <Icon name="checkmark-circle-outline" size={20} color="#fff" />
        <Text style={styles.confirmButtonText}>Confirm Attendance</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E53935',
    marginTop: 10,
  },
  errorSubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 15,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonError: {
    position: 'absolute',
    top: 45,
    left: 15,
  },
  coverImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#212529',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 5,
  },
  dateTime: {
    fontSize: 16,
    color: '#495057',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 5,
  },
  location: {
    fontSize: 16,
    color: '#495057',
    flexShrink: 1,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#adb5bd',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#343a40',
  },
  description: {
    fontSize: 16,
    lineHeight: 25,
    color: '#495057',
  },
  locationDetails: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 6,
  },
  confirmButton: {
    backgroundColor: '#303F9F',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#303F9F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default EventDetailsScreen; 