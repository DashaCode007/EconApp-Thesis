import React from 'react';
import { View, Button, Text, StyleSheet, StatusBar } from 'react-native';
import { Table, Row, Rows} from 'react-native-table-component';
import { DataTable } from 'react-native-paper';

const History = () => {
    return (
        <View>
            <StatusBar backgroundColor={'#4AC998'}/>
            <View>
            <DataTable style={styles.container}> 
      <DataTable.Header style={styles.tableHeader}> 
        <DataTable.Title>Date</DataTable.Title> 
        <DataTable.Title>Wattage</DataTable.Title> 
        <DataTable.Title>Consumption</DataTable.Title> 
      </DataTable.Header> 
      <DataTable.Row> 
        <DataTable.Cell>- - -</DataTable.Cell> 
        <DataTable.Cell>0.00</DataTable.Cell> 
        <DataTable.Cell>0.00</DataTable.Cell> 
      </DataTable.Row> 
    </DataTable>
            </View>
        </View>
    )
}

export default History;
  
const styles = StyleSheet.create({ 
  container: { 
    padding: 0, 
  }, 
  tableHeader: { 
    backgroundColor: '#4AC998', 
  }, 
});