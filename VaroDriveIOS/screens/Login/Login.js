import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, vars } from '../../config/styles'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import LoginSlide from '../../components/LoginSlide'


export default class LoginScreen extends React.Component {

  constructor(props){ 
    super(props) 
    this.state = {
      currentOnboardingView: 1,
    }
  }

  isActiveIndicator = (index) => this.state.currentOnboardingView == index ? styles.activeIndicator : {}

  getScreen = (newView) => {
    if(newView !== this.state.currentOnboardingView){
      this.setState({
        currentOnboardingView: newView
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
          {/* Onboarding thingy */}
        <View style={{ flex: 1 }}>
            <LoginSlide OnGetScreen={(e) => this.getScreen(e)}/>
        </View>

        {/* Buttons */}
        <View style={[styles.buttonsContainer, {position: 'absolute'}]}>
          <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('AuthScreen')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('SignUp')}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Indicators */}
        <View style={[styles.indicatorsContainer, {paddingBottom: 10}]}>
          <View style={[styles.indicator, this.isActiveIndicator(0) ]}></View>
          <View style={[styles.indicator, this.isActiveIndicator(1) ]}></View>
          <View style={[styles.indicator, this.isActiveIndicator(2) ]}></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: colors.PRIMARY_BACKGROUND,
    ...ifIphoneX({
      paddingBottom: vars.iPhoneXPaddingBottom
    })
  },
  onboardingTextContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%'
  },
  onboardingHeader: {
    fontSize: 24,
    color: colors.DARKER_BACKGROUND,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  onboardingText: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.TEXT_COLOR
  },
  buttonsContainer: {
    width: '100%',
    paddingRight: 30,
    paddingLeft: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    bottom: 0,
    paddingBottom: 50,
  },
  button: {
      width: '45%',
      height: 45,
      borderRadius: 50,
      backgroundColor: colors.SECONDARY_BACKGROUND,
      justifyContent: 'center',
      alignItems: 'center'
  },
  buttonText: {
    color: colors.TEXT_COLOR
  },
  indicatorsContainer: {
    width: '100%',
    paddingRight: 30,
    paddingLeft: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 5,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 100,
    borderWidth: 3,
    marginLeft: 2.5,
    marginRight: 2.5,
    borderColor: colors.SECONDARY_BACKGROUND
  },
  activeIndicator: {
    backgroundColor: colors.SECONDARY_BACKGROUND
  }
})
