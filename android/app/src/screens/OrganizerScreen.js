import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addEvent, initDatabase } from '../../../../database/db';

const OrganizerScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [category, setCategory] = useState('');
  const [participantLimit, setParticipantLimit] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());

  const categories = ['Workshop', 'Social', 'Lecture', 'Sports'];

  useEffect(() => {
    // Initialize database when component mounts
    initDatabase()
      .then(() => {
        console.log('Database initialized successfully');
        setIsDatabaseReady(true);
      })
      .catch(error => {
        console.log('Database initialization failed:', error);
        alert('Failed to initialize database. Please try again.');
      });
  }, []);

  const handleImageUpload = () => {
    const options = {
      title: 'Select Event Image',
      mediaType: 'photo',
      cameraType: 'back',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
    setDate(currentDate.toISOString().split('T')[0]); // Set date in YYYY-MM-DD format
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || selectedTime;
    setShowTimePicker(false);
    setSelectedTime(currentTime);
    setTime(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleEndTimeChange = (event, selectedEndTime) => {
    const currentEndTime = selectedEndTime || selectedEndTime;
    setShowEndTimePicker(false);
    setSelectedEndTime(currentEndTime);
    setEndTime(currentEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleSaveDraft = () => {
    // Implement save draft functionality
  };

  const handlePublishEvent = () => {
    if (!isDatabaseReady) {
      alert('Database is not ready. Please wait a moment and try again.');
      return;
    }

    if (!title || !location || !date || !category) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Creating event with data:', {
      title,
      location,
      date,
      category,
      participantLimit: parseInt(participantLimit) || 0
    });

    addEvent(
      title.trim(),
      description.trim(),
      location.trim(),
      roomNumber.trim(),
      address.trim(),
      zipCode.trim(),
      date,
      time,
      endTime,
      category,
      imageUri,
      parseInt(participantLimit) || 0,
      (success) => {
        if (success) {
          console.log('Event created successfully');
          navigation.goBack();
        } else {
          console.log('Failed to create event');
          alert('Failed to create event. Please try again.');
        }
      }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Event</Text>
      </View>

      {/* Event Cover Image */}
      <TouchableOpacity style={styles.imageUpload} onPress={handleImageUpload}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        ) : (
          <>
            <Icon name="cloud-upload-outline" size={32} color="#666" />
            <Text style={styles.uploadText}>Tap to upload cover image</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Event Details Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Event Title"
          placeholderTextColor="#666666"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Event Description"
          placeholderTextColor="#666666"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          maxLength={500}
        />

        {/* Date Picker */}
        <TouchableOpacity 
          style={[styles.input, styles.pickerInput]} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.pickerText}>{date || "Select Date"}</Text>
        </TouchableOpacity>

        {/* Start Time Picker */}
        <TouchableOpacity 
          style={[styles.input, styles.pickerInput]} 
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.pickerText}>{time || "Select Start Time"}</Text>
        </TouchableOpacity>

        {/* End Time Picker */}
        <TouchableOpacity 
          style={[styles.input, styles.pickerInput]} 
          onPress={() => setShowEndTimePicker(true)}
        >
          <Text style={styles.pickerText}>{endTime || "Select End Time"}</Text>
        </TouchableOpacity>

        {/* Render DatePicker and TimePicker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        {showEndTimePicker && (
          <DateTimePicker
            value={selectedEndTime}
            mode="time"
            display="default"
            onChange={handleEndTimeChange}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Location"
          placeholderTextColor="#666666"
          value={location}
          onChangeText={setLocation}
        />
        <TextInput
          style={styles.input}
          placeholder="Room Number"
          placeholderTextColor="#666666"
          value={roomNumber}
          onChangeText={setRoomNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#666666"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="ZIP Code"
          placeholderTextColor="#666666"
          value={zipCode}
          onChangeText={setZipCode}
        />
        
        {/* Category Selection */}
        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryButton, category === cat && styles.selectedCategory]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryText, category === cat && styles.selectedCategoryText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Participant Limit"
          placeholderTextColor="#666666"
          value={participantLimit}
          onChangeText={setParticipantLimit}
          keyboardType="numeric"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
       
        <TouchableOpacity style={styles.publishButton} onPress={handlePublishEvent}>
          <Text style={styles.publishButtonText}>Publish Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#303F9F',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 16,
    color: 'white',
  },
  imageUpload: {
    height: 200,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    margin: 16,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#9FA8DA',
    overflow: 'hidden',
  },
  uploadText: {
    color: '#5C6BC0',
    marginTop: 8,
    fontSize: 15,
    fontWeight: '500',
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  input: {
    backgroundColor: '#F4F6F8',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#C5CAE9',
    color: '#333333',
  },
  pickerInput: {
    justifyContent: 'center',
  },
  pickerText: {
    color: '#666666',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dateInput: {
    flex: 1,
    marginRight: 8,
  },
  timeInputs: {
    flex: 1,
    flexDirection: 'row',
  },
  timeInput: {
    flex: 1,
    marginLeft: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedCategory: {
    backgroundColor: '#3F51B5',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  draftButton: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#ECEFF1',
    marginRight: 10,
    alignItems: 'center',
    elevation: 2,
  },
  publishButton: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#3949AB',
    marginLeft: 10,
    alignItems: 'center',
    elevation: 2,
  },
  draftButtonText: {
    color: '#455A64',
    fontSize: 16,
    fontWeight: '600',
  },
  publishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});


export default OrganizerScreen;
