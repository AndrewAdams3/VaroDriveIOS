import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native'
import { colors } from '../config/styles'

const ACCESS_TOKEN = 'access_token';

export default class SideMenu extends React.Component {
  constructor(props) {
    super(props)   
  }
  async logOut() {
    try {
      AsyncStorage.setItem(ACCESS_TOKEN, "");
      this.props.navigation.navigate('Login');
    } catch (error) {
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.sideBox}>
          <View style={{ height: 10 }}></View>
          <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Home')}>
          <View style={styles.buttonContent}>
            <Text style={styles.title}>
              Home
            </Text>
           </View>
          </TouchableOpacity>
          <View style={{ height: 10 }}></View>
          <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('TimeIn')}>
            <View style={styles.buttonContent}>
              <Text style={styles.title}>
                Clock In
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ height: 10 }}></View>
          <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Home')}>
            <View style={styles.buttonContent}>
              <Text style={styles.title}>
                DriveBy
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{height: 70}}></View>
          <TouchableOpacity style={[styles.button, { borderColor: 'red', backgroundColor: 'red' }]} onPress={() => this.logOut()}>
            <View style={styles.buttonContent}>
              <Text style={styles.title}>
                Log Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.SECONDARY_BACKGROUND
  },
  sideBox:{
    paddingTop: 30,
    paddingLeft: 5,
    right: '16%',
    flex: 1,
    flexDirection: 'column'
  },
  buttonContent:{
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    left: 140,
    borderWidth: 5,
    borderRadius: 30,
    width: '30%',
    height: '20%',
    borderColor: colors.PRIMARY_BACKGROUND,
    backgroundColor: colors.PRIMARY_BACKGROUND,
    opacity: .4,
  },
  title: {
    fontSize: 24,
    color: 'white',
  },
})
