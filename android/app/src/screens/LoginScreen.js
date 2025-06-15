import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { loginUser, initDatabase } from '../../../../database/db';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDBReady, setIsDBReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const initializeDB = async () => {
      try {
        console.log('LoginScreen: Initializing DB...');
        await initDatabase();
        console.log('LoginScreen: Database initialized successfully');
        setIsDBReady(true);
      } catch (error) {
        console.error('LoginScreen: Database initialization error:', error);
        Alert.alert('Error', 'Failed to initialize database. Please restart the app.');
        setIsDBReady(false);
      }
    };

    initializeDB();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('LoginScreen: Focused, resetting isLoading state.');
      setIsLoading(false);
      
      return () => {
        console.log('LoginScreen: Unfocused.');
      };
    }, [])
  );

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isDBReady) {
      Alert.alert('Error', 'Database is not ready. Please wait or restart the app.');
      return;
    }

    setIsLoading(true);

    try {
      // Admin shortcut login
      if (email === 'admin@admin.com' && password === 'admin123') {
        navigation.navigate('Events');
        return;
      }

      // Login from SQLite
      loginUser(email, password, user => {
        setIsLoading(false);
        if (user) {
          console.log('Login successful, user role:', user.role);
          if (user.role === 'admin') {
            navigation.navigate('Organizer');
          } else {
            navigation.navigate('Home');
          }
        } else {
          console.log('Login failed - invalid credentials');
          Alert.alert('Error', 'Invalid email or password. Please try again.');
        }
      });
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Icon name="school-outline" size={80} color="#303F9F" />
        <Text style={styles.header}>Campus Events</Text>
        <Text style={styles.subHeader}>Sign in to your account</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            <Icon
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate('Signup')}
          disabled={isLoading}
        >
          <Text style={styles.signupButtonText}>Create New Account</Text>
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
  logoContainer: {
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
  passwordToggle: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#303F9F',
    fontSize: 14,
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
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  signupButton: {
    borderWidth: 1,
    borderColor: '#303F9F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#303F9F',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoginScreen;
