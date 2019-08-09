import React from 'react';
import { View, AsyncStorage, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Dimensions, Image, Keyboard, Animated } from 'react-native';
import { colors } from '../config/styles'
import UserInput from '../components/UserInput'
import { images } from '../config/images'
import axios from 'axios';
import { connect } from 'react-redux';
import { setEmail, setPassword, isLoggedIn, setID } from '../redux/store2';
import constants from '../config/constants'

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const ACCESS_TOKEN = 'access_token';

const mapStateToProps = (state) => {
  return {
    email: state.email,
    password: state.password,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setEmail: (text) => { dispatch(setEmail(text)) },
    setPassword: (text) => { dispatch(setPassword(text)) },
    isLoggedIn: (val) => { dispatch(isLoggedIn(val)) },
    setID: (id) => {dispatch(setID(id))}
  };
}

class AuthScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentOnboardingView: 1,
      keyboardShowing: false,
      IMAGE_HEIGHT: 150,
      IMAGE_HEIGHT_SMALL: 100,
      CURRENT_IMAGE: new Animated.Value(130),
      data: [],
      loginSuccess: true
    }
    this.logo = require("../config/images/VaroLogo.png");
    this.bg = require('../config/images/psbackground.png');
    this.usernameIcon = require('../config/images/usernameIcon.png');
    this.passwordIcon = require('../config/images/passwordIcon.png');

  }

  async storeToken(accessToken) {
    try {
      await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
      this.getToken();
    } catch (error) {
    }
  }
  async getToken() {
    try {
      let token = await AsyncStorage.getItem(ACCESS_TOKEN);
      //;
    } catch (error) {
    }
  }

  klikPost = async () => {
    var url = 'https://' + constants.ip + ':3210/data/users/login';
    var loggedIn = false;
    var seshId;
    var userId;
    var verified;
    console.log("testing2", this.props.email, this.props.password);
    if (this.props.email != '' && this.props.password != '') {
      console.log("testing");
      await axios.post(url, {
        email: this.props.email,
        password: this.props.password
      })
        .then(function (response) {
          console.log("res", response.data);
          if (response.data.loggedIn === true) {
            loggedIn = true,
            seshId = response.data.seshId
            userId = response.data.userId
            verified = response.data.verified
          }
          else {
            loggedIn = false
          }
        })
        .catch(function (error) {
          console.log("err at",  url, error);
        });
      this.setState({ loginSuccess: loggedIn });
      if (this.state.loginSuccess === true && seshId && verified) {
        this.storeToken(seshId);
        this.props.isLoggedIn(true);
        this.props.setID(userId);
        this.props.navigation.navigate('Landing');
      } else if(this.state.loginSuccess === true && !verified){
        this.props.navigation.navigate('NotVerified');
      }
    }
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    Animated.timing(
      this.state.CURRENT_IMAGE,
      {
        toValue: this.state.IMAGE_HEIGHT_SMALL
      },
      useNativeDriver=true
    ).start();
    this.setState({ keyboardShowing: true });
  }

  _keyboardDidHide = () => {
    Animated.timing(
      this.state.CURRENT_IMAGE,
      {
        toValue: this.state.IMAGE_HEIGHT
      },
      useNativeDriver = true
    ).start();
    this.setState({ keyboardShowing: false });
  }

  isValidPass = (success) => {
    return success ? {color: 'transparent'} : styles.validPassMessage;
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.background} source={ this.bg }></Image>
        <View style={{ flex: 1, paddingBottom: 10 }}>
          <View style={{ height: 20 }} />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ScrollView scrollEnabled={this.state.keyboardShowing} ref="scroll" style={{ flex: 1 }}>
              <KeyboardAvoidingView keyboardVerticalOffset={10} behavior="padding" style={{ flex: 1 }}>
                <Animated.Image style={[styles.logo, { height: this.state.CURRENT_IMAGE }]} source={this.logo} />
                <View style={{ flex: 1, paddingTop: 60 }}>
                  <View style={{ paddingBottom: 10 }}>
                    <Text style={[this.isValidPass(this.state.loginSuccess), { alignSelf: 'center' }, { paddingBottom: 10 }]}>
                      No Account Found with Those Credentials
                    </Text>
                    <UserInput
                      source={ this.usernameIcon }
                      keyboardType={'email-address'}
                      placeholder={"email"}
                      autoCapitalize={'none'}
                      returnKeyType={'next'}
                      autoCorrect={false}
                      scale={22}
                    />
                  </View>
                  <View style={{ paddingBottom: 60 }}>
                    <UserInput
                      source={ this.passwordIcon }
                      placeholder={"password"}
                      autoCapitalize={'none'}
                      returnKeyType={'done'}
                      autoCorrect={false}
                      scale={22}
                      secureTextEntry={true}
                    />
                  </View>
                </View>
              </KeyboardAvoidingView>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={this.klikPost}>
                  <Text style={[styles.buttonText, { fontSize: 18 }]}>Log In</Text>
                </TouchableOpacity>
              </View>
{/*               <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.ForgotPassbutton} onPress={() => this.props.navigation.navigate('Login')}>
                  <Text style={[styles.buttonText, { fontSize: 15 }]}>Forgot Password?</Text>
                </TouchableOpacity>
              </View> */}
              <View>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }} onPress={() => this.props.navigation.navigate('SignUp')}>
                  <Text style={[styles.buttonText, { fontSize: 16 }]}>Don't have an account yet? Register here</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 35 }} />
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: .9,
    overlayColor: 'grey'
  },
  TextContainer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    paddingTop: 20,
  },
  buttonsContainer: {
    width: '100%',
    paddingRight: 30,
    paddingLeft: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    width: DEVICE_WIDTH - 40,
    height: 50,
    borderRadius: 40,
    backgroundColor: colors.SECONDARY_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  ForgotPassbutton: {
    height: 45,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginTop: '10%',
    opacity: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignSelf: 'center',
    tintColor: 'white'
  },
  validPassMessage: {
    color: 'red'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);