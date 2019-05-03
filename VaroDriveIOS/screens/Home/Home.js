import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, AsyncStorage } from 'react-native';
import { colors, vars } from '../../config/styles'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { images } from '../../config/images'

const ACCESS_TOKEN = 'access_token';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {   
        }
      show= 'flex'
      this.background = require('../../config/images/background.png');
      this.newTime = require('../../config/images/TimeIn.png');
      this.DriveBy = require('../../config/images/DriveBy.png');
      this.timeSheet = require('../../config/images/TimeSheet.jpg');
      this.arrow = require('../../config/images/arrowright.jpg')
      this.profile = require('../../config/images/profile.png')
    }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        "Home"
      ),
      headerTransparent: true,
    }
  };

  handlePress = (num, nav) => {
    this.props.navigation.navigate(nav)
  }
  render() {

      return (
          <View style={[styles.container, {display: this.show}]}>
            <Image source={this.background} style={styles.background} />
            <View style={styles.container}>
              <TouchableOpacity style={[styles.buttonsContainer, {borderTopWidth: 0}]} onPress={() => {this.handlePress(0, 'Profile')}}>
              <Image style={[styles.image, { transform: [{ scaleX: .7 }, { scaleY: .7 }]}]} source={this.profile} />
                <Text style={styles.buttonText}>Profile</Text>
                <Image style={styles.imageR} source={this.arrow} />
              </TouchableOpacity>
            <TouchableOpacity style={styles.buttonsContainer} onPress={() => this.props.navigation.navigate('TimeIn')}>
                <Image style={styles.image} source={this.newTime} />
                <Text style={styles.buttonText}>Time Clock</Text>
              <Image style={styles.imageR} source={this.arrow} />
              </TouchableOpacity>
            <TouchableOpacity style={styles.buttonsContainer} onPress={() => this.props.navigation.navigate('NewDB')}>
                <Image style={[styles.image, {transform: [{scaleX:-1}] }]} source={this.DriveBy} />
                <Text style={styles.buttonText}>Drive By</Text>
              <Image style={styles.imageR} source={this.arrow} />
              </TouchableOpacity>
            <TouchableOpacity style={styles.buttonsContainer} onPress={() => this.props.navigation.navigate('TimeSheet')}>
                <Image style={styles.image} source={this.timeSheet} />
                <Text style={styles.buttonText}>Time Sheet</Text>
              <Image style={styles.imageR} source={this.arrow} />
              </TouchableOpacity>
            </View>
          </View>
      );
  } 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        height: '100%',
        marginTop: 40
    },
    background: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      opacity: .9,
      overlayColor: 'grey'
    },
    TextContainer: {
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
    buttonsContainer: {
//        backgroundColor: 'white',
        width: '100%',
        height: '25%',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        flex: 1,
        borderColor: 'white',
        //borderWidth: 1,
        borderTopWidth: 0,
        borderBottomWidth: 0
    },
    button: {
        width: '45%',
        height: 45,
        borderRadius: 50,
        backgroundColor: colors.SECONDARY_BACKGROUND,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
      color: 'white', 
      fontSize: 26,
      flex: 2,
      textAlign: 'center'
    },
    image: {
      flex: .75, 
      tintColor: 'white', 
      resizeMode: 'contain'
    },
    imageR: {
      flex: .5,
      height: 30,
      resizeMode: 'contain',
      tintColor: 'white'
    }
});