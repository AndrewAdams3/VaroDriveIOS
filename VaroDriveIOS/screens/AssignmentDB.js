import React from 'react';
import { 
  View, Text, Alert, 
  SectionList, ScrollView, ActivityIndicator, 
  Platform, PermissionsAndroid, TouchableOpacity, 
  StyleSheet, Image, TextInput, Dimensions
} from 'react-native';
import { colors } from '../config/styles'
import ImagePicker from 'react-native-image-picker'

import axios from 'axios'
import {connect} from 'react-redux'
import constants from '../config/constants'
import { setLocation } from '../redux/store2'
import {isIphoneX} from 'react-native-iphone-x-helper'

import Geolocation from 'react-native-geolocation-service';

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

const HEIGHT = Dimensions.get('screen').height;

class NewDBScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      city: "",
      state: "",
      county: "",
      postal: "",
      fields: [
        date = {
          name: "date",
          prompt: "Date Property Was Found",
          value: new Date()
        },
        vacant = {
          name: "vacant",
          prompt: "Was it Visibly Vacant?",
          value: null,
          opacityl: 0,
          opacityr: 0
        },
        burned = {
          name: "burned",
          prompt: "Was it Burned?",
          value: null,
          opacityl: 0,
          opacityr: 0
        }, 
        boarded = {
          name: "boarded",
          prompt: "Was it Boarded?",
          value: null,
          opacityl: 0,
          opacityr: 0
        },
      ],
      enum: {
        "date": 0,
        "vacant": 1,
        "burned": 2,
        "boarded": 3 
      },
      VacPress: 0,
      BoardPress: 0,
      BurnPress: 0,
      refresh: false,
      avatar: "",
      hasPic : false,
      post: {},
      sending: false,
      selected: "",
      assignments: []
    }
    this.circle = require('../config/images/circle.png');
    this.bg = require('../config/images/psbackground.png');
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

  componentDidMount(){
    axios.get('https://' + constants.ip + ':3210/data/assignments/byId/incomplete/' + this.props.userId)
      .then(({data}) => {
        let sortedData = data.sort((a, b) => {
          if(a.Date > b.Date) return -1;
          else if (a.Date < b.Date) return 1;
          else return 0;
        })
        this.setState({assignments: sortedData, refresh: !this.state.refresh});
      })
  }
  
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

 formItem = (num) => {
  return (
    <View style={{ flex: 1, width: '100%', borderBottomWidth: 2, borderBottomColor: colors.PRIMARY_BACKGROUND, padding: 10 }}>
      <Text style={{ fontSize: 20, color: 'white' }}>{" - " + this.state.fields[num].prompt}</Text>
      <View style={{ marginHorizontal: 10, borderWidth: 3, borderColor: colors.PRIMARY_BACKGROUND, borderRadius: 5 }}>
        <TextInput
          style={[{color: 'white', paddingHorizontal: 10}, isIphoneX() ? {height:35} : Platform.OS === "ios" ? {height: 30} : {}] }
          editable={false}
          returnKeyType={"next"}
          placeholder={this.state.fields[num].value.toDateString()}
          placeholderTextColor={"white"}
          underlineColorAndroid="transparent"
          onBlur={this.onSubmit}
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

    axios.get('https://' + constants.ip + ':3210/location/' + this.state.lat + "/" + this.state.lon)
      .then( (res) => {
        this.setState({
          county: res.data.county,
          state: res.data.state,
          city: res.data.city,
          postal: res.data.postal,
          street: res.data.street
        })
        this.props.setLocation(res.data.address);
        this.setState({ hasPic: true, address: res.data.address});
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
  );}
  
  handleSubmit = async () => {
    if(this.state.address && this.state.selected){
      var url = 'https://' + constants.ip + ':3210/data/drivebys/upload';
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
          url = 'https://' + constants.ip + ':3210/data/drivebys/newDB';
          await axios.post(url,{
            path: res.data.path,
            id: this.props.userId,
            address: this.state.selected,
            street: this.state.street,
            assignment: true,
            date: this.state.fields[0].value.getTime(),
            offset: this.state.fields[0].value.getTimezoneOffset(),
            type: null,
            vacant: this.state.fields[1].value,
            burned: this.state.fields[2].value,
            boarded: this.state.fields[3].value,
            lat: this.state.lat,
            lon: this.state.lon,
            city: this.state.city,
            state: this.state.state,
            county: this.state.county,
            post: this.state.postal
          }).then( (res2) => {
            if (res2.data.response !== 0) {
              this.showAlert();
            }
            else{
              url = 'https://' + constants.ip + ':3210/data/assignments/complete/one/' + this.props.userId;
              axios.put(url, {
                address: this.state.selected,
              }).then(({ data }) => {
                if (data.ok === -1) {
                  this.showAlert()
                } else {
                  url = 'https://' + constants.ip + ':3210/data/assignments/complete/byId/' + this.state.selectedId;
                  axios.put(url).then(({ data }) => {
                    if (data.ok === 1)
                      this.props.navigation.navigate("Home");
                    else this.showAlert();
                  });
                }
              })
            }
          })
        }
        else {
          this.showAlert();
        }
      }, (err) => {
        if (err.response.status == 500)
          this.showAlert();
      })
    this.setState({ sending: false });
    } else{
      this.showAlert();
    }
  }
  
  renderItem = ({item, section}) => {
    const {address} = item;
    const id = section.ass._id;
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={() => {this.setState({selected: address, selectedId: id})}}style={{flex: 1, flexDirection: "row", marginVertical: 7, padding: 5, borderRadius: 10, backgroundColor: this.state.selected === address ? "green" : colors.PRIMARY_BACKGROUND}}>
           <Text style={{color: "white", fontSize: 18, textAlign: "center", marginLeft: 20}}>{address}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  MainView = () => {
    return(
      this.state.sending ?
      <ActivityIndicator 
      style={{flex: 1, width: '100%', height: '100%'}} 
      size='large'/>
      :
      <ScrollView nestedScrollEnabled={true}>
        <Image source={this.bg} style={styles.background} />
        <Text style={{ textAlign: "center", fontSize: 20, color: "white", padding: 10 }}>Assignments</Text>
        <View style={styles.assContainer}>
          <ScrollView nestedScrollEnabled={true}>
            <SectionList
              data={this.state.assignments}
              extraData={this.state.refresh}
              sections={this.state.assignments.map((ass, index) => { return ({ date: new Date(ass.Date).toDateString(), ass: ass, data: ass.Addresses.filter((add, index) => add.completed===false)})})}
              renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.data.length > 0 ? section.date : null}</Text>}
              renderItem={( item ) => this.renderItem(item)}
              keyExtractor={(item, index) => index}
              showsVerticalScrollIndicator={false}
            />
          </ScrollView>
        </View>
        <View style={{flex: 1}}>
          <TouchableOpacity style={{ marginHorizontal: '30%', marginVertical: '10%' }} onPress={() => this.openCamera()}>
            <Image source={this.state.avatar || require('../config/images/plus.png')} style={this.state.avatar ? { alignSelf: 'center', height: 70, width: 70} : { alignSelf: 'center', height: 40, width: 40 }} />
            <Text style={{ marginTop: 20, alignSelf: 'center', fontSize: 20, color: 'white' }}>{this.state.avatar ? "Change Image" : "Add Image"}</Text>
          </TouchableOpacity>
          {this.formItem(0)}
          {this.boolItem(1)}
          {this.boolItem(2)}
          {this.boolItem(3)}
          <View style={[styles.buttonsContainer]}>
            <TouchableOpacity style={styles.button} onPress={() => { this.handleSubmit() }}>
              <Text style={{ fontSize: 18, color: 'white' }}>Submit</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'center',
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
    color: 'white' 
  },
  assContainer: {
    borderColor: colors.PRIMARY_BACKGROUND,
    height: HEIGHT * .4,
    borderWidth: 2,
    borderRadius: 5,
    padding: 3,
    margin: 5,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    textAlign: "center"
  }
});