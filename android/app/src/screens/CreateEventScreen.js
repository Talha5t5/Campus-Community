import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { addEvent } from '../../../../database/db';

const CreateEventScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    roomNumber: '',
    address: '',
    zipCode: '',
    date: '',
    time: '',
    endTime: '',
    category: '',
    participantLimit: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title || !formData.location || !formData.date || !formData.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      addEvent(
        formData.title,
        formData.description,
        formData.location,
        formData.roomNumber,
        formData.address,
        formData.zipCode,
        formData.date,
        formData.time,
        formData.endTime,
        formData.category,
        '', // imageUri (can be added later)
        formData.participantLimit,
        success => {
          setIsLoading(false);
          if (success) {
            Alert.alert('Success', 'Event created successfully!');
            navigation.goBack();
          } else {
            Alert.alert('Error', 'Failed to create event. Please try again.');
          }
        }
      );
    } catch (error) {
      setIsLoading(false);
      console.error('Error creating event:', error);
      Alert.alert('Error', 'An error occurred while creating the event.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Event Details</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event title"
            value={formData.title}
            onChangeText={value => handleInputChange('title', value)}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter event description"
            value={formData.description}
            onChangeText={value => handleInputChange('description', value)}
            multiline
            numberOfLines={4}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event location"
            value={formData.location}
            onChangeText={value => handleInputChange('location', value)}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Room Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter room number"
            value={formData.roomNumber}
            onChangeText={value => handleInputChange('roomNumber', value)}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={formData.address}
            onChangeText={value => handleInputChange('address', value)}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Zip Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter zip code"
            value={formData.zipCode}
            onChangeText={value => handleInputChange('zipCode', value)}
            keyboardType="numeric"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.date}
            onChangeText={value => handleInputChange('date', value)}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start Time</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            value={formData.time}
            onChangeText={value => handleInputChange('time', value)}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>End Time</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            value={formData.endTime}
            onChangeText={value => handleInputChange('endTime', value)}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event category"
            value={formData.category}
            onChangeText={value => handleInputChange('category', value)}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Participant Limit</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter maximum participants"
            value={formData.participantLimit}
            onChangeText={value => handleInputChange('participantLimit', value)}
            keyboardType="numeric"
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Create Event</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#303F9F',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateEventScreen; 