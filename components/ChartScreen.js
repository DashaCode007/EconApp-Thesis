import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { db, ref, onValue } from '../firebase';
import { Dimensions } from 'react-native';

const ChartCom = () => {
  const [sensorData, setSensorData] = useState({});

  useEffect(() => {
    const sensorRef = ref(db, 'PZEM004t');

    const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Fetched data:');
        setSensorData(data);
        console.log('YESSSSS');
      } else {
        console.log('No data found in Firebase.');
      }
    });

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribeSensor();
    };
  }, []);

  // Check if sensorData exists and has the expected properties
  if (!sensorData || !sensorData.hasOwnProperty('voltage')) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Filter out non-timestamp entries
  const timestamps = Object.keys(sensorData).filter((key) => key !== 'current' && key !== 'energy' && key !== 'power' && key !== 'voltage');
  const voltageDataValues = timestamps.map((timestamp) => sensorData[timestamp]?.voltage);

  // Show only the latest n data points (adjust n as needed)
  const numLatestDataPoints = 6; // Change this to the desired number of data points to show
  const latestTimestamps = ["30s ago", " ", "15s ago", " ", "Now"];
  const latestVoltageDataValues = voltageDataValues.slice(-numLatestDataPoints);

  // Add logs to check extracted data
  // console.log('Latest Timestamps:', latestTimestamps);
  // console.log('Latest Power Data Values:', latestPowerDataValues);
  // console.log('Latest Voltage Data Values:', latestVoltageDataValues)

  const voltageChartData = {
    labels: latestTimestamps,
    datasets: [
      {
        data: latestVoltageDataValues,
      },
    ],
  };

  return (
    <View>
      <View style={styles.lineContainer}>
        <Text style={styles.voltText}>Voltage(V)</Text>
        <LineChart
          data={voltageChartData}
          width={Dimensions.get('window').width - 16}
          height={230}
          yAxisInterval={1}
          chartConfig={{
            backgroundGradientFrom: '#ffff',
            backgroundGradientTo: '#9ae5c9',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // Adjust color for voltage
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 10,
            },
            propsForDots: {
              r: '3',
              strokeWidth: '2',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chart: {
    marginVertical: 8,
    borderRadius: 16,    
    padding: 5,
    width: 'auto'
    
  },
  voltText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  lineContainer: {
    top: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 5,
    backgroundColor: '#4ac998',
    height: 'auto',
    width: 'auto',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.00,
      elevation: 24,
  }
});

export default ChartCom;