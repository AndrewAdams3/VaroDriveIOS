import React from 'react';
import RootStack from './config/Routes'
import { Provider } from 'react-redux'
import  { store }  from './redux/store2'
import { View } from 'react-native'

export default class App extends React.Component {

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Provider store={store}>
            <RootStack /> 
        </Provider>
      </View>
    );
  }
}