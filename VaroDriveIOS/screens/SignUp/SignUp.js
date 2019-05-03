import React from 'react';
import { View, Alert, AsyncStorage, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Dimensions, Image, Keyboard, Animated } from 'react-native';
import { colors } from '../../config/styles'
import UserInput from '../../components/UserInput'
import { images } from '../../config/images'
import constants from '../../config/constants'
import axios from 'axios';
import { connect } from 'react-redux';
import { setEmail, setPassword, isLoggedIn, setID } from '../../redux/store2';

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
    setPassword: (text) => {dispatch(setPassword(text))},
    isLoggedIn: (val) => {dispatch(isLoggedIn(val))},
    setID: (id) => {dispatch(setID(id))}
  };
}

class SignUpScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentOnboardingView: 1,
      keyboardShowing: false,
      IMAGE_HEIGHT: 150,
      IMAGE_HEIGHT_SMALL: 100,
      CURRENT_IMAGE: new Animated.Value(130),
      data: [],
      loginSuccess: true,
      invalidEmail: false
    }
    this.logo = require("../../config/images/VaroLogo.png");
  }

  async storeToken(accessToken) {
    try {
      await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
      this.getToken();
    } catch (error) {
      console.log("Something went wrong");
    }
  }
  async getToken() {
    try {
      let token = await AsyncStorage.getItem(ACCESS_TOKEN);
      console.log("token: " + token);
    } catch (error) {
      console.log("Something went wrong");
    }
  }

  showAlert = () => {
    Alert.alert(
      'Email Verification',
      'Please enter a valid email address',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );

  }

  showCheckEmailAlert = () => {
    Alert.alert(
      'Email Verification',
      'Please check your email to confirm registration',
      [
        {
          text: 'Cancel',
          onPress: () => { this.continue() },
          style: 'cancel',
        },
        { text: 'OK', onPress: () => {this.continue()} },
      ],
      { cancelable: false },
    );
  }

  continue = () => {
    var url = 'http://' + constants.ip + ':3210/data/users/signup/isVerified/' + this.state.userId;
    console.log("userid testing: " + url);
    isV = false;
    axios.get(url)
      .then( function (res) {
        console.log('entry');
        if(res.data.ok == true){
          isV = true;
        }
      }, (err) => {
        console.log("err: ", err);
      });
      if(isV){
        console.log("verified")
        this.props.setID(this.state.userId);
        this.storeToken(this.state.seshId);
        this.props.navigation.navigate('Home'); //to waiting page for confirmation
        this.props.isLoggedIn(true);
      } else {
        console.log("notv")
        this.props.setID(this.state.userId);
        this.storeToken(this.state.seshId);
        this.props.isLoggedIn(true);
        this.props.navigation.navigate('NotVerified', { userId: this.state.userId});
      }
  }

  klikPost = async () => {
    var url = 'http://' + constants.ip + ':3210/data/users/signup';
    var signup = true;
    var seshId;
    var userId;
    if(this.props.email != '' && this.props.password != ''){
      const expression = /\S+@\S+/
      const valid = expression.test(String(this.props.email).toLowerCase())
      if(!valid){
        console.log("invalid email");
        this.showAlert();
        return;
      }
        await axios.post(url, {
          email: this.props.email,
          password: this.props.password
        })
          .then(function (response) {
            if (response.data.created == true) {
              signup = true
              seshId = response.data.seshId;
              userId = response.data.userId;
            }
            else{
              signup = false
            }
          })
          .catch(function (error) {
            console.log("error: " + error);
          });
      this.setState({ loginSuccess: signup });
      if(this.state.loginSuccess){
        this.showCheckEmailAlert();
        this.setState({ loginSuccess: signup });
        this.setState({userId: userId});
        this.setState({seshId: seshId });
        this.continue();
      }
      else{
      }
    }
  };

  componentWillMount() {
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
      }
    ).start();
    this.setState({ keyboardShowing: true });
  }

  _keyboardDidHide = () => {
    Animated.timing(
      this.state.CURRENT_IMAGE,
      {
        toValue: this.state.IMAGE_HEIGHT
      }
    ).start();
    this.setState({ keyboardShowing: false });
  }

  isValid = (success) => {
    return success ? {color: 'transparent'} : {color: 'red'};
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT, position: 'absolute' }} source={{ uri: images.background }}></Image>
        <View style={{ flex: 1, paddingBottom: 10 }}>
          <View style={{ height: 20 }} />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ScrollView scrollEnabled={this.state.keyboardShowing} ref="scroll" style={{flex:1}}>
              <KeyboardAvoidingView keyboardVerticalOffset={10} behavior="padding" style={{ flex: 1 }}>
                <Animated.Image style={[styles.logo, { height: this.state.CURRENT_IMAGE }]} source={this.logo} />
                <View style={{ flex: 1, paddingTop: 60 }}>
                  <View style={{ paddingBottom: 10 }}>
                    <Text style={[this.isValid(this.state.loginSuccess), {alignSelf: 'center'}, {paddingBottom: 10}]}>
                      User Already Exists
                    </Text>
                    <UserInput
                      source={{ uri: images.usernameIcon }}
                      placeholder={"email"}
                      autoCapitalize={'none'}
                      returnKeyType={'next'}
                      autoCorrect={false}
                      scale={22}
                    />
                  </View>
                  <View style={{ paddingBottom: 60 }}>
                    <UserInput
                      source={{ uri: images.passwordIcon }}
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
                  <Text style={[styles.buttonText, { fontSize: 18 }]}>Sign Up</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', padding: 20}} onPress = {() =>this.props.navigation.navigate('Auth')}>
                  <Text style = {[styles.buttonText, {fontSize : 16}]}>Already have an account? Login here</Text>
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
    backgroundColor: colors.PRIMARY_BACKGROUND,
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);