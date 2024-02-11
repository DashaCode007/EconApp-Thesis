import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { db, ref, onValue } from '../firebase';
import ChartConsumption from './ChartConsumption';
import { Dimensions } from 'react-native';
import Chart from './Stat';

const ConsumptionScreen = () => {
  const [latestTimestamp, setLatestTimestamp] = useState(null);
  const [latestSensorData, setLatestSensorData] = useState(null);

  //SWitch
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    const sensorRef = ref(db, 'PZEM004t');

    const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Fetched data:');
        const timestamps = Object.keys(data).filter(timestamp => timestamp !== 'current' && timestamp !== 'energy' && timestamp !== 'power' && timestamp !== 'voltage');
        const latestTimestamp = timestamps[timestamps.length - 1];
        setLatestTimestamp(latestTimestamp);
        // Set the latest sensor data
        setLatestSensorData(data[latestTimestamp]);
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

  // Extract power from latestSensorData
  const { power } = latestSensorData;
  console.log("Power:", power);
  // Calculate hourly cost
  const costPerKWh = 7.322;
  const hourlyCost = ((power * 1) / 1000 * costPerKWh).toFixed(2); // Convert power to kW and calculate cost
  console.log(hourlyCost);
  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <View style={styles.firstContainer}>
          <View style={styles.rateContainer}>
            <Text style={{ fontWeight: '500', top: 5 }}>Electricity Rate(kWh):</Text>
            <Text style={{ fontSize: 30, fontWeight: '900', top: 5, left: 20 }}>₱7.322</Text>
            <Text style={{ fontWeight: '500', top: 20 }}>Hourly Cost:</Text>
            <Text style={{ fontSize: 30, fontWeight: '900', top: 20, left: 20 }}>{`₱${hourlyCost}`}</Text>
          </View>
        </View>
        <View style={styles.secondContainer}>
        <Text style={{fontSize: 20, fontWeight: '600', top: 5, textAlign: 'center' }}>Total Consumption</Text>
              <ChartConsumption />
        </View>
        <View style={styles.thirdContainer}>
      
        <Chart/>
        <View style={styles.switchContainer}>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
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
    top: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#9ae5c9',
    height: '95%',
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
    top: 10,
    backgroundColor: '#4ac998',
    height: '26%',
    width: '90%',
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
  secondContainer: {
    top: 10,
    backgroundColor: '#4ac998',
    height: '45%',
    width: '90%',
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
  thirdContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    top: 10,
    backgroundColor: '#4ac998',
    height: '10%',
    width: '90%',
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
    padding: 10,
  },
  switchContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
});

export default ConsumptionScreen;
