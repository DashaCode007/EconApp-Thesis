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

  return(

        <View style={styles.dropdown}>
        <SelectList 
                setSelected={(val) => setSelected(val)} 
                data={data} 
                save="value"
                placeholder="Select an appliance"
                isSearchable={false}
                dropdownStyles={{ position: 'absolute', top: -150, backgroundColor: '#f8fcfb' }} 
        />
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
  dropdownContainer: {
    position: 'relative', // Ensure the container is positioned relatively
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
