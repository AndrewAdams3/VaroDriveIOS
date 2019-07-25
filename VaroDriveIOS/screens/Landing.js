import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
  PermissionsAndroid
} from 'react-native';


import axios from 'axios';
import { connect } from 'react-redux';

import {
  setFName, setVerified, 
  setLName, isLoggedIn, setEmail, 
  setPassword, setOnClock, setID, 
  setPic, setCity, setState, 
} from '../redux/store2'
import { colors } from '../config/styles';
import constants from '../config/constants'

const ACCESS_TOKEN = 'access_token';

const mapStateToProps = (state) => {
  return {
    email: state.email,
    password: state.password,
    userId: state.userId,
    profilePic: state.profilePic,
    fName: state.fName,
    lName: state.lName,
    isVerified: state.isVerified
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setEmail: (text) => { dispatch(setEmail(text)) },
    setPassword: (text) => { dispatch(setPassword(text)) },
    isLoggedIn: (val) => { dispatch(isLoggedIn(val)) },
    setOnClock: (val) => {dispatch(setOnClock(val)) },
    setID: (id) => { dispatch(setID(id)) },
    setPic: (pic) => {dispatch(setPic(pic))},
    setFName: (name) => { dispatch(setFName(name)) },
    setLName: (name) => { dispatch(setLName(name)) },
    setCity: (city) => { dispatch(setCity(city)) },
    setState: (state) => { dispatch(setState(state)) },
    setVerified: (val) => {dispatch(setVerified(val))}
  };
}

class LandingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.isVerified = false
  }

  componentDidMount(){
    this.mounted=true;
    if(this.mounted){
      this._bootstrapAsync();
      this.requestLocationPermission();
    }
  }

  componentWillUnmount(){
    this.mounted=false;
  }
  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool Location Permission',
          message:
            'Location needs access to your Location ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  }

   getUser = async (token, returner) => {
    var url = 'http://' + constants.ip + ':3210/data/users/id';
     var complete = false;
     await axios.post(url, { seshId: token }).then((Data) => {
      if(Data.data.ok == 1){
        if(!Data.data.userId) return true;
        if(Data.data.infoComplete === false){
          complete = false;
        } else{
          complete = true;
        }
        this.props.setID(Data.data.userId);
        this.props.isLoggedIn(returner);
        this.props.setPic(Data.data.pic.replace(/\\/g, "/"));
        this.props.setEmail(Data.data.email);
        this.props.setCity(Data.data.city);
        this.props.setState(Data.data.state);
        if(Data.data.fName != "") this.props.setFName(Data.data.fName);
        if(Data.data.lName != "") this.props.setLName(Data.data.lName);
        if(Data.data.isVerified) {
          this.props.setVerified(true)
          this.isVerified = true;
        };
      }
      else{
        return true;
      }
    }, (err) => {
    })
    return complete;
  }
  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem(ACCESS_TOKEN);

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    const returner = userToken ? true : false;
    if(returner){
      let complete = await this.getUser(userToken, returner);
      if (this.props.userId === "") {
        this.props.navigation.navigate('Auth');
        return;
      }
      if(!complete) {
        this.props.navigation.navigate("Setup");
        return;
      }
      this.props.navigation.navigate("App");
    }else{
      this.props.navigation.navigate('Auth');
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={{flex: 1,justifyContent: 'space-around', alignItems: 'center', backgroundColor: colors.PRIMARY_BACKGROUND}}>
        <ActivityIndicator/>
        <StatusBar barStyle='dark-content' />
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LandingScreen);