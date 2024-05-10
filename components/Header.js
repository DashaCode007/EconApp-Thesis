import React from 'react';
import { StyleSheet, Dimensions, View, StatusBar } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ConsumptionScreen from './ConsumptionScreen';
import VoltageScreen from './VoltageScreen';
import { FontAwesome } from '@expo/vector-icons'; // Assuming you are using Expo

const FirstRoute = () => (
  <ConsumptionScreen />
);

const SecondRoute = () => (
  <VoltageScreen />
);

export default class TabViewExample extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'chat', icon: 'home' },
      { key: 'status', icon: 'bar-chart' },
    ],
  };

  render() {
    return (
      <>
        <StatusBar backgroundColor={'#4AC998'}/>
        <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            chat: FirstRoute,
            status: SecondRoute,
          })}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: '#07130f' }}
              style={{ backgroundColor: '#4AC998' }}
              labelStyle={{ color: '#07130F', fontSize: 16, fontWeight: '500', textTransform: 'none' }}
              renderIcon={({ route, focused, color }) => (
                <FontAwesome name={route.icon} size={24} color={color} />
              )}
            />
          )}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get('window').width }}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});