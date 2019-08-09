import React from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet, Image, AsyncStorage } from 'react-native';
import { colors, vars } from '../../config/styles'
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {   
        }
      this.background = require('../../config/images/psbackground.png');
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

  handlePress = (nav) => {
    this.props.navigation.navigate(nav)
  }
  render() {

      return (
          <View style={[styles.container]}>
            <Image source={this.background} style={styles.background} />
            <View style={[styles.container, {marginTop: 0, paddingHorizontal: 20, paddingVertical: 10}]}>
              <TouchableOpacity style={[styles.buttonsContainer, {backgroundColor: "rgba(53, 65, 78, .9)"}]} onPress={() => {this.handlePress('Profile')}}>
                <Image style={[styles.image, { transform: [{ scaleX: .7 }, { scaleY: .7 }]}]} source={this.profile} />
                <Text style={styles.buttonText}>Profile</Text>
                <Image style={styles.imageR} source={this.arrow} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonsContainer, {backgroundColor: "rgba(53, 65, 78, .9)"}]} onPress={() => {this.handlePress('TimeIn')}}>
                <Image style={styles.image} source={this.newTime} />
                <Text style={styles.buttonText}>Time Clock</Text>
                <Image style={styles.imageR} source={this.arrow} />
                </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonsContainer, {backgroundColor: "rgba(53, 65, 78, .9)"}]} onPress={() => {this.handlePress('NewDB')}}>
                <Image style={[styles.image, {transform: [{scaleX:-1}] }]} source={this.DriveBy} />
                <Text style={styles.buttonText}>Drive By</Text>
                <Image style={styles.imageR} source={this.arrow} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonsContainer, {backgroundColor: "rgba(53, 65, 78, .9)"}]} onPress={() => {this.handlePress('TimeSheet')}}>
                <Image style={styles.image} source={this.timeSheet} />
                <Text style={styles.buttonText}>Time Sheet</Text>
                <Image style={styles.imageR} source={this.arrow} />
              </TouchableOpacity>
              <View style={{height: isIphoneX() ? 20 : 0}}/>
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
        marginTop: Platform.OS === "ios" ? 100 : 80,
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
        width: '100%',
        height: '25%',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        flex: 1,
        borderWidth: 3,
        borderRadius: 10,
        borderColor: colors.PRIMARY_BACKGROUND,
        marginVertical: 3
    },
    buttonText: {
      color: 'white', 
      fontSize: 26,
      flex: 2,
      textAlign: 'center'
    },
    image: {
      flex: .5, 
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