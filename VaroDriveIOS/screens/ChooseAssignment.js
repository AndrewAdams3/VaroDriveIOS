import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image} from 'react-native';
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
    setID: (id) => { dispatch(setID(id)) }
  };
}

class ChooseAssignment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render(){
    return(
      <View>

      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseAssignment);