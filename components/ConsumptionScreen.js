import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { db, ref, onValue } from '../firebase';

const ConsumptionScreen = () => {
  const [latestTimestamp, setLatestTimestamp] = useState(null);
  const [latestSensorData, setLatestSensorData] = useState(null);

  useEffect(() => {
    const sensorRef = ref(db, 'PZEM004t');

    const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Fetched data:');
        const timestamps = Object.keys(data).filter(timestamp => timestamp !== 'current' && timestamp !== 'energy' && timestamp !== 'power' && timestamp !== 'voltage');
        const latestTimestamp = timestamps[timestamps.length - 1];
        setLatestTimestamp(latestTimestamp);
        // Calculate energy from power
        const latestSensorData = data[latestTimestamp];
        latestSensorData.energy = ((latestSensorData.power * 1) / 1000).toFixed(2); // Convert power to kWh and format to 2 decimal places
        setLatestSensorData(latestSensorData);
      } else {
        console.log('No data found in Firebase.');
      }
    });

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribeSensor();
    };
  }, []);

  if (!latestTimestamp || !latestSensorData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { energy, voltage } = latestSensorData;
  const costPerKWh = 7.322;

  // Calculate hourly cost
  const hourlyCost = (energy * costPerKWh).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <View style={styles.firstContainer}>
            <View style={styles.rateContainer}>
             <Text style={{fontWeight: '500', top: 10}}>Electricity Rate(kWh):</Text>
             <Text style={{fontSize: 40, fontWeight: '900', top: 20}}>₱7.322</Text>
            </View>
          
        </View>
        <View style={styles.firstContainer}>
            <View style={styles.rateContainer}>
            <Text style={{fontWeight: '500', top: 10}}>Hourly Cost:</Text>
          <Text style={{fontSize: 40, fontWeight: '900', top: 20}}>{`₱${hourlyCost}`}</Text>
            </View>   
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fcfb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataContainer: {
    top: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#9ae5c9',
    height: '60%',
    width: '95%',
    position: 'absolute',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    flexDirection: 'column', // Arrange children horizontally
  },
  firstContainer: {
    backgroundColor: '#4ac998',
    height: '40%',
    width: '85%',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  rateContainer: {
    padding: 20,
  },
});

export default ConsumptionScreen;
