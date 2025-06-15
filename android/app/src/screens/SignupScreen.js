import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { registerUser, initDatabase } from '../../../../database/db';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDBReady, setIsDBReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDatabase();
        console.log('Database initialized successfully');
        setIsDBReady(true);
      } catch (error) {
        console.error('Database initialization error:', error);
        Alert.alert('Error', 'Failed to initialize database. Please restart the app.');
      }
    };

    initializeDB();
  }, []);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isDBReady) {
      Alert.alert('Error', 'Database is not ready. Please wait or restart the app.');
      return;
    }

    setIsLoading(true);

    try {
      registerUser(name, email, password, 'user', success => {
        setIsLoading(false);
        if (success) {
          Alert.alert('Success', 'Registration successful! Please login.');
          navigation.navigate('Login');
        } else {
          Alert.alert('Error', 'Email is already registered. Please use a different email.');
        }
      });
    } catch (error) {
      setIsLoading(false);
      console.error('Signup error:', error);
      Alert.alert('Error', 'An error occurred during registration. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon name="person-add-outline" size={80} color="#303F9F" />
        <Text style={styles.header}>Create Account</Text>
        <Text style={styles.subHeader}>Sign up to get started</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Icon name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          disabled={isLoading}
        >
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#303F9F',
    marginTop: 16,
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#303F9F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#303F9F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  linkBold: {
    color: '#303F9F',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
