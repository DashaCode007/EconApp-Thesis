import React from 'react';
import Header from './components/Header';
import HomeScreen from './components/Home';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Econ Scanner', 
          headerStyle: {backgroundColor: '#4AC998'}}} 
        />
        <Stack.Screen 
          name="Header" 
          component={Header} 
          options={{title: 'Econ Scanner',
          headerStyle: {backgroundColor: '#4AC998'}}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
   
  },
});


export default MyStack;