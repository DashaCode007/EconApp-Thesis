import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Modal, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { db, ref, onValue, update } from '../firebase';
import ChartConsumption from './ChartConsumption';
import { Dimensions } from 'react-native';
import Chart from './Stat';
import { MaterialIcons } from '@expo/vector-icons';

const ConsumptionScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [latestTimestamp, setLatestTimestamp] = useState(null);
  const [latestSensorData, setLatestSensorData] = useState(null);
  const [costPerKWh, setCostPerKWh] = useState(null);
  const [newCostPerKWh, setNewCostPerKWh] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    const sensorRef = ref(db, 'PZEM004t');
    const costPerKWhRef = ref(db, 'Rate/CostPerKwH');

    const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const timestamps = Object.keys(data).filter(timestamp => timestamp !== 'current' && timestamp !== 'energy' && timestamp !== 'power' && timestamp !== 'voltage');
        const latestTimestamp = timestamps[timestamps.length - 1];
        setLatestTimestamp(latestTimestamp);
        setLatestSensorData(data[latestTimestamp]);
      } else {
        console.log('No data found in Firebase.');
      }
    });

    const unsubscribeCostPerKWh = onValue(costPerKWhRef, (snapshot) => {
      if (snapshot.exists()) {
        setCostPerKWh(snapshot.val());
        setNewCostPerKWh(snapshot.val().toString());
      } else {
        console.log('Cost per kWh not found in Firebase.');
      }
    });

    return () => {
      unsubscribeSensor();
      unsubscribeCostPerKWh();
    };
  }, []);

  const handleUpdateCostPerKWh = () => {
    setShowConfirmationModal(true);
    setIsEditing(false);
  };

  const confirmUpdateCostPerKWh = () => {
    update(ref(db, 'Rate'), { CostPerKwH: parseFloat(newCostPerKWh) })
      .then(() => {
        console.log('Cost per kWh updated successfully.');
        setShowConfirmationModal(false);
      })
      .catch((error) => {
        console.error('Error updating cost per kWh:', error);
        setShowConfirmationModal(false);
      });
  };

  const cancelUpdateCostPerKWh = () =>{
    setShowConfirmationModal(false);
  };

  const handleEditPress = () => {
    setIsEditing(!isEditing);
  };

  if (!latestTimestamp || !latestSensorData || costPerKWh === null) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { power } = latestSensorData;
  const hourlyCost = ((power * 1) / 1000 * costPerKWh).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <View style={styles.firstContainer}>
          <View style={styles.rateContainer}>
            <Text style={{ fontWeight: '500' }}>Electricity Rate(kWh): </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 30, fontWeight: '900' }}>₱</Text>
              {isEditing ? (
                <>
                  <TextInput
                    style={{ fontSize: 30, fontWeight: '900' }}
                    onChangeText={setNewCostPerKWh}
                    value={newCostPerKWh}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  <TouchableOpacity onPress={handleUpdateCostPerKWh}>
                    <MaterialIcons name="check" margin={10} size={25} color="black" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                <Text style={{ fontSize: 30, fontWeight: '900' }}>{newCostPerKWh}</Text>
                <TouchableOpacity onPress={handleEditPress}>
                  <MaterialIcons name="edit" size={23} margin={10} color="black" />
                </TouchableOpacity>
                </>
              )}
            </View>
            <Text style={{ fontWeight: '500' }}>Hourly Cost:</Text>
            <Text style={{ fontSize: 30, fontWeight: '900' }}>{`₱${hourlyCost}`}</Text>
          </View>
        </View>
        <View style={styles.secondContainer}>
          <Text style={{ fontSize: 20, fontWeight: '600', top: 5, textAlign: 'center' }}>Total Consumption</Text>
          <ChartConsumption />
        </View>
        <View style={styles.thirdContainer}>
          <Chart />
        </View>
      </View>

      {/* Update Confirmation Modal */}
      <Modal
        visible={showConfirmationModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to update the Electricity Rate?(It may affect your todays consumptions)</Text>
            <View style={styles.modalButtons}>
            <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={confirmUpdateCostPerKWh}
              ><Text style={styles.textStyle}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={cancelUpdateCostPerKWh}
              >
                <Text style={styles.textStyleCancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    margin: 20,

    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
  },
  confirmButton: {
    backgroundColor: '#4ac998',
  },
  cancelButton: {
    backgroundColor: '#f8fcfb',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyleCancel: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#07130f'
  }
});

export default ConsumptionScreen;