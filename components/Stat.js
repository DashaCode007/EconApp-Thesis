import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { db, ref, onValue } from '../firebase';

const Chart = (props) => {
  const [selected, setSelected] = React.useState("");
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

  if (!sensorData || !sensorData.hasOwnProperty('power')) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { current, energy, power, voltage } = sensorData;
  // const doubledVolt = volt * 2;

  const calculateFinalBill = (chargePerKWh, fixedMonthlyFees) => {
    // Assuming power is in kilowatts (kW)
    // Assuming the calculation is based on a monthly period
  
    // Calculate total kWh used since last reading (assuming a month)
    const totalKWhUsed = power * 24 * 30; // power * hours in a day * days in a month
  
    // Calculate total energy charge
    const totalEnergyCharge = totalKWhUsed * chargePerKWh;
  
    // Calculate final bill
    const finalBill = totalEnergyCharge + fixedMonthlyFees;
  
    return finalBill;
  };
  
  // Example usage
  const powerP = 0.5; // Replace with actual power value from PZEM004t in kilowatts
  const chargePerKWh = 0.15; // Replace with actual charge per kWh
  const fixedMonthlyFees = 20; // Replace with actual fixed monthly fees
  
  const result = calculateFinalBill(powerP, chargePerKWh, fixedMonthlyFees);
  console.log('Final Bill:', result);
  return(

      <View>
        {/* <Text style={styles.sample}>{volt}</Text>
        <Text style={styles.sample}>{temperature}</Text> */}
        {/* <View style={styles.container}>
      <Text style={styles.text}>PZEM004t Data:</Text>
      <Text>{`Current: ${current}`}</Text>
      <Text>{`Energy: ${energy}`}</Text>
      <Text>{`Power: ${power}`}</Text>
      <Text>{`Voltage: ${voltage}`}</Text>
    </View>
        <View style={styles.dropdown}>
        <SelectList 
                setSelected={(val) => setSelected(val)} 
                data={data} 
                save="value"
                placeholder="Select an appliance"
                dropdownStyles
        />
        </View> */}
      </View>
  )
};
            const data = [
              {key:'1', value:'Fan'},
              {key:'2', value:'Charger'},
              {key:'3', value:'TV'},
            ]

const styles = StyleSheet.create( {
  chartText: {
    margin: 'auto'
  },
  dropdown: {
    backgroundColor: '#9ae5c9',
    width: 200,
    borderRadius: 8
  },
  sample: {
    textAlign: 'center',
   
  },
  container: {
    margin: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default Chart
