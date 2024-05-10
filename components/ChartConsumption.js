import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { db, ref, onValue, update } from '../firebase';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const ChartConsumption = () => {
  const [sensorData, setSensorData] = useState({});

  useEffect(() => {
    const sensorRef = ref(db, 'PZEM004t');

    const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSensorData(data);
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
  if (!sensorData || Object.keys(sensorData).length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Aggregate power data by day
  const dailyPowerConsumption = {};
  Object.keys(sensorData).forEach(timestamp => {
    const date = timestamp.split(' ')[0];
    const power = sensorData[timestamp].power;
    if (!dailyPowerConsumption[date]) {
      dailyPowerConsumption[date] = 0;
    }
    dailyPowerConsumption[date] += power;
  });

  // Calculate total cost for each day
  const costPerKWh = 7.322; // PHP per kWh
  const dailyCostData = Object.keys(dailyPowerConsumption).map(date => {
    const powerConsumption = dailyPowerConsumption[date];
    const energyConsumption = (powerConsumption / 1000) * (6 / 3600); // Convert power from watts to kWh for 1 minute
    const totalCost = energyConsumption * costPerKWh;
    return { date, totalCost };
  }).filter(item => !isNaN(item.totalCost));                                             

  // Extract MM-DD labels and total cost values
  const labels = dailyCostData.map(item => item.date);
  const chartData = dailyCostData.map(item => item.totalCost.toFixed(2));
  // Render the chart
  return (
    <View style={styles.chartContainer}>
      
      <BarChart
        data={{
          labels: labels,
          datasets: [{ data: chartData }],
        }}
        width={Dimensions.get('window').width - 57}
        height={220}
        showValuesOnTopOfBars={true}
        yAxisSuffix=" PHP"
        chartConfig={{
          backgroundColor: 'red',
          backgroundGradientFrom: '#4ac998',
          backgroundGradientTo: '#9ae5c9',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 15, 19, ${opacity})`,
          labelColor: (opacity = 0) => `#07130f`, // Hide labels
          style: {
            borderRadius: 16,
            
          },
        }}
        style={styles.chart}
        onDataPointClick={({ value, index }) => {
          alert(`Total Cost: ${value} PHP`);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    width: 200,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
  marginRight: 120
  },
});

export default ChartConsumption;