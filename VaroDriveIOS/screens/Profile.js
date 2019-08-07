import React from 'react';
import { 
  View, 
  Text, 
  Dimensions, 
  TouchableOpacity, 
  StyleSheet, Image, 
  AsyncStorage} from 'react-native';
import { colors } from '../config/styles'

import axios from 'axios';
import { connect } from 'react-redux';

import constants from '../config/constants' 

import { setLName, setFName, setPic, LOG_OUT } from '../redux/store2'
import FastImage from 'react-native-fast-image'
import capitalize from '../helpers';
import { isIphoneX } from 'react-native-iphone-x-helper';

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
      path = 'file/uploads/profilePics/default.jpg'
    this.state = {
      modalVisible: false,
      modal2Visible: false,
      data: [],
      originalData: [],
      refresh: false,
      sort: "Default",
      showing: "",
      number: 30,
      profilePic: 'https://' + constants.ip + ':3210/' + path,
      profileEditor: false
    }
    this.background = require('../config/images/psbackground.png')
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
      AsyncStorage.setItem(ACCESS_TOKEN, "");
      var url = 'https://' + constants.ip + ':3210/data/users/logout';
      axios.put(url, {id: this.props.userId, value: ""} )
      this.props.LOG_OUT();
      this.props.navigation.navigate("Auth")
    } catch (error) {
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={this.background} style={styles.background}/>
        <View style={{flex: isIphoneX() ? .8 : .5, width: '100%', alignContent: 'center', justifyContent: 'center'}}>          
          <Text style={{ color: 'white', fontSize: 30, textAlign: 'center' }}>{(this.props.fName == "") ? ("Welcome!") : ("Hi " + capitalize(this.props.fName) + "!")}</Text>
        </View>      
        <View style={styles.mainView}>
          <View style={{ flex: 2, alignContent: 'flex-start', justifyContent: 'flex-start' }}>
            <FastImage
              onError={() => {
                this.setState({
                  profilePic: 'https://' + constants.ip + ':3210/' + "file/uploads/profilePics/default.jpg"
                })
              }}
              style={styles.profilePic}
              source={{ uri: this.state.profilePic }}
            />
          </View>
          <TouchableOpacity style={{flex: .7, marginBottom: 10, width: '90%', alignItems: 'center', justifyContent: 'space-around', backgroundColor: colors.PRIMARY_BACKGROUND, borderRadius: 20}} onPress={() => {this.props.navigation.navigate("AllAssignments")}}>
           <Text style={{color: 'white', fontSize: 20}}>
              View Assignments
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: .5, width: '100%'}}>
          <View style={{ flex: .75, marginHorizontal: 5, backgroundColor: 'transparent', flexDirection: 'row'}}>
            <TouchableOpacity style={styles.bottomButtons} onPress={() => this.props.navigation.navigate("ShowDBs")}>
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
        <View style={{marginBottom: isIphoneX() ? 25 : 0}}/>
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
  mainView: {
    flex: 1.5, width: '100%', 
    alignContent: 'space-around', 
    justifyContent: 'space-around', 
    alignItems: 'center',
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
  profilePic: {
    height: 195, 
    width: 195, 
    borderRadius: 101, 
    borderWidth: 3, 
    borderColor: colors.PRIMARY_BACKGROUND,
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