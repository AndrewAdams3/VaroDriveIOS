import React from 'react';
import RootStack from './config/Routes'
import Home from './screens/Home/Home'
import { Provider } from 'react-redux'
import  { store }  from './redux/store2'
import { View } from 'react-native'

export default class App extends React.Component {

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Provider store={store}>
            <Home /> 
        </Provider>
      </View>
    );
  }
}