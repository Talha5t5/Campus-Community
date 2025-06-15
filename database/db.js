import SQLite from 'react-native-sqlite-storage';
import bcrypt from 'react-native-bcrypt';
import { Platform } from 'react-native';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

let db;

// Hash the password
const hashPassword = (password) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

// Compare the password
const comparePassword = (password, hashedPassword) => {
  try {
    return bcrypt.compareSync(password, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// Initialize the database
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    const dbName = 'events.db';
    const dbLocation = Platform.OS === 'android' ? 'default' : 'Library/LocalDatabase';
    
    SQLite.openDatabase(
      {
        name: dbName,
        location: dbLocation,
        createFromLocation: 1
      }
    ).then(database => {
      db = database;
      console.log('Database opened successfully');
      setupDatabase().then(resolve).catch(reject);
    }).catch(error => {
      console.error('Error opening database: ', error);
      reject(error);
    });
  });
};

// Create tables
const setupDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Create users table if it doesn't exist
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          name TEXT, 
          email TEXT UNIQUE, 
          password TEXT, 
          role TEXT
        )`,
        [],
        () => {
          console.log('Users table created/verified successfully');
          // Verify if we have any users
          tx.executeSql(
            'SELECT COUNT(*) as count FROM users',
            [],
            (_, result) => {
              const count = result.rows.item(0).count;
              console.log('Current number of users in database:', count);
              if (count === 0) {
                // Add a test user if no users exist
                const testPassword = hashPassword('test123');
                tx.executeSql(
                  'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                  ['Test User', 'test@test.com', testPassword, 'user'],
                  () => {
                    console.log('Test user created successfully');
                    resolve();
                  },
                  (_, error) => {
                    console.error('Error creating test user:', error);
                    resolve(); // Still resolve as this is not critical
                  }
                );
              } else {
                resolve();
              }
            },
            (_, error) => {
              console.error('Error checking user count:', error);
              resolve(); // Still resolve as this is not critical
            }
          );
        },
        (_, error) => {
          console.error('Error creating users table: ', error);
          reject(error);
        }
      );

      // Create events table if it doesn't exist
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          title TEXT NOT NULL, 
          description TEXT,
          location TEXT NOT NULL, 
          roomNumber TEXT,
          address TEXT,
          zipCode TEXT,
          date TEXT NOT NULL,
          time TEXT,
          endTime TEXT, 
          category TEXT NOT NULL,
          imageUri TEXT,
          participantLimit INTEGER DEFAULT 0
        )`,
        [],
        () => {
          console.log('Events table created/verified successfully');
        },
        (_, error) => {
          console.error('Error creating events table: ', error);
          reject(error);
        }
      );
    });
  });
};

// Register user
export const registerUser = (name, email, password, role, callback) => {
  if (!db) {
    console.error('Database not initialized');
    callback(false);
    return;
  }

  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM users WHERE email = ?`,
      [email],
      (_, result) => {
        if (result.rows.length > 0) {
          console.log('Email already registered');
          callback(false);
        } else {
          try {
            const hashedPassword = hashPassword(password);
            console.log('Hashed password for new user:', hashedPassword);
            tx.executeSql(
              `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
              [name, email, hashedPassword, role],
              (_, result) => {
                console.log('User registered successfully with ID: ', result.insertId);
                // Verify the user was actually inserted
                tx.executeSql(
                  'SELECT * FROM users WHERE id = ?',
                  [result.insertId],
                  (_, verifyResult) => {
                    if (verifyResult.rows.length > 0) {
                      console.log('User verification successful');
                      callback(true);
                    } else {
                      console.error('User verification failed');
                      callback(false);
                    }
                  }
                );
              },
              (_, error) => {
                console.error('Error registering user: ', error);
                callback(false);
              }
            );
          } catch (error) {
            console.error('Error hashing password during registration: ', error);
            callback(false);
          }
        }
      },
      (_, error) => {
        console.error('Error checking email: ', error);
        callback(false);
      }
    );
  });
};

