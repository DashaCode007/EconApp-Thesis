import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ChartCom from './ChartScreen';
import ChartComponent from './ChartComponent';

const VoltageScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8fcfb'}}>
      <ChartCom/>
      <ChartComponent/>
    </View>
  );
};

const styles = StyleSheet.create({
  voltText: {
    textAlign: 'center',
    
  },
});

export default VoltageScreen;