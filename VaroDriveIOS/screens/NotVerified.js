import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import axios from 'axios'
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    setID: (id) => { dispatch(setID(id)) },
  };
}

class NotVerifiedScreen extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      verified: true
    }
    this.userId = this.props.navigation.getParam('userId');
    this.bg = require('../config/images/background.png');
    this.logo = require("../config/images/VaroLogo.png");
  }

  isVerified = () => {
    var url = 'http://' + constants.ip + ':3210/data/users/signup/isVerified/' + this.props.userId;
    axios.get(url)
      .then( (res) => {
        console.log("validated: ? ", res.data.ok)
        if(res.data.ok == true) {
          this.props.navigation.navigate('UserInfo');
        }
        else{
          console.log("not verified")
          this.setState({verified: false});
        }
      }, (err) => {
        console.log("error checking verification: ", err);
      })
  }

  render(){
    return(
      <View style={styles.container}>
        <Image source={this.bg} style={styles.background} />
        <View style={styles.container}>
          <TouchableOpacity style={{flex: .6}} onPress={this.isVerified}>
            <Image source={this.logo} style={styles.logo} />
          </TouchableOpacity>
          <View style={[styles.container, {flex: .4}]}>
            <View style={{flex: 1}}>
              <Text style={{ fontSize: 16, textAlign: 'center', color: this.state.verified ? 'transparent' : 'red' }}>
                Account has not yet been verified
              </Text>
              <Text style={{ justifyContent: 'space-around', fontSize: 20, textAlign: 'center', color: 'white'}}>
                Please check your email to finish registering your account
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{ justifyContent: 'space-around', fontSize: 16, textAlign: 'center', color: 'white' }}>
                Tap the icon once you have verified you email
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotVerifiedScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
  }, 
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: .9,
    overlayColor: 'grey'
  },
  logo: {
    marginTop: '10%',
    opacity: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignSelf: 'center',
    tintColor: 'white',
    height: '80%'
  },
})