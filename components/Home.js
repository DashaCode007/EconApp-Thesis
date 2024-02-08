import React from 'react';
import { View, Button, Text, StyleSheet, StatusBar } from 'react-native';

const Home = ({navigation}) => {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#4AC998'}/>
            <View>
                <Text style={styles.message}>Empower yourself with real-time insights into your energy usage. Econ Scanner brings you a user-friendly platform to effortlessly track and optimize your power consumption. Whether you're at home or on the go, stay in control with our intuitive interface and powerful analytics. Start your journey to a more efficient and sustainable lifestyle today!</Text>
            </View>
            <View style={styles.homeBtn}>
            <Button color={'#4AC998'} onPress={() =>navigation.navigate('Header')} title='Get Started'></Button></View>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    homeBtn: {
        borderRadius: '20',
        top: 200,
        height: 40,
        width: 300
    },
    message: {
        textAlign: 'center',
        margin: 20,
        fontSize: 16,
        top: 0
    },
    
})