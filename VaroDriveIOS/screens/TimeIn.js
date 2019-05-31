import React from 'react';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { colors, vars } from '../config/styles'
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import constants from '../config/constants'
import {setOnClock, setLocation} from '../redux/store2'

import axios from 'axios';
import { connect } from 'react-redux';

const GOOGLE_API_KEY = 'AIzaSyB-_ttHRMq1Qslv1TLRZOxRbXlkMJc5YWM'

const mapStateToProps = (state) => {
  return {
    onClock: state.onClock,
    email: state.email,
    password: state.password,
    location: state.location,
    userId: state.userId
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setOnClock: (onClock) => { dispatch(setOnClock(onClock)) },
    setLocation: (loc) => { dispatch(setLocation(loc)) }
  };
}

class TimeInScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      now: "",
      hasClocked: false,
      onTime: -1,
      offTime: -1,
      lat: 0,
      lon: 0,
      loc: "",
    }
    this.getOnTime();
    this.newTime = require('../config/images/TimeIn.png');
    this.background = require('../config/images/background.png');
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        "Time Clock"
      ),
      headerTransparent: true,
    }
  };

  componentDidMount() {
    this.getCurrentLocation()
    this.startTimer();
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getAddress = () => { 
    console.log('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.lat.toString() + ',' + this.state.lon.toString() + '&key=' + GOOGLE_API_KEY);
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.lat.toString() + ',' + this.state.lon.toString() + '&key=' + GOOGLE_API_KEY)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson.results[0].formatted_address));
        var address = JSON.stringify(responseJson.results[0].formatted_address).replace("\"", "");
        address = address.substr(0,address.length-1);
        this.props.setLocation(address);
        this.setState({ searching: false });
    })
  }

  getCurrentLocation = async () => {
    this.setState({searching: true});
    if (Platform.OS === 'android') { 
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION); 
      if (!granted) {
        this.setState({ searching: false });
        console.log("permission problemo"); 
        return; 
      } 
    }
    Geolocation.getCurrentPosition(
      (position) => {
        this.geoSuccess(position);
      },
      (error) => {
        // See error code charts below.
        this.setState({ searching: false });
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  }

  geoSuccess = (position) => {
    console.log("success");
    this.setState({lat: position.coords.latitude});
    this.setState({lon: position.coords.longitude});
    this.getAddress();
  }

  geoError = () => {
    this.setState({ searching: false });
    console.log("geo problemo");
  }

  getCurrentTime = () => {
    return new Date().getTime();
  }

  startTimer = () => {
    const now = new Date().getTime();
    this.setState({
      now: now
    })
    this.timer = setInterval(() => {
      if(this.props.onClock){ 
        this.setState({ now: new Date().getTime() - this.state.onTime});
      }
    }, 100);
  }

  msToTime = (duration, running) => {
    if(!running){
      var d = new Date(duration);
      var hours = d.getHours();
      hours = hours > 12 ? hours - 12 : hours;
      var minutes = d.getMinutes();
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      if (!running) hours = hours == 0 ? 12 : hours;
      return hours + ":" + minutes;
    }
    else{
      var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);
      seconds = milliseconds > 5 ? (seconds + 1) : seconds;
      hours = (hours < 10) ? "0" + hours : hours;
      hours = (hours > 12) ? hours - 12 : hours;
      if (!running) hours = hours == 0 ? 12 : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;
      return hours + ":" + minutes + ":" + seconds;
    }
  }

  /* msToTime = (duration, running) => {
    var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    seconds = milliseconds > 5 ? (seconds+1) : seconds;
    hours = (hours < 10) ? "0" + hours : hours;
    hours = (hours > 12) ? hours - 12 : hours;
    if(!running) hours = hours == 0 ? 12 : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    console.log("HRS: ", hours + "time: ", new Date(duration).getHours());
    return hours + ":" + minutes + ":" + seconds;
  } */
  setUserOnClock = (on) => {
    var url = 'http://' + constants.ip + ':3210/data/users';
    axios.put(url, {
      id: this.props.userId,
      value: on
    })
  }

  confirm = () => {
    this.props.onClock ? 
    Alert.alert(
      'End Shift?',
      'My Alert Msg',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => this.handleOffShift(false) },
      ],
      { cancelable: false },
    )
    :
    Alert.alert(
      'Start Shift?',
      'My Alert Msg',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => this.handleOnShift() },
      ],
      { cancelable: false },
    );
  }

  createNewTimeClock = async (time) => {
    var url = 'http://' + constants.ip + ':3210/data/times/newTime';
    console.log("newtime: " + this.state.onTime.getTime());
    await axios.post(url, {
      id: this.props.userId,
      sLocation: this.props.location,
      sTime: time.getTime()
    }).then(() => {

    })
  }

  finishTimeClock = async () => {
    var url = 'http://' + constants.ip + ':3210/data/times/endTime';
    await this.getCurrentLocation().then(
      await axios.put(url, {
        eLocation: this.props.location,
        sTime: this.state.onTime.getTime(),
        id: this.props.userId,
        eTime: new Date().getTime()
      }).then(() => { })
    )
  }

  handleOnShift = () => {
    if(this.props.location == ""){
      this.getCurrentLocation().then( (res) => {
        const date = new Date()
        this.setState({ onTime: date, hasClocked: true });
        this.setState({ offTime: -1 });
        this.createNewTimeClock(date);
        this.props.setOnClock(true); //sets onclock prop global
        this.setUserOnClock(true); //set user to onclock in db
      }).catch( (err) => {
        console.log(err);

      });
    }
    else{
      const date = new Date()
      this.setState({ onTime: date, hasClocked: true });
      this.setState({ offTime: -1 });
      this.createNewTimeClock(date);
      this.props.setOnClock(true); //sets onclock prop global
      this.setUserOnClock(true); //set user to onclock in db
    }
  }
  handleOffShift = (onC) => {
    this.setState({offTime: new Date()});
    this.finishTimeClock();
    this.props.setOnClock(false); //sets onclock prop global
    this.setUserOnClock(false); //set user to onclock in db
  }

  locAlert = () => {
      Alert.alert(
        'No Location Found',
        'Please let your location load',
        [
          {
            text: 'ok',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'retry',
            onPress: this.getCurrentLocation,
            style: 'default',
          },
        ],
      )
  }

  clockPress() {
    if (this.props.location != "")
      this.confirm();
    else
      this.locAlert()
  }

  getOnTime = async () => {
    var url = 'http://' + constants.ip + ':3210/data/times';
    await axios.post(url, {
      id: this.props.userId
    }).then((res) => {
      if(res.data.found == true){
        this.setState({onTime: new Date(res.data.sTime)})
        this.props.setOnClock(true)
        this.setState({ hasClocked: true });
        console.log("onclock? ", res.data.found, res.data.sTime);
      }
      else{
        this.props.setOnClock(false);
      }
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.background} source={ this.background } />
        <View style={{ height: '5%' }} />
        <View style={[styles.container, {paddingLeft: 10, paddingRight: 10}]}>
          <View style={[styles.locationView, {paddingTop: isIphoneX() ? 80 : 0}]} >
            <Text numberOfLines = {2} style={{ flex: 1, height: 100, flexWrap: 'wrap', color: this.props.location ? 'white' : 'transparent', fontSize: 24, textAlign: 'center' }}>
              {this.props.location || "\n\n"}
            </Text>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity 
            style={styles.newTime}
              onPress={ this.clockPress.bind(this)}
            >
              <Image source={this.newTime} style={{height: 200, width: 200, resizeMode:'stretch', tintColor: 'white'}} />
            </TouchableOpacity>
            <View style={styles.timeTableContainer}>
              <Text style={[styles.timeTable, {borderRightColor: 'white'}]}>Time In</Text>
              <Text style={styles.timeTable}>Total Time</Text>
              <Text style={[styles.timeTable, {borderLeftColor: 'white'}]}>Time Out</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20}}>
              <Text style={[styles.timeTableContent, {marginHorizontal: 30}]}>{this.state.onTime != -1 ? this.msToTime(this.state.onTime) + (new Date(this.state.onTime).getHours() > 11 ? "\nPM" : "\nAM") : "-- : --"} </Text>
              <Text style={[styles.timeTableContent, {marginHorizontal: 30}]}>{this.state.hasClocked == false ? "-- : -- : --" : this.msToTime(this.state.now, true)}</Text>
              <Text style={[styles.timeTableContent, {marginHorizontal: 30}]}>{this.state.offTime != -1 ? this.msToTime(this.state.offTime) + (new Date(this.state.offTime).getHours() > 11 ? "\nPM" : "\nAM"): "-- : --"}</Text>
            </View>
          </View>
          <View style={[styles.buttonsContainer, { position: 'absolute' }]}>
            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Home')}>
              <Text style={styles.buttonText}>Edit Shift</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('TimeSheet')}>
              <Text style={styles.buttonText}>Timesheet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TimeInScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: .9,
    overlayColor: 'grey'
  },
  locationView: {
    flex: .4,
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '80%',
    
  },
  newTime: {
    backgroundColor: 'transparent', 
    justifyContent: 'center',
    paddingBottom: 20
  },
  timeTableContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: colors.PRIMARY_BACKGROUND, 
    opacity: .9, 
    borderRadius: 5 
  },
  timeTable: {
    flex: 1, 
    textAlign: 'center', 
    fontSize: 20
  },
  timeTableContent: {
    color: 'white', 
    fontSize: 20, 
    textAlign: 'center'
  },
  TimeButtonContainer: {
    flex: 1,
    paddingRight: 30,
    paddingLeft: 30,
    justifyContent: 'space-around',
    marginTop: 10,
  }, 
  buttonsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    bottom: 0,
  },
  button: {
    width: '50%',
    height: 100,
    backgroundColor: colors.PRIMARY_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.SECONDARY_BACKGROUND,
    opacity: .9,
    borderRadius: 10
  },
  buttonText: {
    color: colors.TEXT_COLOR,
    fontSize: 18
  },
  headerText: {
    fontSize: 20,
    textAlign: 'center'
  },
});