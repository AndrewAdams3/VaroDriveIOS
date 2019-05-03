import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { colors, vars } from '../../config/styles'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import {images} from '../../config/images'

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentOnboardingView: 1
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerTitle: (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.headerTitle}>Inventory</Text>
        </View>
      ),
      headerTransparent: true,
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack(null)} style={{ paddingLeft: 20, width: '100%' }}>
          <Image style={{ width: 30, height: 30 }} source={{ uri: images.sideMenuIcon }} />
        </TouchableOpacity>
      ),
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.TextContainer}>
          <Text>this is the inventoryscreen</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...ifIphoneX({
      paddingBottom: vars.iPhoneXPaddingBottom
    }),
    backgroundColor: colors.PRIMARY_BACKGROUND
  },
  background: {
    flex: 1,
  },
  TextContainer: {
    flexDirection: 'row',
    flex: 1,
    alignContent: 'center',
    position: 'absolute',
    bottom: 300,
    width: '100%'
  },
  TextHeader: {
    fontSize: 24,
    color: colors.TEXT_COLOR,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  headerTitle: {
    position: 'absolute',
    fontWeight: "bold",
    color: colors.TEXT_COLOR,
    fontSize: 20,
    paddingRight: 50,
  }
});