import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';
import BadgerConversionScreen from './screens/BadgerConversionScreen';
import { Alert } from 'react-native';
import CS571 from '@cs571/mobile-client'

const ChatDrawer = createDrawerNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [isGuest, setIsGuest] = useState(false);

  async function getToken() {
    return await SecureStore.getItemAsync('jwt').catch(error => {
      console.error('Error storing the JWT:', error);
    });
  }
  
  useEffect(() => {
    // hmm... maybe I should load the chatroom names here
    // setChatrooms(["Hello", "World"]) // for example purposes only!
    if (isGuest && !isLoggedIn) {
      fetch('https://cs571.org/api/f23/hw9/chatrooms', {
        method: 'GET',
        headers: {
          'X-CS571-ID': CS571.getBadgerId(),
        },
      }).then(response => response.json()).then(data => {
        if (Array.isArray(data)) {
          setChatrooms(data);
        } else {
          console.error('Invalid response format:', data);
        }
      }).catch(error => { 
        console.error('API request failed:', error);
      });
    } else if (isLoggedIn) {
      getToken().then(token => {
        if (token) {
          fetch('https://cs571.org/api/f23/hw9/chatrooms', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'X-CS571-ID': CS571.getBadgerId(),
            },
          }).then(response => response.json()).then(data => {
            if (Array.isArray(data)) {
              setChatrooms(data);
            } else {
              console.error('Invalid response format:', data);
            }
          }).catch(error => { 
            console.error('API request failed:', error);
          });
        }
      });
    }
  }, [isLoggedIn, isGuest]);

  function handleLogin(username, password) {
    // hmm... maybe this is helpful!
    // setIsLoggedIn(true); // I should really do a fetch to login first!
    fetch('https://cs571.org/api/f23/hw9/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CS571-ID': CS571.getBadgerId(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => {
      // Check if the response status is OK (200)
      if (!response.ok) {
        // If not OK, throw an error
        return response.json().then(data => {
          throw new Error(data.message || 'Incorrect login, please try again.');
        });
      }
      return response.json();
    })
    .then(data => {
      SecureStore.setItemAsync('jwt', data.token).catch(error => {
        console.error('Error storing the JWT:', error);
      });
      setIsLoggedIn(true);
    })
    .catch(error => {
      // Display an alert with the error message
      Alert.alert('Login Error', error.message);
    });
  }

  function handleSignup(username, password) {
    // hmm... maybe this is helpful!
    // setIsLoggedIn(true); // I should really do a fetch to register first!
    fetch('https://cs571.org/api/f23/hw9/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CS571-ID': CS571.getBadgerId(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => {
      return response.json().then(data => {
        return { status: response.status, body: data };
      });
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error(body.message || 'User already exists or another registration error occurred.');
      }
      SecureStore.setItemAsync('jwt', body.token).catch(error => {
        console.error('Error storing the JWT:', error);
      });
      setIsLoggedIn(true);
    })
    .catch(error => {
      Alert.alert('Registration Error', error.message);
    });
  }
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsGuest(false);
  };

  const handleGuestAccess = () => {
    setIsGuest(true);
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {chatrooms.map(chatroomName => (
            <ChatDrawer.Screen key={chatroomName} name={chatroomName}>
              {(props) => <BadgerChatroomScreen {...props} chatroomName={chatroomName} isGuest={false} />}
            </ChatDrawer.Screen>
          ))}
          <ChatDrawer.Screen name="Logout">
            {() => <BadgerLogoutScreen onLogout={handleLogout} />}
          </ChatDrawer.Screen>
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return (
      <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} handleLogin={handleLogin} />
    );
  } else if (isGuest) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
        <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {chatrooms.map(chatroomName => (
              <ChatDrawer.Screen key={chatroomName} name={chatroomName}>
                {(props) => <BadgerChatroomScreen {...props} chatroomName={chatroomName} isGuest={true} />}
              </ChatDrawer.Screen>
            ))}
          <ChatDrawer.Screen name="Signup">
            {() => <BadgerConversionScreen setIsRegistering={setIsRegistering} />}
          </ChatDrawer.Screen>
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} handleGuestAccess={handleGuestAccess} />
    );
  }
}