// Login user
export const loginUser = (email, password, callback) => {
  if (!db) {
    console.error('Database not initialized');
    callback(null);
    return;
  }

  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM users WHERE email = ?`,
      [email],
      (_, result) => {
        if (result.rows.length > 0) {
          const user = result.rows.item(0);
          console.log('Found user:', user.email);
          
          try {
            const isPasswordValid = comparePassword(password, user.password);
            console.log('Password comparison result:', isPasswordValid);
            
            if (isPasswordValid) {
              console.log('Login successful');
              callback(user);
            } else {
              console.log('Invalid password');
              callback(null);
            }
          } catch (error) {
            console.error('Error comparing passwords: ', error);
            callback(null);
          }
        } else {
          console.log('User not found');
          callback(null);
        }
      },
      (_, error) => {
        console.error('Error during login: ', error);
        callback(null);
      }
    );
  });
};

// Add event
export const addEvent = (
  title, description, location, roomNumber, address, zipCode,
  date, time, endTime, category, imageUri, participantLimit,
  callback
) => {
  if (!db) {
    console.error('Database not initialized for addEvent');
    callback(false);
    return;
  }

  const participantLimitValue = participantLimit ? parseInt(participantLimit, 10) : 0;
  if (isNaN(participantLimitValue)) {
    console.warn('Invalid participantLimit value, defaulting to 0');
  }

  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO events (
        title, description, location, roomNumber, address, 
        zipCode, date, time, endTime, category, imageUri, participantLimit 
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title || '',
        description || '',
        location || '',
        roomNumber || '',
        address || '',
        zipCode || '',
        date || '',
        time || '',
        endTime || '',
        category || '',
        imageUri || '',
        isNaN(participantLimitValue) ? 0 : participantLimitValue
      ],
      (_, result) => {
        console.log('Event added successfully with ID: ', result.insertId);
        callback(true);
      },
      (_, error) => {
        console.error('Error adding event: ', error);
        callback(false);
      }
    );
  }, error => {
    console.error('Transaction error: ', error);
    callback(false);
  });
};

// Get all events
export const getAllEvents = (callback) => {
  if (!db) {
    console.error('Database not initialized for getAllEvents');
    callback([]);
    return;
  }

  db.transaction(tx => {
    tx.executeSql(
      `SELECT id, title, description, location, roomNumber, address, zipCode, date, time, endTime, category, imageUri, participantLimit FROM events ORDER BY date DESC, time DESC`,
      [],
      (_, result) => {
        let events = [];
        for (let i = 0; i < result.rows.length; i++) {
          events.push(result.rows.item(i));
        }
        console.log('Fetched all events successfully (', events.length, ' events)');
        callback(events);
      },
      (_, error) => {
        console.error('Error fetching events: ', error);
        callback([]);
      }
    );
  });
};

// Get a single event by its ID
export const getEventById = (eventId, callback) => {
  if (!db) {
    console.error('Database not initialized for getEventById');
    callback(null); // Return null if DB is not ready
    return;
  }

  db.transaction(tx => {
    tx.executeSql(
      // Select all relevant columns for the specific event ID
      `SELECT id, title, description, location, roomNumber, address, zipCode, date, time, endTime, category, imageUri, participantLimit FROM events WHERE id = ?`,
      [eventId],
      (_, result) => {
        if (result.rows.length > 0) {
          const event = result.rows.item(0);
          console.log('Fetched event successfully with ID: ', eventId);
          callback(event); // Return the found event object
        } else {
          console.warn('No event found with ID: ', eventId);
          callback(null); // Return null if no event is found
        }
      },
      (_, error) => {
        console.error(`Error fetching event with ID ${eventId}: `, error);
        callback(null); // Return null in case of error
      }
    );
  });
};

// Export initDatabase
export { initDatabase };