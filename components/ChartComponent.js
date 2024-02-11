import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { db, ref, onValue } from '../firebase';
import { Dimensions } from 'react-native';

const ChartComponent = () => {
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
  if (!sensorData || !sensorData.hasOwnProperty('power')) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Filter out non-timestamp entries
  const timestamps = Object.keys(sensorData).filter((key) => key !== 'current' && key !== 'energy' && key !== 'power' && key !== 'voltage');
  const powerDataValues = timestamps.map((timestamp) => sensorData[timestamp]?.power);

  // Show only the latest n data points (adjust n as needed)
  const numLatestDataPoints = 6; // Change this to the desired number of data points to show
  const latestTimestamps = ["30s ago", " ", "15s ago", " ", "Now"];
  const latestPowerDataValues = powerDataValues.slice(-numLatestDataPoints);

  // Calculate energy consumption (kWh) over the displayed period
  const timeIntervalInHours = 1; // Convert 5 seconds to hours
  const energyDataValues = latestPowerDataValues.map((power) => (power * timeIntervalInHours) / 1000); // Convert power (W) to energy (kWh)

  // Calculate power consumption in kW
  const powerConsumption = (latestPowerDataValues.reduce((acc, val) => acc + val, 0) * timeIntervalInHours) / (1000 * numLatestDataPoints);

  // Example cost per kWh (replace with your actual cost)
  // const costPerKWh = 7.322;

  // // Calculate hourly cost
  // const hourlyCost = powerConsumption * costPerKWh;

  const lineChartData = {
    labels: latestTimestamps,
    datasets: [
      {
        data: energyDataValues,
      },
    ],
  };

  return (
    <View>
      <View style={styles.lineContainer}>
        <Text style={styles.ldrText}>Energy (kWh)</Text>
        <LineChart
          data={lineChartData}
          width={Dimensions.get('window').width - 16} // from react-native
          height={230}
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundGradientFrom: '#ffff',
            backgroundGradientTo: '#9ae5c9',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
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
      {/* <Text style={styles.hourlyCost}>Hourly Cost: ${hourlyCost.toFixed(2)}</Text> */}
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  lineContainer: {
    top: 60,
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
  },
  ldrText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
});

export default ChartComponent;
