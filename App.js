import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import Header from './components/Header';
import HomeScreen from './components/Home';
import HistoryScreen from './components/History'; // Add this import

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Econ',
            headerStyle: { backgroundColor: '#4AC998' },
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="Header"
          component={Header}
          options={({ navigation }) => ({
            title: 'Econ',
            headerStyle: { backgroundColor: '#4AC998' },
            headerLeft: null,
            headerRight: () => (
              <MaterialIcons
                name="history"
                size={30}
                color="black"
                onPress={() => navigation.navigate('History')} // Navigate to the "History" screen
              />
            ),
          })}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen} // Define the "History" screen component
          options={{ title: 'History',  headerStyle: { backgroundColor: '#4AC998' }, }} // Customize the header title
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
