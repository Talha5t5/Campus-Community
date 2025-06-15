import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './android/app/src/screens/LoginScreen';
import SignupScreen from './android/app/src/screens/SignupScreen';
import HomeScreen from './android/app/src/screens/HomeScreen';
import OrganizerScreen from './android/app/src/screens/OrganizerScreen';
import EventDetailsScreen from './android/app/src/screens/EventDetailsScreen';
import CreateEventScreen from './android/app/src/screens/CreateEventScreen';
import EventsScreen from './android/app/src/screens/EventsScreen';
import SettingsScreen from './android/app/src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Organizer" component={OrganizerScreen} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        <Stack.Screen name="Events" component={EventsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;