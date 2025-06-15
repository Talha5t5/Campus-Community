import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image, // Or use an Icon component if you prefer
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress'; // Using react-native-progress for the progress bar

// Dummy data - replace with actual data fetching later
const userData = {
  name: 'إيمان الأحمدي', // Replace with dynamic user name
  major: 'Computer Science Major', // Replace with dynamic user major
  avatarUrl: null, // Replace with dynamic avatar URL or use a default
  profileCompletion: 0.75, // 75%
};

const registeredEventsData = [
  { id: '1', date: '25 MAR', title: 'Career Workshop', time: '3:00 PM', location: 'Student Center', status: 'Registered' },
  { id: '2', date: '27 MAR', title: 'Spring Mixer', time: '6:00 PM', location: 'Campus Green', status: 'RSVP' },
  // Add more events
];

const SettingsScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Implement logout logic (e.g., clear tokens, navigate to Auth)
    console.log('Logout pressed');
    navigation.navigate('Login'); // Navigate back to Login screen
  };

  const renderRegisteredEvent = (event) => (
    <View key={event.id} style={styles.eventItem}>
      <View style={styles.eventDateContainer}>
        <Text style={styles.eventDateDay}>{event.date.split(' ')[0]}</Text>
        <Text style={styles.eventDateMonth}>{event.date.split(' ')[1]}</Text>
      </View>
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventTimeLocation}>{`${event.time} • ${event.location}`}</Text>
        {event.status === 'Registered' ? (
          <View style={styles.registeredBadge}>
            <Text style={styles.registeredText}>Registered</Text>
            <Icon name="checkmark-circle" size={16} color="#4CAF50" style={{ marginLeft: 4 }} />
          </View>
        ) : (
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel RSVP</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#303F9F" />
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {userData.avatarUrl ? (
              <Image source={{ uri: userData.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                 {/* Optional: Add an icon or initials inside the placeholder */}
                 <Icon name="person-outline" size={60} color="#FFF" />
              </View>
            )}
          </View>
          <Text style={styles.profileName}>{userData.name}</Text>
          <Text style={styles.profileMajor}>{userData.major}</Text>
          <View style={styles.profileButtons}>
            <TouchableOpacity style={styles.profileButton}>
              <Icon name="pencil-outline" size={16} color="#FFF" />
              <Text style={styles.profileButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <Icon name="notifications-outline" size={16} color="#FFF" />
              <Text style={styles.profileButtonText}>Notifications</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {/* My Dashboard Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
               <Icon name="speedometer-outline" size={20} color="#303F9F" />
               <Text style={styles.cardTitle}>My Dashboard</Text>
            </View>
            <Progress.Bar
              progress={userData.profileCompletion}
              width={null} // Use null for full width within container
              height={8}
              color={'#FFA726'} // Orange color for progress
              unfilledColor={'#E0E0E0'}
              borderWidth={0}
              borderRadius={4}
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              Profile {Math.round(userData.profileCompletion * 100)}% complete
            </Text>
          </View>

          {/* Registered Events Card */}
          <View style={styles.card}>
             <View style={styles.cardHeader}>
               <Icon name="calendar-outline" size={20} color="#303F9F" />
               <Text style={styles.cardTitle}>Registered Events ({registeredEventsData.length})</Text>
            </View>
            {registeredEventsData.map(renderRegisteredEvent)}
          </View>

          {/* Account Settings Card */}
          <View style={styles.card}>
             <View style={styles.cardHeader}>
               <Icon name="settings-outline" size={20} color="#303F9F" />
               <Text style={styles.cardTitle}>Account Settings</Text>
            </View>
            <TouchableOpacity style={styles.settingItem}>
              <Icon name="person-circle-outline" size={22} color="#555" style={styles.settingIcon} />
              <Text style={styles.settingText}>Personal Information</Text>
              <Icon name="chevron-forward-outline" size={20} color="#BDBDBD" />
            </TouchableOpacity>
             <TouchableOpacity style={styles.settingItem}>
              <Icon name="notifications-circle-outline" size={22} color="#555" style={styles.settingIcon} />
              <Text style={styles.settingText}>Notification Preferences</Text>
              <Icon name="chevron-forward-outline" size={20} color="#BDBDBD" />
            </TouchableOpacity>
             <TouchableOpacity style={styles.settingItem}>
              <Icon name="lock-closed-outline" size={22} color="#555" style={styles.settingIcon} />
              <Text style={styles.settingText}>Security</Text>
              <Icon name="chevron-forward-outline" size={20} color="#BDBDBD" />
            </TouchableOpacity>
             <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
              <Icon name="log-out-outline" size={22} color="#E53935" style={styles.settingIcon} />
              <Text style={[styles.settingText, styles.logoutText]}>Log Out</Text>
              <Icon name="chevron-forward-outline" size={20} color="#BDBDBD" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#303F9F', // Match header color
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F4F6F8', // Light grey background for the scroll area
  },
  profileHeader: {
    backgroundColor: '#303F9F', // Dark blue background
    paddingBottom: 20,
    paddingTop: 20, // Adjust as needed if not using SafeAreaView for top padding
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 10,
  },
   avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFF', // White border
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
  },
  profileMajor: {
    fontSize: 16,
    color: '#E0E0E0', // Lighter white
    marginTop: 4,
    marginBottom: 15,
  },
  profileButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white button
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  profileButtonText: {
    color: '#FFF',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  contentArea: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#90A4AE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, // Add space below header
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  progressBar: {
    marginTop: 4,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  eventItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  eventDateContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 45, // Fixed width for alignment
  },
  eventDateDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#303F9F',
  },
  eventDateMonth: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  eventTimeLocation: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', // Make badge only as wide as content
  },
  registeredText: {
    fontSize: 14,
    color: '#4CAF50', // Green color for registered status
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#FFCDD2', // Light red background
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignSelf: 'flex-start', // Make button only as wide as content
  },
  cancelButtonText: {
    color: '#D32F2F', // Darker red text
    fontSize: 13,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingIcon: {
    marginRight: 15,
    width: 24, // Ensure consistent icon alignment
    textAlign: 'center',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#444',
  },
  logoutText: {
    color: '#E53935', // Red color for logout
  },
});

export default SettingsScreen; 