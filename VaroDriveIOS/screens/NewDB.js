import React from 'react';
import { View, Text, Alert, Dimensions, ScrollView, ActivityIndicator, Platform, PermissionsAndroid, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { colors } from '../config/styles'
import ImagePicker from 'react-native-image-picker'

import axios from 'axios'
import {connect} from 'react-redux'
import constants from '../config/constants'
import { setLocation } from '../redux/store2'
import {isIphoneX} from 'react-native-iphone-x-helper'

import Geolocation from 'react-native-geolocation-service';

const HEIGHT = Dimensions.get("screen").height;
const WIDTH = Dimensions.get("screen").width

const mapStateToProps = (state) => {
  return {
    location: state.location,
    userId: state.userId
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setLocation: (loc) => { dispatch(setLocation(loc)) }
  };
}

class NewDBScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      city: "",
      state: "",
      county: "",
      postal: "",
      fields: [
        address = {
          name: "address",
          prompt: "House Address",
          value: ""
        },
        date = {
          name: "date",
          prompt: "Date Property Was Found",
          value: new Date()
        },
        type = {
          name: "type",
          prompt: "Type of Property", 
          value: -1
        },
        vacant = {
          name: "vacant",
          prompt: "Was it Visibly Vacant?",
          value: false,
          opacityl: 0,
          opacityr: 0
        },
        burned = {
          name: "burned",
          prompt: "Was it Burned?",
          value: false,
          opacityl: 0,
          opacityr: 0
        }, 
        boarded = {
          name: "boarded",
          prompt: "Was it Boarded?",
          value: false,
          opacityl: 0,
          opacityr: 0
        },
      ],
      enum: {
        "address": 0,
        "date": 1,
        "type": 2,
        "vacant": 3,
        "burned": 4,
        "boarded": 5 
      },
      VacPress: 0,
      BoardPress: 0,
      BurnPress: 0,
      refresh: false,
      avatar: "",
      hasPic : false,
      post: {},
      sending: false
    }
    this.circle = require('../config/images/circle.png');
    this.bg = require('../config/images/background.png');
    show = 'flex'
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        "New Drive By"
      ),
      headerTransparent: true,
    }
  };
  
  handleChange = (value, name) => {
    var type = this.state.enum[name]
    let newFields = this.state.fields;
    newFields[type].value = value;
     this.setState({
       fields: newFields,
       refresh: !this.state.refresh
     });
  };
  handleBoolPress = (val, name) => {
    let type = this.state.enum[name]
    let newfields = this.state.fields
    newfields[type].value = val;
    newfields[type].opacityl = val ? 1 : 0;
    newfields[type].opacityr = val ? 0 : 1;

    this.setState({
      fields: newfields,
    })
    this.forceUpdate();
  }

  // variable to hold the references of the textfields
  inputs = {};

  // function to focus the field
  focusTheField = (id) => {

    this.inputs[id].focus();

  }

 formItem = (num) => {
   var placeholder
   switch(num){
    case 0:
      placeholder = this.state.hasPic ? this.state.location : "Address will load after image is taken..."
       break;
    case 1:
      placeholder = new Date().toDateString() + " " + new Date().toTimeString()
       break;
    case 2:
      placeholder = "type"
      break;
    default:
      placeholder = ""
      break;
   }
  return (
    <View style={{ flex: 1, width: '100%', borderBottomWidth: 1, borderBottomColor: colors.PRIMARY_BACKGROUND, padding: 10 }}>
      <Text style={{ fontSize: 20, color: 'white' }}>{" - " + this.state.fields[num].prompt}</Text>
      <View style={{ marginHorizontal: 10, borderWidth: isIphoneX() ? 3 : 1, borderColor: colors.PRIMARY_BACKGROUND, borderRadius: 5 }}>
        <TextInput
          style={[{color: 'white'}, isIphoneX() ? {height:35} : {}] }
          editable={(placeholder == "Address will load after image is taken..." || num == 1 ) ? false : true}
          ref={input => { this.inputs[this.state.enum[this.state.fields[num].name]] = input }}
          returnKeyType={"next"}
          placeholder={this.state.fields[num].value == "" ? placeholder : num == 1 ? this.state.fields[num].value.toDateString() + " " + this.state.fields[num].value.toTimeString() : this.state.fields[num].value}
          value={this.state.fields[num].value == "" ? placeholder : num == 1 ? this.state.fields[num].value.toDateString() + " " + this.state.fields[num].value.toTimeString() : this.state.fields[num].value}
          placeholderTextColor={"white"}
          underlineColorAndroid="transparent"
          onBlur={this.onSubmit}
          onChangeText={(change) => this.handleChange(change, this.state.fields[num].name)}
          onSubmitEditing={() => { num != 2 ? this.focusTheField(this.state.enum[this.state.fields[num].name] + 1) : {} }}
        />
      </View>
    </View>
  )
 }

 boolItem = (num) => {
  return(
    <View style={{ flex: 1, width: '100%', padding: 10 }}>
      <Text style={{ fontSize: 20, color: 'white' }}>{" - " + this.state.fields[num].prompt}</Text>
      <View style={{ paddingTop: 5, alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', marginHorizontal: 10, borderRadius: 5 }}>
        <TouchableOpacity onPress={() => { this.handleBoolPress(true, this.state.fields[num].name) }} style={[this.state.fields[num].opacityl > 0 ? {backgroundColor: 'green'} : {backgroundColor: colors.PRIMARY_BACKGROUND, opacity: .9}, { paddingVertical: 7, flex: 1, borderBottomLeftRadius: 5, borderTopLeftRadius: 5, borderWidth: 1, borderColor: colors.SECONDARY_BACKGROUND }]}>
          <Text style={styles.boolText}>{num == 5 ? "Yes" : "Yes/Maybe"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { this.handleBoolPress(false, this.state.fields[num].name) }} style={[this.state.fields[num].opacityr > 0 ? { backgroundColor: 'red' } : { backgroundColor: colors.PRIMARY_BACKGROUND, opacity: .9 }, { paddingVertical: 7, flex: 1, borderTopRightRadius: 5, borderBottomRightRadius: 5, borderWidth: 1, borderColor: colors.SECONDARY_BACKGROUND, borderLeftWidth: 0 }]}>
          <Text style={styles.boolText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
 }

  handleTypePress = (num) => {
    var nf = this.state.fields;
    nf[2].value = num;
    this.setState({fields: nf});
  } 

  pType = (num) => {
    return(
      <View style={{ flex: 1, width: '100%', padding: 10, borderBottomWidth: 1, borderBottomColor: colors.PRIMARY_BACKGROUND }}>
        <Text style={{ fontSize: 20, color: 'white' }}>{" - " + this.state.fields[num].prompt}</Text>
        <View style={{ paddingTop: 5, alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', marginHorizontal: 10, borderRadius: 5 }}>
          <TouchableOpacity onPress={() => { this.handleTypePress(0) }} style={{ backgroundColor: this.state.fields[num].opacityl > 0 ? 'green' : 'transparent', paddingVertical: 7, flex: 1, flexDirection: 'row' }}>
            <Image source={this.circle} style={{ height: 20, width: 20, tintColor: this.state.fields[2].value == 0 ? colors.PRIMARY_BACKGROUND : 'transparent', borderRadius: 15, borderWidth: 2, borderColor: colors.PRIMARY_BACKGROUND }}/>
            <Text style={styles.formText}>NOD</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.handleTypePress(1) }} style={{ backgroundColor: this.state.fields[num].opacityl > 0 ? 'green' : 'transparent', paddingVertical: 7, flex: 1, flexDirection: 'row' }}>
            <Image source={this.circle} style={{ height: 20, width: 20, tintColor: this.state.fields[2].value == 1 ? colors.PRIMARY_BACKGROUND : 'transparent', borderRadius: 15, borderWidth: 2, borderColor: colors.PRIMARY_BACKGROUND}} />
            <Text style={styles.formText}>HHS</Text>
          </TouchableOpacity>          
          <TouchableOpacity onPress={() => { this.handleTypePress(2) }} style={{ backgroundColor: this.state.fields[num].opacityl > 0 ? 'green' : 'transparent', paddingVertical: 7, flex: 1, flexDirection: 'row' }}>
            <Image source={this.circle} style={{ height: 20, width: 20, tintColor: this.state.fields[2].value == 2 ? colors.PRIMARY_BACKGROUND : 'transparent', borderRadius: 15, borderWidth: 2, borderColor: colors.PRIMARY_BACKGROUND }} />
            <Text style={styles.formText}>DB</Text>
          </TouchableOpacity>          
          <TouchableOpacity onPress={() => { this.handleTypePress(3) }} style={{ backgroundColor: this.state.fields[num].opacityl > 0 ? 'green' : 'transparent', paddingVertical: 7, flex: 1, flexDirection: 'row' }}>
            <Image source={this.circle} style={{ height: 20, width: 20, tintColor: this.state.fields[2].value == 3 ? colors.PRIMARY_BACKGROUND : 'transparent', borderRadius: 15, borderWidth: 2, borderColor: colors.PRIMARY_BACKGROUND }} />
            <Text style={styles.formText}>Tax Auction</Text>
          </TouchableOpacity>          
          <TouchableOpacity onPress={() => { this.handleTypePress(4) }} style={{ backgroundColor: this.state.fields[num].opacityl > 0 ? 'green' : 'transparent', paddingVertical: 7, flex: 1, flexDirection: 'row' }}>
            <Image source={this.circle} style={{ height: 20, width: 20, tintColor: this.state.fields[2].value == 4 ? colors.PRIMARY_BACKGROUND : 'transparent', borderRadius: 15, borderWidth: 2, borderColor: colors.PRIMARY_BACKGROUND }} />
            <Text style={styles.formText}>Lot</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  getCurrentLocation = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (!granted) {
        return;
      }
    }
    Geolocation.getCurrentPosition(
      (position) => {
        this.geoSuccess(position);
      },
      (error) => {
        // See error code charts below.
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  }
    geoSuccess = (position) => {
    this.setState({ lat: position.coords.latitude });
    this.setState({ lon: position.coords.longitude });

    axios.get('http://' + constants.ip + ':3210/location/' + this.state.lat + "/" + this.state.lon)
      .then( (res) => {
        this.setState({
          county: res.data.county,
          state: res.data.state,
          city: res.data.city,
          postal: res.data.postal
        })
        this.props.setLocation(res.data.address);
        var nf = this.state.fields;
        nf[0].value = res.data.address;
        this.setState({ hasPic: true, fields: nf });
      })
  }

  geoError = () => {
  }

  openCamera = () => {
     const options = {

    };
    ImagePicker.launchCamera( options, async (response) => {
      //;

      if (response.didCancel) {
        return
      } else if (response.error) {
        return
      } else if (response.customButton) {
      } else {
        //const source = { uri: response.uri };
        // You can also display the image using data:
        const source = { uri: 'data:image/jpeg;base64,' + response.data };
        
        const data = new FormData();
        data.append('name', 'avatar');
        data.append('image', {
          uri: response.uri,
          type: response.type,
          name: response.fileName
        });

        if(source != ""){
          this.getCurrentLocation();
          this.setState({
            refresh: !this.state.refresh,
            avatar: source,
            post: data
          });
        }  
      }
    });
  }
showAlert = () => {
  Alert.alert(
  'Error Submitting Form',
  'Please Ensure all Fields Are Filled Out',
    [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      { text: 'OK', onPress: () => {}},
    ],
      { cancelable: false },
  );

}
  showAlreadyAlert = () => {
    Alert.alert(
      'Driveby you entered is already in our system',
      'Finder\'s bonus can only be given to the original finder of a property',
      [
        {
          text: 'Cancel',
          onPress: () => this.props.navigation.navigate("Home"),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.props.navigation.navigate("Home") },
      ],
      { cancelable: false },
    );

  }
  handleSubmit = async () => {
    var url = 'http://' + constants.ip + ':3210/data/drivebys/upload';
  
    const post = this.state.post

    const config = {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data'
      },
      body: post,
    };
      this.setState({sending: true});
      await axios.post(url, post, config ).then( async (res) => {
        if (res.data.response == 0){
          url = 'http://' + constants.ip + ':3210/data/drivebys/newDB';
          await axios.post(url,{
            path: res.data.path,
            id: this.props.userId,
            address: this.state.fields[0].value,
            date: this.state.fields[1].value.getTime(),
            offset: this.state.fields[1].value.getTimezoneOffset(),
            type: this.state.fields[2].value,
            vacant: this.state.fields[3].value,
            burned: this.state.fields[4].value,
            boarded: this.state.fields[5].value,
            lat: this.state.lat,
            lon: this.state.lon,
            city: this.state.city,
            state: this.state.state,
            county: this.state.county,
            post: this.state.postal
          }).then( (res2) => {
            if(res2.data.response == 0){
              if(res2.data.already){
                this.showAlreadyAlert();
              }
              else 
                this.props.navigation.navigate('Home');
            }
            else{
              this.showAlert();
            }
          }).catch((err) => { })
        }
        else{
          this.showAlert();
        }
      }, (err) => {
        if(err.response.status == 500)
          this.showAlert();
      })
    this.setState({ sending: false });
  }

  MainView = () => {
    return(
      this.state.sending ?
      <ActivityIndicator 
      style={{flex: 1, width: '100%', height: '100%'}} 
      size='large'/>
      :
      <ScrollView>
        <Image source={this.bg} style={styles.background} />
        <TouchableOpacity style={{ marginHorizontal: '30%', marginVertical: '10%' }} onPress={() => this.openCamera()}>
            <Image source={this.state.avatar || require('../config/images/plus.png')} style={this.state.avatar ? { alignSelf: 'center', height: 70, width: 70} : { alignSelf: 'center', height: 40, width: 40 }} />
          <Text style={{ marginTop: 20, alignSelf: 'center', fontSize: 20, color: 'white' }}>{this.state.avatar ? "Change Image" : "Add Image"}</Text>
        </TouchableOpacity>
        {this.formItem(0)}
        {this.formItem(1)}
        {this.pType(2)}
        {this.boolItem(3)}
        {this.boolItem(4)}
        {this.boolItem(5)}
        <View style={[styles.buttonsContainer]}>
          <TouchableOpacity style={styles.button} onPress={() => { this.handleSubmit() }}>
            <Text style={{ fontSize: 18, color: 'white' }}>Submit</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginBottom: isIphoneX() ? 25 : 0}}/>
      </ScrollView>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.MainView()}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewDBScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: 80
  },
  background: {
    position: 'absolute',
    /* height: HEIGHT,
    width: WIDTH, */
    height: '100%',
    width: '100%',
    opacity: .9,
    overlayColor: 'grey'
  },
  buttonsContainer: {
    width: '100%',
    paddingRight: 30,
    paddingLeft: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    height: 50,
    width: '50%',
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.SECONDARY_BACKGROUND,
    backgroundColor: colors.PRIMARY_BACKGROUND,
    opacity: .9,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formText: {
    marginLeft: 20, 
    textAlign: 'center', 
    fontSize: 15, 
    color: 'white' 
  },
  boolText: { 
    textAlign: 'center', 
    fontSize: 15, 
    color: 'white' }
});