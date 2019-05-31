import React from 'react';
import { 
  View, 
  Text, 
  Picker, 
  Dimensions, 
  TouchableOpacity, StatusBar, 
  StyleSheet, Image, 
  ActivityIndicator, 
  AsyncStorage, Modal, 
  FlatList, Platform } from 'react-native';
import { colors } from '../config/styles'

import axios from 'axios';
import { connect } from 'react-redux';

import constants from '../config/constants' 

import { setLName, setFName, setPic, LOG_OUT } from '../redux/store2'
import FastImage from 'react-native-fast-image'
import LoadImage from '../components/LoadImage';
import ShowEditor from './ShowEditor'
import capitalize from '../helpers';
import { isIphoneX } from 'react-native-iphone-x-helper';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;
const ACCESS_TOKEN = 'access_token';

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
    fName: state.fName,
    lName: state.lName,
    profilePic: state.profilePic
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFName: (text) => { dispatch(setFName(text)) },
    setLName: (text) => { dispatch(setLName(text)) },
    setPic: (pic) => { dispatch(setPic(pic)) },
    LOG_OUT: () => {dispatch(LOG_OUT())}
  };
}

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props)
    var path = ''
    if(this.props.profilePic){
      path = this.props.profilePic.split('\\')
      path = path.join('/')
    }
    else
      path = 'file/uploads/profilePics/default.png'
    this.state = {
      modalVisible: false,
      modal2Visible: false,
      data: [],
      originalData: [],
      refresh: false,
      sort: "Default",
      showing: "",
      number: 20,
      profilePic: 'http://' + constants.ip + ':3210/' + path,
      profileEditor: false
    }
    this.background = require('../config/images/background.png')
    this.prof = require('../config/images/myprof.jpg')
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        "Profile"
      ),
      headerTransparent: true,
    }
  };
  removeToken = async () => {
    try {
      console.log("token: " + await AsyncStorage.getItem(ACCESS_TOKEN));
      AsyncStorage.setItem(ACCESS_TOKEN, "");
      console.log("token removed");
      console.log("token: " + await AsyncStorage.getItem(ACCESS_TOKEN));
      var url = 'http://' + constants.ip + ':3210/data/users/logout';
      axios.put(url, {id: this.props.userId, value: ""} )
      this.props.LOG_OUT();
      this.props.navigation.navigate("Auth")
    } catch (error) {
      console.log("Something went wrong");
    }
  }

  showPic = () => {
    if(this.state.modal2Visible == true){
      var pic = "https://s3-us-west-1.amazonaws.com/varodrive/" + this.state.showing;
      console.log("URLTEST: ", pic);
      return (
        <TouchableOpacity style={{flex: 1, width: WIDTH, height: HEIGHT, justifyContent: 'space-around', alignContent: 'space-around', marginTop: 0}} onPress={() => this.setState({modal2Visible: false})}>
          <View style={[styles.container, {marginTop: 0, alignContent: 'space-around', alignItems: 'center'}]}>
            <LoadImage style={{height: HEIGHT * .8, width: WIDTH * .8, resizeMode: 'contain'}} source={{uri: pic}}/>
          </View>
        </TouchableOpacity>
      )
    }
  }
  listItem = ({item}) => {
    const d = new Date(item.date)
    console.log("path: " + item.picturePath);
    //var url = 'http://' + constants.ip + ':3210/pictures/' + item.picturePath;
    return(
      <View style={{ flex: 1, borderBottomColor: 'white', borderBottomWidth: 1, width: WIDTH}}>
        <View style={{flex: 1, flexDirection: 'row', margin: 5}}>
          <TouchableOpacity 
          style={{flex: 1, marginTop: 10, justifyContent: 'space-around', alignItems: 'center', borderWidth: 3, borderRadius: 10, borderColor: colors.SECONDARY_BACKGROUND}}
          onPress={() => { this.setState({ showing: item.picturePath }); this.setState({modal2Visible: true})}}>
            {/* <LoadImage 
              style={{marginLeft: 10, marginTop: 10, flex: 1, height: 110, width: 110, alignSelf: 'center', resizeMode: 'cover'}}
              source={{uri: url}}
            /> */}
            <Text style={{textAlign: 'center', color: 'white'}}>Press to See Picture</Text>
          </TouchableOpacity>
          <View style={{flex: .5}}/>
          <View style={{marginTop: 10, flex: 1, flexDirection: 'column', alignItems: 'flex-start'}}>
            <Text style={{ textAlign: 'left', color: 'white'}}>
              {"Date Found: " + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear()}
            </Text>
            <Text style={{ textAlign: 'left', color: 'white' }}>
              {"Type: " + item.type}
            </Text>
            <Text style={{ textAlign: 'left', color: 'white' }}>
              {"Vacant? " + (item.vacant == true ? "Yes" : "No")}
            </Text>
            <Text style={{ textAlign: 'left', color: 'white' }}>
              {"Burned? " + (item.burned == true ? "Yes" : "No")}
            </Text>
            <Text style={{ textAlign: 'left', color: 'white' }}>
              {"Boarded? " + (item.boarded == true ? "Yes" : "No")}
            </Text>
          </View>
        </View>
        <Text style={{ textAlign: 'center', padding: 10, fontSize: 18, color: 'white'}}>{item.address}</Text>
      </View>
    )
  }

  dateSort = () => {
    var data = this.state.originalData;
    data.sort( (prop1, prop2) => {
      const p1 = new Date(prop1.date)
      const p2 = new Date(prop2.date)
      if(p1 > p2) return -1
      else if(p1 < p2) return 1
      else return 0
    })
    data = data.slice(0,this.state.number);
    this.setState({data: data, refresh: !this.state.refresh});
    console.log(data);
  }
  typeSort = () => {
    var data = this.state.originalData;
    data.sort( (prop1, prop2) => {
      console.log(prop1 + prop1.type)
      if(prop1.type < prop2.type){
        return -1
      }
      else if (prop1.type > prop2.type){
        return 1
      }
      return 0
    })
    data = data.slice(0, this.state.number);
    this.setState({ data: data, refresh: !this.state.refresh })
  }
  showProps = () => {
    return(
      this.state.loading ? 
      <View style={styles.container}>
        <ActivityIndicator /> 
        <StatusBar barStyle='dark-content' />
      </View > 
      :
      <View style={[styles.container, {marginTop: 0}, this.state.modal2Visible ? {opacity: .8} : {}]}>
        <Modal
          animationType='fade'
          transparent={true}
          presentationStyle="overFullScreen"
          visible={this.state.modal2Visible}
          onRequestClose={() => { () => this.setState({ modal2Visible: false }) }}>
          {this.showPic()}
        </Modal>
        <Image source={this.background} style={styles.background} />
        {Platform.OS == "ios" && 
          <View style={{width: "100%", height: 80, backgroundColor: colors.PRIMARY_BACKGROUND}}></View>
        }
        {Platform.OS == "android" && 
        <View style={{width: '100%', height: 80, padding: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: colors.PRIMARY_BACKGROUND}}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Sort By: </Text>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>{this.state.sort}</Text>
          <Picker
            selectedValue={this.state.sort}
            style={{height: 50, width: 50}}
            onValueChange={(item, index) => {
              console.log("check")
              this.setState({sort: item})
              switch(item){
                case "Date":
                  this.dateSort()
                  break;
                case "Type":
                  this.typeSort()
                  break;
                default:
                  break;
              }
            }}
          >
            <Picker.Item label="Default (Date)" value="Default" />
            <Picker.Item label="Date" value="Date" />
            <Picker.Item label="Type" value="Type" />
          </Picker>}
          <View style={{flex: .5}} />
          <Text style={{ color: 'white', textAlign: 'right', fontSize: 18 }}>Show: </Text>
          <Picker
            selectedValue={this.state.number}
            style={{ height: 50, width: 50 }}
            onValueChange={(item, index) => {
              console.log("check", item)
              this.setState({ number: item, data: this.state.originalData.slice(0, item), refresh: !this.state.refresh })
              console.log(this.state.data);
              }
            }
          >
            <Picker.Item label="Default (20)" value={10} />
            <Picker.Item label="5" value={5} />
            <Picker.Item label="10" value={10} />
            <Picker.Item label="20" value={20} />
          </Picker>
        </View>}
        <View style={{flex: 3, alignContent: 'center', justifyContent: 'space-around'}}>
          <FlatList 
            data={this.state.data}
            extraData={this.state.refresh}
            renderItem={this.listItem}
            keyExtractor={(item, index) => { return item ? item._id : index.toString() }}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={{flex: .4, width: '100%', justifyContent: 'space-around', alignItems: 'center'}}>
          <TouchableOpacity style={[styles.button, { width: '80%', height: '80%' }]} onPress={() => this.setState({ modalVisible: false })}>
            <Text style={styles.buttonText}>Return</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  getDriveBys = async () => {
    var url = 'http://' + constants.ip + ':3210/data/DriveBys/byUserId';
    this.setState({loading: true});
    if(this.props.userId){
      await axios.post(url, {
        id: this.props.userId,
      }).then((Data) => {
        if(Data.data.response == 0){
          console.log("checking");
          this.setState({
            data: Data.data.docs,
            originalData: Data.data.docs,
            refresh: !this.state.refresh,
            loading: false
          })
        }
      }).then( () => {
        this.setState({loading: false});
        this.dateSort();
        }
      )
    }
  }

  openModal = () => {
    this.getDriveBys();
    this.setState({ modalVisible: true })
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={this.background} style={styles.background}/>
        <View style={{flex: .5, width: '100%', alignContent: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>{(this.props.fName == "") ? ("Welcome!") : ("Hi " + capitalize(this.props.fName) + "!")}</Text>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => { () => this.setState({ modalVisible: false }) }}>
          {this.showProps()}
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.profileEditor}
          onRequestClose={() => { () => this.setState({ profileEditor: false }) }}>
          <ShowEditor props={this.props} changePic={(pic) => this.setState({ profilePic: 'http://' + constants.ip + ':3210/' + pic})} close={() => this.setState({ profileEditor: false })} pic={this.state.profilePic}/>
        </Modal>
        
        <View style={{flex: 3, width: '100%', alignContent: 'space-around', justifyContent: 'space-around', alignItems: 'center' }}>
          <View style={{ flex: 2, alignContent: 'space-around', justifyContent: 'space-around' }}>
            <FastImage
              style={styles.profilePic}
              source={{ uri: this.state.profilePic }}
            />
          </View>
          <View style={{flex: 1, marginBottom: 10, width: '100%', borderColor: 'white', borderWidth: 1, alignItems: 'center', justifyContent: 'space-around'}}>
            <Text style={{color: 'white'}}>
              Possible Usage Statistics Section
            </Text>
          </View>
        </View>
        <View style={{flex: 1, width: '100%'}}>
          <View style={{ flex: .75, marginHorizontal: 5, backgroundColor: 'transparent', flexDirection: 'row'}}>
            <TouchableOpacity style={styles.bottomButtons} onPress={this.openModal}>
              <Text style={{ color: 'white', fontSize: 20 }}>View Properties</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButtons} onPress={() => this.props.navigation.navigate("Edit")}>
              <Text style={{ color: 'white', fontSize: 20 }}>Edit Profile</Text> 
            </TouchableOpacity>
          </View>
          <View style={{ flex: .5, width: '100%'}}>
            <TouchableOpacity onPress={this.removeToken} style={styles.logoutButton}>
              <Text style={{ color: 'white', fontSize: 15}}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
    marginTop: 80,
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
  image: {
    width: '100%',
    height: '100%',
    tintColor: 'white',
    resizeMode: 'contain'
  },
  bottomButtons:{
    width: '50%',
    backgroundColor: colors.PRIMARY_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: .9,
    borderWidth: 1,
    borderColor: colors.SECONDARY_BACKGROUND,
    borderRadius: 10,
    borderBottomEndRadius: 0,
    borderBottomLeftRadius: 0
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
  profilePic: {
    height: 195, 
    width: 195, 
    borderRadius: 101, 
    borderWidth: 3, 
    borderColor: colors.PRIMARY_BACKGROUND
  },
  logoutButton: { 
    flex: 1, 
    borderWidth: 3, 
    margin: 5, 
    backgroundColor: colors.PRIMARY_BACKGROUND, 
    opacity: .9, 
    justifyContent: 'space-around', 
    alignContent: 'center', 
    alignItems: 'center',
    borderColor: 'white',
    borderRadius: 5
  }
});